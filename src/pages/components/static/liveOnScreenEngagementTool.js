import React, { useState } from "react";

export default function LiveOnScreenEngagementTool() {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    fiat: "EUR",
    deliveryAddress: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 bg-black text-white font-sans space-y-4">
      <h2 className="text-lg font-bold">VOTE THE NEXT FILMED CONTENT:</h2>

      <div className="grid grid-cols-3 gap-4">
        {/* Product Options */}
        <div className="bg-green-800 p-2 rounded">
          <button id="cryptopairvotetitle">WELLNESS RETREAT</button>
        </div>
        <div className="bg-green-800 p-2 rounded">
          <button id="cryptopairvote">MYSTERY HOLIDAY</button>
        </div>
        <div className="bg-green-800 p-2 rounded">
          <button id="cryptopairvote3">BUY BRONCO JUMPER</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Amount"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="bg-green-900 p-2 rounded text-white"
        />
        <select
          name="fiat"
          value={form.fiat}
          onChange={handleChange}
          className="bg-green-900 p-2 rounded text-white"
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>
        <button className="bg-yellow-500 p-2 rounded font-bold">BUY</button>
      </div>

      <div className="flex gap-4">
        <span className="bg-green-900 px-4 py-2 rounded">SHY</span>
        <span className="bg-green-900 px-4 py-2 rounded">BRNK</span>
        <span className="bg-green-900 px-4 py-2 rounded">GIFT</span>
      </div>

      {/* Dates */}
      <div className="flex gap-4">
        <input
          type="date"
          name="dateFrom"
          value={form.dateFrom}
          onChange={handleChange}
          className="bg-black border p-2 rounded"
        />
        <span className="text-xl">-</span>
        <input
          type="date"
          name="dateTo"
          value={form.dateTo}
          onChange={handleChange}
          className="bg-black border p-2 rounded"
        />
      </div>

      {/* Delivery Address */}
      <div>
        <label className="block text-xs text-gray-300">TYPE IN DELIVERY ADDRESS</label>
        <input
          type="text"
          name="deliveryAddress"
          value={form.deliveryAddress}
          onChange={handleChange}
          placeholder="TYPE YOUR ADDRESS HERE."
          className="bg-green-900 w-full p-2 rounded mt-1"
        />
        <p className="text-xs mt-1">DELIVERY FEES MAY APPLY +70 EUR</p>
      </div>
    </div>
  );
}


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
