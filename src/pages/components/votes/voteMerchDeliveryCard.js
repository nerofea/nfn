import React, { useState } from "react";

const BroncoJumperCard = () => {
  const [amount, setAmount] = useState(47);
  const [address, setAddress] = useState("");

  return (
    <div className="bg-green-900 text-white p-4 rounded-lg max-w-md space-y-2">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="bg-green-700 px-2 py-1 font-bold border-2 border-purple-400">
          BUY BRONCO JUMPER
        </span>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-200">EUR</span>
          <span className="text-gray-400">Amt</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="bg-transparent border-b border-gray-500 w-14 text-white text-right"
          />
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
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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
