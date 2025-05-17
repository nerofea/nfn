import React from "react";

const BroncoJumperCard = () => {
  return (
    <div className="bg-green-900 text-white p-4 rounded-lg max-w-md space-y-2">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="bg-green-700 px-2 py-1 font-bold border-2 border-purple-400">BUY BRONCO JUMPER</span>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-200">EUR</span>
          <span className="text-gray-400">Amt</span>
          <span className="font-bold text-white">47</span>
        </div>
      </div>

      {/* Tokens */}
      <div className="flex gap-2 font-bold">
        <span className="text-white">SHY</span>
        <span className="text-white">|</span>
        <span className="text-white">BRNK</span>
        <span className="bg-green-800 px-2 py-1 rounded">GIFT</span>
      </div>

      {/* Address */}
      <div>
        <span className="text-xs text-gray-300 font-semibold">TYPE IN DELIVERY ADDRESS</span>
        <input
          className="w-full mt-1 bg-green-700 text-white px-3 py-2 rounded font-bold placeholder:text-white"
          placeholder="TYPE YOUR ADDRESS HERE."
        />
      </div>

      {/* Delivery Fees */}
      <div className="flex justify-between items-center text-xs text-white mt-1">
        <span>DELIVERY FEES</span>
        <span className="font-bold text-white">+70 EUR</span>
      </div>
    </div>
  );
};

export default BroncoJumperCard;


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