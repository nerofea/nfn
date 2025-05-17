import React, { useEffect, useState } from "react";
import Image from "next/image";

const PlayScreen = ({ streamId = "stream123" }) => {
  const [branding, setBranding] = useState(null);

  useEffect(() => {
    async function fetchBranding() {
      try {
        const res = await fetch(`/api/branding/${streamId}`);
        const data = await res.json();
        setBranding(data);
      } catch (err) {
        console.error("Failed to load branding", err);
      }
    }
    fetchBranding();
  }, [streamId]);

  if (!branding) return <div className="text-white p-8">Loading stream...</div>;

  return (
    <div
      className="relative w-full h-screen text-white overflow-hidden"
      style={{ backgroundColor: branding.primary_color }}
    >
      {/* Background image overlay */}
      <Image
        src={branding.bg_url || "/fallback-bg.jpg"}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="opacity-40"
      />
      <div>
        <input id="search-input" type="text" placeholder="Search background..." />
        <button id="search-btn">Search</button>
      </div>

      <div id="photo-results" style="display: flex; flex-wrap: wrap;"></div>

      <div id="stream-background" style="width: 100%; height: 400px; margin-top: 20px;">
        <!-- This is the stream background -->
      </div>


      {/* Logo Top Left */}
      <div
        className="absolute top-4 left-4 p-2 px-4 rounded-lg"
        style={{ backgroundColor: branding.secondary_color }}
      >
        <Image
          src={branding.logo_url || "/fallback-logo.png"}
          alt="Logo"
          width={80}
          height={30}
        />
      </div>

      {/* Top Center Label */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-md border-t-4"
        style={{
          backgroundColor: branding.secondary_color,
          borderColor: branding.accent_color,
        }}
      >
        <span className="text-sm font-semibold">{branding.event_title}</span>
      </div>

      {/* Top Right Label */}
      <div
        className="absolute top-4 right-36 px-4 py-1 rounded-md border-t-4"
        style={{
          backgroundColor: branding.secondary_color,
          borderColor: branding.accent_color,
        }}
      >
        <span className="text-sm">INFO</span>
      </div>

      {/* Top Right Box */}
      <div className="absolute top-12 right-4 w-[200px] h-[180px] rounded-lg border border-purple-600 shadow-lg"
           style={{ backgroundColor: branding.secondary_color }} />

      {/* Bottom Right Box */}
      <div className="absolute bottom-20 right-4 w-[200px] h-[180px] rounded-lg border border-purple-600 shadow-lg"
           style={{ backgroundColor: branding.secondary_color }} />

      {/* Bottom Bar */}
      <div
        className="absolute bottom-4 left-4 right-4 h-[40px] rounded-md border-t-4 px-4 flex items-center"
        style={{
          backgroundColor: branding.secondary_color,
          borderColor: branding.accent_color,
        }}
      >
        <span className="text-sm">Stream Info / Viewer Stats / Interaction</span>
      </div>
    </div>
  );
};

export default PlayScreen;
