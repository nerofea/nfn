import React, { useState } from "react";
import advertCard from "./AdvertCard";

export default function AdvertisingLenta() {

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
