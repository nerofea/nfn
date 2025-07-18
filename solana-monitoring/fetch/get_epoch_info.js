#!/usr/bin/env node

const fetch = require('node-fetch');

(async () => {
  const res = await fetch('https://api.mainnet-beta.solana.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getEpochInfo'
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
})(); 