import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } };

import db from "@/lib/db";

export default async function handler(req, res) {
  const uploadDir = path.join(process.cwd(), "public/uploads");
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    filename: (_, file) => file.originalFilename,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload failed" });

    const branding = {
        stream_id: fields.streamId,
        event_title: fields.eventTitle,
        primary_color: fields.primaryColor,
        secondary_color: fields.secondaryColor,
        accent_color: fields.accentColor,
        logo_url: "/uploads/" + files.logo[0].originalFilename,
        bg_url: "/uploads/" + files.bg[0].originalFilename,
      };

    await db.query(
        `INSERT INTO stream_branding (stream_id, logo_url, bg_url, event_title, primary_color, secondary_color, accent_color)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (stream_id) DO UPDATE SET
        logo_url = EXCLUDED.logo_url,
        bg_url = EXCLUDED.bg_url,
        event_title = EXCLUDED.event_title,
        primary_color = EXCLUDED.primary_color,
        secondary_color = EXCLUDED.secondary_color,
        accent_color = EXCLUDED.accent_color
        `,
        [
        branding.stream_id,
        branding.logo_url,
        branding.bg_url,
        branding.event_title,
        branding.primary_color,
        branding.secondary_color,
        branding.accent_color,
        ]
    );

    // Save `branding` to your DB — replace with actual DB insert/update logic
    // await db.upsertBranding(branding);

    res.status(200).json({ message: "Saved", branding });
  });
}


import { useState } from "react";

export default function BrandingUploadForm() {
  const [streamId, setStreamId] = useState("stream123");
  const [eventTitle, setEventTitle] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#6d07ff");
  const [accentColor, setAccentColor] = useState("#ff31cc");
  const [logo, setLogo] = useState(null);
  const [bg, setBg] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("streamId", streamId);
    form.append("eventTitle", eventTitle);
    form.append("primaryColor", primaryColor);
    form.append("secondaryColor", secondaryColor);
    form.append("accentColor", accentColor);
    form.append("logo", logo);
    form.append("bg", bg);

    const res = await fetch("/api/branding-upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setStatus("Branding saved!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-md">
      <input type="text" placeholder="Stream ID" value={streamId} onChange={e => setStreamId(e.target.value)} required />
      <input type="text" placeholder="Event Title" value={eventTitle} onChange={e => setEventTitle(e.target.value)} />
      <label>Primary Color</label>
      <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
      <label>Secondary Color</label>
      <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
      <label>Accent Color</label>
      <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
      <label>Logo</label>
      <input type="file" onChange={(e) => setLogo(e.target.files[0])} />
      <label>Background Image</label>
      <input type="file" onChange={(e) => setBg(e.target.files[0])} />
      <button className="bg-purple-600 text-white p-2 rounded" type="submit">Submit</button>
      {status && <p>{status}</p>}
    </form>
  );
}

