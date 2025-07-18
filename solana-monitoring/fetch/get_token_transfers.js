#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));
const signatureFile = args._[0];
const outputFile = args.output || 'direction_counts_by_token_transfer_type.json';
const RPC_URL = 'https://devnet.helius-rpc.com/?api-key=934c08b5-0c44-4549-bda8-30587b901642';

if (!signatureFile) {
  console.error('Usage: node get_token_transfers.js <signature_file> [--output output_file]');
  process.exit(1);
}

// === Load and parse JSON signatures ===
const rawData = JSON.parse(fs.readFileSync(signatureFile, 'utf8'));
let signatures = [];
for (const entry of rawData) {
  const result = entry.result || {};
  const sigs = result.signatures || [];
  signatures = signatures.concat(sigs);
}
console.log(`\uD83D\uDCE6 Loaded ${signatures.length} signatures.`);

const tokenTransfers = [];

(async () => {
  for (let i = 0; i < signatures.length; i++) {
    const sig = signatures[i];
    try {
      console.log(`[${i + 1}/${signatures.length}] Fetching token transfers for ${sig}...`);
      const payload = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenTransfers',
        params: [sig, 'jsonParsed']
      };
      const res = await fetch(RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        timeout: 10000
      });
      const data = await res.json();
      const result = data.result;
      if (!result || !result.tokenTransfers) {
        console.log('⚠️ No token transfers, skipping.');
        continue;
      }
      for (const transfer of result.tokenTransfers) {
        tokenTransfers.push({
          signature: sig,
          source: transfer.source,
          destination: transfer.destination,
          mint: transfer.mint,
          amount: transfer.amount,
          decimals: transfer.decimals,
          tokenName: transfer.tokenName,
          tokenSymbol: transfer.tokenSymbol,
          timestamp: result.blockTime
        });
      }
      await new Promise(r => setTimeout(r, 100));
    } catch (e) {
      console.log(`❌ Error processing ${sig}: ${e}`);
      continue;
    }
  }
  fs.writeFileSync('token_transfers.json', JSON.stringify(tokenTransfers, null, 2));
  console.log(`✅ Saved ${tokenTransfers.length} token transfers to token_transfers.json`);
})(); 