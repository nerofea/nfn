export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed");
  
    const { user_id, poll_id, vote_option_id } = req.body;
  
    if (!user_id || !poll_id || !vote_option_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    // TODO: Record vote in DB
    return res.status(200).json({ message: "Vote submitted" });
  }
  