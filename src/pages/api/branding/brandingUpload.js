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



