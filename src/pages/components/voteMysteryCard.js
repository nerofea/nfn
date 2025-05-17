import React, { useState } from "react";

const MysteryHolidayCard = () => {
  const [wallet, setWallet] = useState(null);

  const handleBuy = async () => {
    try {
      const res = await fetch("/api/create-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setWallet(data.wallet?.publicKey);
      console.log("🪪 New wallet created:", data.wallet?.publicKey);

      // TODO: Proceed with tx, minting, etc.
    } catch (err) {
      console.error("❌ Wallet creation failed", err);
    }
  };

  const [form, setForm] = useState({
    title: "",
    amount: "",
    fiat: "EUR",
    deliveryAddress: "",
    dateFrom: "",
    dateTo: "",
  });

  return (
    <div className="bg-green-900 text-white p-4 rounded-lg max-w-md space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="bg-green-700 px-2 py-1 font-bold border-2 border-purple-400">
          MYSTERY HOLIDAY
        </span>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-200">EUR</span>
          <span className="text-gray-400">Amt</span>
          <span className="font-bold text-white">7.039</span>
        </div>
      </div>

      {/* Token Pair */}
      <div className="flex gap-2 font-bold">
        <span>SHY</span>
        <span>|</span>
        <span>BRNK</span>
        <span className="bg-green-800 px-2 py-1 rounded">GIFT</span>
      </div>

      {/* Buy Button */}
      <button
        onClick={handleBuy}
        className="w-full mt-2 bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-300 transition"
      >
        BOOK NOW
      </button>

      {/* Optional Wallet Info Display */}
      {wallet && (
        <p className="text-xs text-green-300 mt-2 break-all">
          🪪 Wallet Created: <br /> {wallet}
        </p>
      )}
    </div>
  );
};

export default MysteryHolidayCard;
