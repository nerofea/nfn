// Screenshot 1 Adapted UI - NFN Metrics Summary Component
import React from "react";

// Screenshot 2 - Full NFN Explorer Component
export const NFNdexplorer = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen text-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">nfn explorer</h1>
        <nav className="space-x-4 text-sm">
          <a href="#">NFN BLOGXPLORER</a>
          <a href="#">Active Advertisors</a>
          <a href="#">Ecom Success Stories</a>
        </nav>
      </div>

      {/* Search Bar */}
      <div className="flex mb-6 items-center space-x-2">
        <input
          type="text"
          placeholder="Block / Address / Identity"
          className="w-full px-4 py-2 border rounded-md"
        />
        <button className="bg-black text-white px-4 py-2 rounded-md">Explore</button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-8 text-sm">
        <div>
          <div className="text-gray-500">Latest Activity</div>
          <div className="text-lg font-semibold">21 576 434</div>
        </div>
        <div>
          <div className="text-gray-500">Latest Purchases</div>
          <div className="text-lg font-semibold">13 000</div>
        </div>
        <div>
          <div className="text-gray-500">Signed Extrinsics</div>
          <div className="text-lg font-semibold">35 058 984</div>
        </div>
        <div>
          <div className="text-gray-500">Transfers</div>
          <div className="text-lg font-semibold">35 058 984</div>
        </div>
        <div>
          <div className="text-gray-500">Total Issuance (NFN)</div>
          <div className="text-lg font-semibold">~1.76B</div>
        </div>
        <div>
          <div className="text-gray-500">Total Accounts</div>
          <div className="text-lg font-semibold">1 248 983</div>
        </div>
        <div>
          <div className="text-gray-500">Total In Staking (NFN)</div>
          <div className="text-lg font-semibold">~675M</div>
        </div>
        <div>
          <div className="text-gray-500">Total In Investments</div>
          <div className="text-lg font-semibold">~493M</div>
        </div>
        <div>
          <div className="text-gray-500">Total In Sponsorships</div>
          <div className="text-lg font-semibold">~182M</div>
        </div>
      </div>

      {/* Livestreams + Transfers Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recently Published Livestreams */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img src="/img/ai-livestream.jpg" alt="AI" className="w-full h-32 object-cover" />
            <div className="p-4 font-semibold text-sm">AI in the MAKING, SHETECH DISCOVERS</div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img src="/img/shuya.jpg" alt="SHUYA" className="w-full h-32 object-cover" />
            <div className="p-4 font-semibold text-sm">SHUYA LIFE TECH</div>
          </div>
        </div>

        {/* Signed Transfers + Upcoming */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="font-bold text-sm mb-2">Signed Transfers</div>
            <div className="text-green-600 text-xs space-y-1">
              <div>23 456 842-2 — 13 secs ago</div>
              <div>23 456 842-2 — 13 secs ago</div>
              <div>23 456 842-2 — 13 secs ago</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="font-bold text-sm mb-2">Upcoming Livestreams</div>
            <img src="/img/vadensvakum.jpg" alt="Event" className="w-full h-24 object-cover rounded-md mb-2" />
            <div className="text-sm font-semibold">Vadensvakum 50th Birthday Party</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-sm">
            <div>Total Paid Out Investment Returns: <strong>24 946 943</strong></div>
            <div>Total Paid Out Sponsorships: <strong>9 083 342</strong></div>
            <div>Total Sent Merch: <strong>2 058 984</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
