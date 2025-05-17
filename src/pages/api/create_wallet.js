import { generateWalletForUser } from "@/utils/generate_wallet";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Only POST allowed");

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const wallet = await generateWalletForUser(userId);
    res.status(200).json({ success: true, wallet });
  } catch (err) {
    res.status(500).json({ error: "Wallet generation failed", detail: err.message });
  }
}
