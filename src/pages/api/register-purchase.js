import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // user_id must ultimately come from authenticated session, not an untrusted body.
  // Until auth is wired, this endpoint must not be exposed to public clients.
  if (process.env.NFN_INTERNAL_API_KEY === undefined ||
      req.headers["x-nfn-internal-key"] !== process.env.NFN_INTERNAL_API_KEY) {
    return res.status(403).json({ error: "Internal access only" });
  }

  const { user_id, product_id, quantity = 1 } = req.body ?? {};
  if (!UUID.test(user_id ?? "") || !UUID.test(product_id ?? "") ||
      !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 100) {
    return res.status(400).json({ error: "Invalid user, product, or quantity" });
  }

  try {
    // Prices are obtained from the catalog, not from client-supplied amounts.
    // Registration is NOT proof of payment. Never mint rewards at this stage.
    const result = await pool.query(
      `INSERT INTO purchases (user_id, product_id, quantity, unit_price, fiat_amount, payment_status)
       SELECT $1::uuid, p.id, $3::integer, p.minprice,
              ROUND(p.minprice * $3::numeric, 2), 'pending'
       FROM products p
       WHERE p.id = $2::uuid AND p.minprice IS NOT NULL AND p.minprice >= 0
       RETURNING id, user_id, product_id, quantity, unit_price, fiat_amount, payment_status, created_at`,
      [user_id, product_id, quantity]
    );

    if (!result.rowCount) return res.status(404).json({ error: "Product not found or not priced" });
    return res.status(201).json({ purchase: result.rows[0] });
  } catch (error) {
    console.error("Purchase registration failed", error);
    if (error.code === "23503") return res.status(404).json({ error: "User not found" });
    return res.status(500).json({ error: "Could not register purchase" });
  }
}
