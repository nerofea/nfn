import React from "react";

const MysteryHolidayCard = () => {
  return (
    <div className="bg-green-900 text-white p-4 rounded-lg max-w-md space-y-2">
      <div className="flex justify-between items-center">
        <span className="bg-green-700 px-2 py-1 font-bold border-2 border-purple-400">MYSTERY HOLIDAY</span>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-200">EUR</span>
          <span className="text-gray-400">Amt</span>
          <span className="font-bold text-white">7.039</span>
        </div>
      </div>

      <div className="flex gap-2 font-bold">
        <span className="text-white">SHY</span>
        <span className="text-white">|</span>
        <span className="text-white">BRNK</span>
        <span className="bg-green-800 px-2 py-1 rounded">GIFT</span>
      </div>
    </div>
  );
};

export default MysteryHolidayCard;


return 

const handleBuy = async () => {
  const userId = "user-" + Math.random().toString(36).substring(2, 10); // Or use auth ID
  const res = await fetch("/api/create-wallet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  console.log("🪪 New wallet created:", data.wallet.publicKey);
};