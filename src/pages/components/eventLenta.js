import React, { useState } from "react";
import eventCard from "./EventCard";

export default function EventLenta() {

  return (
    <>
      <div className="p-4 bg-black text-white font-sans space-y-4">
        <EventCard />
      </div>
      <div className="p-4 bg-black text-white font-sans space-y-4">
        <EventCard />
      </div>
      <div className="p-4 bg-black text-white font-sans space-y-4">
        <EventCard />
      </div>
      <div className="p-4 bg-black text-white font-sans space-y-4">
        <EventCard />
      </div>
      <div className="p-4 bg-black text-white font-sans space-y-4">
        <EventCard />
      </div>
      <div className="p-4 bg-black text-white font-sans space-y-4">
        <EventCard />
      </div>
    </>
  );
}
