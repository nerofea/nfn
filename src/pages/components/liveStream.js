import React from "react";
import LiveOnScreenEngagementTool from "./static/liveOnScreenEngagementTool";
import Streamchat from "./streamChat";
import PlayScreen from "./playScreen";


const liveStream = () => {
  return (
    <div>
        <PlayScreen />
        <Streamchat />
        <LiveOnScreenEngagementTool />
        
        <EventListing/>
        <PollListing/>
        <AdvertisortListing/>
        <CampaignListing/>
        <LoyaltyTokenPairListing/>
        <LiveStream/>
    </div>
  );
};

export default liveStream;
