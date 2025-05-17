import React from "react";
import Image from "next/image";

const events = [
  {
    title: "Join CoWorking",
    desc: "Collaborate with creatives & builders. Powered by Solana.",
    logo: "/token-logo.svg",
  },
  {
    title: "Hackathon Crew",
    desc: "Earn rewards by managing events and content.",
    logo: "/token-logo.svg",
  },
  {
    title: "Travel Campaign",
    desc: "Vlog your journey and get rewarded.",
    logo: "/token-logo.svg",
  },
];

const EventListing = () => {
  return (
    <div className="w-full overflow-x-auto py-8">
      <div className="flex gap-6 min-w-max">
        {events.map((event, i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-5 rounded-2xl min-w-[280px] h-[420px] backdrop-blur-xl border border-white/20 bg-white/10 text-white shadow-lg"
          >
            <div className="inline-flex items-center gap-2 text-sm font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              <Image src={event.logo} width={20} height={20} alt="Token Logo" />
              TOKEN
            </div>
            <div className="mt-auto">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-sm opacity-90">{event.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventListing;
