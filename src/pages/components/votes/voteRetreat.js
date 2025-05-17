import React, { useState } from "react";

const WellnessRetreatCard = () => {
  const [amount, setAmount] = useState(3000);
  const [startDate, setStartDate] = useState("2024-11-30");
  const [endDate, setEndDate] = useState("2024-12-05");

  return (
    <div className="bg-green-900 text-white p-4 rounded-lg max-w-md">
      <div className="flex justify-between items-center">
        <span className="bg-green-700 px-2 py-1 font-bold border-2 border-purple-400">
          WELLNESS RETREAT
        </span>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-200">EUR</span>
          <input
            type="number"
            className="bg-transparent text-white border-b border-gray-400 w-16"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-center text-green-300 font-semibold mb-1">RESERVE DATE</div>
        <div className="flex justify-center gap-2 bg-black px-2 py-1 font-mono text-sm">
          <input
            type="date"
            className="bg-transparent text-white"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>-</span>
          <input
            type="date"
            className="bg-transparent text-white"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default WellnessRetreatCard;
