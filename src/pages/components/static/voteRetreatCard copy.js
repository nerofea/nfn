import React from "react";

const WellnessRetreatCard = () => {
  return (
    <div className="bg-green-900 text-white p-4 rounded-lg max-w-md">
      <div className="flex justify-between items-center">
        <span className="bg-green-700 px-2 py-1 font-bold border-2 border-purple-400">WELNESS RETREAT</span>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-200">EUR</span>
          <span className="text-gray-400">Amt</span>
          <span className="font-bold text-white">3000</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-center text-green-300 font-semibold mb-1">RESERVE DATE</div>
        <div className="flex justify-center gap-2 bg-black px-2 py-1 font-mono text-sm">
          <span>30/11/2024</span>
          <span>-</span>
          <span>5/11/2024</span>
        </div>
      </div>
    </div>
  );
};

export default WellnessRetreatCard;


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