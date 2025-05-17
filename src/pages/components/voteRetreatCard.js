import React, { useState } from "react";

const WellnessRetreatCard = () => {
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

      // TODO: Continue with mint, transfer, backend sync, etc.
    } catch (err) {
      console.error("❌ Wallet creation failed", err);
    }
  };

  const [form, setForm] = useState({
    amount: product.minPrice,
    fiat: user.preferredFiat || "EUR",
    dateFrom: product.startDate,
    dateTo: product.recommendedEndDate,
    deliveryAddress: user.deliveryAddress || "",
  });
  

  return (
    <div className="bg-green-900 text-white p-4 rounded-lg max-w-md space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="bg-green-700 px-2 py-1 font-bold border-2 border-purple-400">
          WELLNESS RETREAT
        </span>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-200">EUR</span>
          <span className="text-gray-400">Amt</span>
          <span className="font-bold text-white">3000</span>
        </div>
      </div>

      {/* Reserve Date */}
      <div>
        <div className="text-center text-green-300 font-semibold mb-1">RESERVE DATE</div>
        <div className="flex justify-center gap-2 bg-black px-2 py-1 font-mono text-sm">
          <span>30/11/2024</span>
          <span>-</span>
          <span>5/12/2024</span>
        </div>
      </div>

      {/* Buy Button */}
      <button
        onClick={handleBuy}
        className="w-full bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-300 transition"
      >
        RESERVE NOW
      </button>

      {/* Wallet Display */}
      {wallet && (
        <p className="text-xs text-green-300 mt-2 break-all">
          🪪 Wallet Created: <br /> {wallet}
        </p>
      )}
    </div>
  );
};

export default WellnessRetreatCard;
