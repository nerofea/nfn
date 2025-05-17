import React, { useEffect, useState } from "react";

export const NFNMetricsSummary = () => {
  const [metrics, setMetrics] = useState({
    latestActivity: 0,
    finalizedBlock: 0,
    signedExtrinsics: 0,
    transfers: 0,
    totalIssuance: "~0",
    totalAccounts: 0,
  });

  useEffect(() => {
    async function fetchMetrics() {
      const res = await fetch("/api/nfn-metrics");
      const data = await res.json();
      setMetrics(data);
    }
    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6 p-6 bg-white text-black rounded-xl shadow-md">
      <div>
        <div className="text-sm text-gray-500">Latest Activity</div>
        <div className="text-lg font-semibold">{metrics.latestActivity}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Finalized Block</div>
        <div className="text-lg font-semibold">{metrics.finalizedBlock}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Signed Extrinsics</div>
        <div className="text-lg font-semibold">{metrics.signedExtrinsics}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Transfers</div>
        <div className="text-lg font-semibold">{metrics.transfers}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Total Issuance (NFN)</div>
        <div className="text-lg font-semibold">{metrics.totalIssuance}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Total Accounts</div>
        <div className="text-lg font-semibold">{metrics.totalAccounts}</div>
      </div>
    </div>
  );
};
