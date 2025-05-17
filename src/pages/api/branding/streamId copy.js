import React, { useEffect, useState } from "react";
import Image from "next/image";

const PlayScreen = ({ streamId }) => {
  const [branding, setBranding] = useState(null);

  useEffect(() => {
    async function fetchBranding() {
      const res = await fetch(`/api/branding/${streamId}`);
      const data = await res.json();
      setBranding(data);
    }
    fetchBranding();
  }, [streamId]);

  if (!branding) return <div>Loading...</div>;

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: branding.primary_color || "#000" }}
    >
      {/* Background image overlay */}
      <Image
        src="/bronco-bg.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="opacity-40"
      />

      {/* Logo */}
      <div className="absolute top-4 left-4 p-2 px-4 rounded-lg" style={{ backgroundColor: branding.secondary_color }}>
        <span className="font-bold text-lg tracking-wide" style={{ color: branding.accent_color }}>
          <Image src={branding.logo_url} alt="Logo" width={80} height={30} />
        </span>
      </div>

      {/* Event Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-md border-t-4" style={{ backgroundColor: branding.secondary_color, borderColor: branding.accent_color }}>
        <span className="text-sm font-semibold">{branding.event_title}</span>
      </div>

      {/* Rest of layout... */}
    </div>
  );
};

export default PlayScreen;
