#!/usr/bin/env node

const fs = require('fs');

if (process.argv.length < 3) {
  console.log('Usage: node fetch_and_p.js <input.json>');
  process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = inputFile.replace('.json', '_signatures_with_time.json');

const blocks = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
const signatures = [];
for (const block of blocks) {
  const result = block.result || {};
  const blockTime = result.blockTime;
  for (const sig of result.signatures || []) {
    signatures.push({
      signature: sig,
      blockTime: blockTime
    });
  }
}
fs.writeFileSync(outputFile, JSON.stringify(signatures, null, 2));
console.log(`✅ Extracted ${signatures.length} signatures with timestamps to ${outputFile}`); 