#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');

const STEP = 7200;
const API_KEY = "934c08b5-0c44-4549-bda8-30587b901642";
const RPC_URL = `https://devnet.helius-rpc.com/?api-key=${API_KEY}`;

const args = process.argv.slice(2);
const EPOCH_NUMBER = args[0];

if (!EPOCH_NUMBER) {
  console.error("\u274C Please provide the epoch number as an argument.");
  process.exit(1);
}

const OUTPUT_FILE = `slot_signatures_epoch${EPOCH_NUMBER}.json`;
const PROGRESS_FILE = `last_slot_epoch${EPOCH_NUMBER}.txt`;

async function getCurrentSlot() {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getSlot"
    })
  });
  const data = await res.json();
  return data.result;
}

(async () => {
  const currentSlot = await getCurrentSlot();
  let startSlot = 0;
  let first = true;
  if (fs.existsSync(PROGRESS_FILE)) {
    startSlot = parseInt(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    first = false;
  } else {
    fs.writeFileSync(OUTPUT_FILE, '[\n');
    first = true;
  }
  console.log(`\u2699\uFE0F Resuming from slot ${startSlot} up to ${currentSlot} (step=${STEP})`);
  for (let slot = startSlot; slot <= currentSlot; slot += STEP) {
    console.log(`\uD83D\uDCE6 Fetching slot ${slot}...`);
    const res = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getBlock",
        params: [slot, { transactionDetails: "signatures" }]
      })
    });
    const responseText = await res.text();
    if (!first) {
      fs.appendFileSync(OUTPUT_FILE, ',\n');
    }
    fs.appendFileSync(OUTPUT_FILE, responseText);
    fs.writeFileSync(PROGRESS_FILE, slot.toString());
    first = false;
    await new Promise(r => setTimeout(r, 1000));
  }
  fs.appendFileSync(OUTPUT_FILE, '\n]');
  console.log(`\u2705 Done. JSON saved to ${OUTPUT_FILE}`);
})(); 