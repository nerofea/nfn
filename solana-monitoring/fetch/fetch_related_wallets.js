#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');
const minimist = require('minimist');

const RPC_URL = 'https://api.devnet.solana.com';
const HEADERS = { 'Content-Type': 'application/json' };

const args = minimist(process.argv.slice(2));
const inputFile = args._[0];
if (!inputFile) {
  console.error('Usage: node fetch_related_wallets.js <input_file>');
  process.exit(1);
}

// --- Step 1: Load JSON and extract all unique addresses ---
const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
const uniqueAddresses = new Set();
for (const key of Object.keys(data)) {
  const [sender, receiver] = key.split('→');
  uniqueAddresses.add(sender);
  uniqueAddresses.add(receiver);
}
const uniqueAddressesArr = Array.from(uniqueAddresses);
console.log(`Found ${uniqueAddressesArr.length} unique addresses.`);

async function getSignatures(address, limit = 1000) {
  const payload = {
    jsonrpc: '2.0', id: 1, method: 'getSignaturesForAddress',
    params: [address, { limit }]
  };
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  return (data.result || []).map(sig => sig.signature);
}

async function getTransaction(signature) {
  const payload = {
    jsonrpc: '2.0', id: 1, method: 'getTransaction',
    params: [signature, { encoding: 'jsonParsed' }]
  };
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  return data.result;
}

function extractWallets(tx, targetAddress) {
  const accounts = tx.transaction.message.accountKeys;
  const pre = tx.meta.preBalances;
  const post = tx.meta.postBalances;
  const changes = [];
  for (let i = 0; i < pre.length; i++) {
    if (pre[i] !== post[i]) {
      const wallet = accounts[i].pubkey;
      let direction = null;
      if (wallet === targetAddress) {
        direction = post[i] > pre[i] ? 'received' : 'sent';
      } else if (accounts.map(a => a.pubkey).includes(targetAddress)) {
        direction = pre[i] > post[i] ? 'sender' : 'receiver';
      }
      if (direction) {
        changes.push({
          wallet,
          direction,
          amount: Math.abs(post[i] - pre[i]) / 1e9
        });
      }
    }
  }
  return changes;
}

(async () => {
  for (const ADDRESS of uniqueAddressesArr) {
    console.log(`\n🔍 Analyzing address: ${ADDRESS}`);
    const allResults = [];
    const directionCounts = {
      incoming: {},
      outgoing: {}
    };
    const signatures = await getSignatures(ADDRESS);
    console.log(`  ↳ ${signatures.length} signatures found.`);
    for (const sig of signatures) {
      console.log(`    - Fetching tx: ${sig}`);
      const tx = await getTransaction(sig);
      if (tx) {
        const changes = extractWallets(tx, ADDRESS);
        for (const ch of changes) {
          if (ch.wallet === ADDRESS) continue;
          if (ch.direction === 'received') {
            directionCounts.incoming[ch.wallet] = (directionCounts.incoming[ch.wallet] || 0) + 1;
          } else if (ch.direction === 'sent') {
            directionCounts.outgoing[ch.wallet] = (directionCounts.outgoing[ch.wallet] || 0) + 1;
          }
        }
        allResults.push({ signature: sig, wallet_changes: changes });
      }
      await new Promise(r => setTimeout(r, 1000));
    }
    const filenamePart = ADDRESS.slice(0, 6) + '_' + ADDRESS.slice(-6);
    fs.writeFileSync(
      `directional_summary_${filenamePart}.json`,
      JSON.stringify({ incoming: directionCounts.incoming, outgoing: directionCounts.outgoing }, null, 2)
    );
    fs.writeFileSync(
      `transactions_${filenamePart}.json`,
      JSON.stringify(allResults, null, 2)
    );
    console.log(`✅ Done: saved flow summary for ${ADDRESS}`);
  }
})(); 