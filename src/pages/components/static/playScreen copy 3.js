import React from "react";
import Image from "next/image";

const PlayScreen = () => {
  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Background image overlay */}
      <Image
        src="/bronco-bg.jpg" // Replace with actual path
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="opacity-40"
      />

      {/* Logo Top Left */}
      <div className="absolute top-4 left-4 bg-green-900 p-2 px-4 rounded-lg">
        <span className="font-bold text-lg tracking-wide text-[#b4ffcd]">🅁 BRONCO</span>
      </div>

      {/* Top Center Label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-900 px-4 py-1 rounded-md border-t-4 border-purple-500">
        <span className="text-sm font-semibold">EVENT TITLE</span>
      </div>

      {/* Top Right Label */}
      <div className="absolute top-4 right-36 bg-green-900 px-4 py-1 rounded-md border-t-4 border-purple-500">
        <span className="text-sm">INFO</span>
      </div>

      {/* Top Right Box (Chat or Info) */}
      <div className="absolute top-12 right-4 w-[200px] h-[180px] bg-green-900 rounded-lg border border-purple-600 shadow-lg" />

      {/* Bottom Right Box */}
      <div className="absolute bottom-20 right-4 w-[200px] h-[180px] bg-green-900 rounded-lg border border-purple-600 shadow-lg" />

      {/* Bottom Bar */}
      <div className="absolute bottom-4 left-4 right-4 h-[40px] bg-green-900 rounded-md border-t-4 border-purple-500 px-4 flex items-center">
        <span className="text-sm">Stream Info / Viewer Stats / Interaction</span>
      </div>
    </div>
  );
};

export default PlayScreen;
