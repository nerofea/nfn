
export const NFNMetricsSummary = () => {
    return (
      <div className="grid grid-cols-3 gap-6 p-6 bg-white text-black rounded-xl shadow-md">
        <div>
          <div className="text-sm text-gray-500">Latest Activity</div>
          <div className="text-lg font-semibold">21 576 434</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Finalized Block</div>
          <div className="text-lg font-semibold">21 576 433</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Signed Extrinsics</div>
          <div className="text-lg font-semibold">35 776 175</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Transfers</div>
          <div className="text-lg font-semibold">33 035 964</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Total Issuance (NFN)</div>
          <div className="text-lg font-semibold">~1.76B</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Total Accounts</div>
          <div className="text-lg font-semibold">1 248 983</div>
        </div>
      </div>
    );
  };
  