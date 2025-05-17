import React, { useState } from "react";
import campaignCard from "./CampaignCard";

export default function CampaignLenta() {

  return (
    <>
      <div className="p-4 bg-black text-white font-sans space-y-4">
        <AdvertCard />
      </div>
      <div className="p-4 bg-black text-white font-sans space-y-4">
        <AdvertCard />
      </div>
      <div className="p-4 bg-black text-white font-sans space-y-4">
        <AdvertCard />
      </div>
      <div className="p-4 bg-black text-white font-sans space-y-4">
        <AdvertCard />
      </div>
      <div className="p-4 bg-black text-white font-sans space-y-4">
        <AdvertCard />
      </div>
      <div className="p-4 bg-black text-white font-sans space-y-4">
        <AdvertCard />
      </div>
    </>
  );
}
