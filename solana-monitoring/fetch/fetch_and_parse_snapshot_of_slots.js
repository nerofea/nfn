#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));
const signatureFile = args._[0];
const outputFile = args.output || 'direction_counts.json';
const RPC_URL = 'https://devnet.helius-rpc.com/?api-key=934c08b5-0c44-4549-bda8-30587b901642';

if (!signatureFile) {
  console.log('Usage: node fetch_and_parse_snapshot_of_slots.js <signature_file> [--output <output>]');
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

const directionCounts = {};

(async () => {
  for (let i = 0; i < signatures.length; i++) {
    const sig = signatures[i];
    try {
      console.log(`[${i + 1}/${signatures.length}] Fetching ${sig}...`);
      const payload = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTransaction',
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
      if (!result) {
        console.log('⚠️ No result, skipping.');
        continue;
      }
      const instructions = result.transaction.message.instructions || [];
      for (const instr of instructions) {
        if (instr.program === 'system') {
          const parsed = instr.parsed || {};
          if (parsed.type === 'transfer') {
            const info = parsed.info || {};
            const src = info.source;
            const dst = info.destination;
            if (src && dst) {
              const key = `${src}→${dst}`;
              directionCounts[key] = (directionCounts[key] || 0) + 1;
            }
          }
        }
      }
      await new Promise(r => setTimeout(r, 100));
    } catch (e) {
      console.log(`❌ Error processing ${sig}: ${e}`);
      continue;
    }
  }
  // === Save ===
  // === Filter: only keep repeated transfers (count > 1) ===
  const filteredCounts = {};
  for (const k in directionCounts) {
    if (directionCounts[k] > 1) filteredCounts[k] = directionCounts[k];
  }
  fs.writeFileSync(outputFile, JSON.stringify(filteredCounts, null, 2));
  console.log(`✅ Saved ${Object.keys(filteredCounts).length} repeated directions to ${outputFile}`);
})(); 