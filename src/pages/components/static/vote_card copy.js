import React from "react";

const TradeActionCard = () => {
  return (
    <div className="bg-[#6d07ff] text-white p-4 rounded-2xl w-full max-w-xs shadow-lg">
      {/* Action Buttons */}
      <div className="flex justify-between mb-4">
        <button className="bg-[#ff31cc] text-white px-4 py-2 rounded-xl font-semibold">
          BUY
        </button>
        <button className="bg-[#280062] text-white px-4 py-2 rounded-xl font-semibold">
          SELL
        </button>
      </div>

      {/* Token Pair and Prices */}
      <div className="flex justify-between items-center text-lg font-mono">
        {/* Buy Side */}
        <div className="flex flex-col items-center">
          <span className="text-xs">SHY</span>
          <span className="text-xl font-bold">0.1873</span>
        </div>

        {/* Divider */}
        <span className="text-black font-bold text-2xl">|</span>

        {/* Sell Side */}
        <div className="flex flex-col items-center">
          <span className="text-xs">BRN</span>
          <span className="text-xl font-bold">2.7563</span>
        </div>
      </div>
    </div>
  );
};

export default TradeActionCard;
