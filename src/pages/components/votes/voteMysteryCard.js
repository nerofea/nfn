import React, { useState } from "react";

const MysteryHolidayCard = () => {
  const [amount, setAmount] = useState("7039");
  const [tag, setTag] = useState("GIFT");

  return (
    <div className="bg-green-900 text-white p-4 rounded-lg max-w-md space-y-2">
      <div className="flex justify-between items-center">
        <span className="bg-green-700 px-2 py-1 font-bold border-2 border-purple-400">
          MYSTERY HOLIDAY
        </span>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-200">EUR</span>
          <span className="text-gray-400">Amt</span>
          <input
            type="number"
            className="bg-transparent text-white border-b border-gray-400 w-20 text-right"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 font-bold items-center">
        <span className="text-white">SHY</span>
        <span className="text-white">|</span>
        <span className="text-white">BRNK</span>
        <input
          className="bg-green-800 px-2 py-1 rounded text-white w-20 text-center"
          value={tag}
          onChange={(e) => setTag(e.target.value.toUpperCase())}
        />
      </div>
    </div>
  );
};

export default MysteryHolidayCard;
