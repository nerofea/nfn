#!/usr/bin/env node

const fetch = require('node-fetch');

(async () => {
  const res = await fetch('https://api.mainnet-beta.solana.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getEpochSchedule'
    })
  });
  const data = await res.json();
  const result = data.result || {};
  console.log(`\uD83E\uDDE0 First Normal Epoch: ${result.firstNormalEpoch}`);
  console.log(`\uD83E\uDDE0 First Normal Slot: ${result.firstNormalSlot}`);
  console.log(`\uD83E\uDDE0 Warmup Phase Active?: ${result.warmup}`);
})(); 