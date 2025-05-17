import { getBrandingByStreamId, upsertBranding } from "../../../lib/db";

export default async function handler(req, res) {
  const { streamId } = req.query;

  if (req.method === "GET") {
    try {
      const branding = await getBrandingByStreamId(streamId);
      if (!branding) return res.status(404).json({ error: "Not found" });
      res.status(200).json(branding);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch branding" });
    }
  }

  if (req.method === "POST") {
    try {
      const { bg_url } = req.body;
      if (!bg_url) return res.status(400).json({ error: "Missing bg_url" });

      await updateBranding(streamId, { bg_url });
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to update branding" });
    }
  }
}


