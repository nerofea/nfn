export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed");
  
    const { campaign_name, start_date, end_date, loyalty_token_id } = req.body;
  
    if (!campaign_name || !loyalty_token_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    // TODO: Save campaign to DB
    return res.status(200).json({ message: "Campaign created successfully" });
  }
  