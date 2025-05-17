export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed");
  
    const { campaign_id, updates } = req.body;
  
    if (!campaign_id || !updates) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    // TODO: Apply updates to campaign in DB
    return res.status(200).json({ message: "Campaign updated" });
  }
  