export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed");
  
    const { campaign_id, loyalty_token_id } = req.body;
  
    if (!campaign_id || !loyalty_token_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    // TODO: Append token to campaign in DB
    return res.status(200).json({ message: "Token appended to campaign" });
  }
  