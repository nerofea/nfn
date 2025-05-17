export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed");
  
    const { user_id, product_id, quantity, loyalty_token_used_id } = req.body;
  
    if (!user_id || !product_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    // TODO: Register purchase in DB
    return res.status(200).json({ message: "Purchase registered" });
  }
  