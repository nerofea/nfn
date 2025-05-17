import db from "@/lib/db";

export default async function handler(req, res) {
  const { streamId } = req.query;

  try {
    const result = await db.query(
      "SELECT * FROM stream_branding WHERE stream_id = $1 LIMIT 1",
      [streamId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Branding not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
}
