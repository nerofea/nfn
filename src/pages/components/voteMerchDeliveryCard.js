import React, { useState } from "react";

const BroncoJumperCard = () => {
  const [address, setAddress] = useState("");
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

      // TODO: Next steps:
      // 1. Send tx to smart contract
      // 2. Mint loyalty token
      // 3. Save tx hash / display receipt
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
          BUY BRONCO JUMPER
        </span>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-200">EUR</span>
          <span className="text-gray-400">Amt</span>
          <span className="font-bold text-white">47</span>
        </div>
      </div>

      {/* Token Pair */}
      <div className="flex gap-2 font-bold">
        <span>SHY</span>
        <span>|</span>
        <span>BRNK</span>
        <span className="bg-green-800 px-2 py-1 rounded">GIFT</span>
      </div>

      {/* Delivery Address Input */}
      <div>
        <span className="text-xs text-gray-300 font-semibold">TYPE IN DELIVERY ADDRESS</span>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mt-1 bg-green-700 text-white px-3 py-2 rounded font-bold placeholder:text-white"
          placeholder="TYPE YOUR ADDRESS HERE."
        />
      </div>

      {/* Delivery Fees */}
      <div className="flex justify-between text-xs text-white">
        <span>DELIVERY FEES</span>
        <span className="font-bold">+70 EUR</span>
      </div>

      {/* Buy Button */}
      <button
        onClick={handleBuy}
        className="w-full mt-2 bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-300 transition"
      >
        BUY NOW
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

export default BroncoJumperCard;