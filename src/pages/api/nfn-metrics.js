export default async function handler(req, res) {
    // Replace this with real Solana data fetch or DB query
    res.status(200).json({
      latestActivity: 21576434,
      finalizedBlock: 21576433,
      signedExtrinsics: 35776175,
      transfers: 33035964,
      totalIssuance: "~1.76B",
      totalAccounts: 1248983,
    });
  }
  