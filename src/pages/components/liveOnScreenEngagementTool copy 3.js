import React, { useState } from "react";
import VoteMerchDeliveryCard from "./VoteMerchDeliveryCard";
import VoteMysteryCard from "./VoteMysteryCard";
import VoteRetreatCard from "./VoteRetreatCard";

export default function LiveOnScreenEngagementTool() {

  return (
    <>
      <div className="p-4 bg-black text-white font-sans space-y-4">
        <VoteMerchDeliveryCard />
      </div>
      <div className="p-4 bg-black text-white font-sans space-y-4">
        <VoteMysteryCard />
      </div>
      <div className="p-4 bg-black text-white font-sans space-y-4">
        <VoteRetreatCard />
      </div>
    </>
  );
}
