import React from "react";
import LiveOnScreenEngagementTool from "../static/liveOnScreenEngagementTool";
import Streamchat from "./streamChat";
import PlayScreen from "../playScreen";

const campaignManagerDashboardPanel = () => {
  return (
    <div>
        <CampaignLenta />
        <LoyaltyTokenPairLenta />
        <LoyaltyTokenLenta />
        
        <ProductLenta/>
        <AdvertisingLenta/>
        <EventLenta/>
        
    </div>
  );
};

export default campaignManagerDashboardPanel;
