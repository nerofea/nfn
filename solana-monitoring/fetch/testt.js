#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');

// === Configuration ===
const STEP = 7200;
const MAX_ITERATIONS = 220;
const API_KEY = "934c08b5-0c44-4549-bda8-30587b901642";
const RPC_URL = `https://devnet.helius-rpc.com/?api-key=${API_KEY}`;
const args = process.argv.slice(2);

const VIEW = args[0];
const USERNAME = args[1];
const TIER = "free";

if (!VIEW || !USERNAME) {
  console.error("\u274C Usage: node testt.js <time_view> <username>");
  console.error("Example: node testt.js 7d nerofea");
  process.exit(1);
}

// === Convert VIEW (e.g., 30d, 2h, 10m) into seconds ===
const DURATION = parseInt(VIEW.slice(0, -1));
const UNIT = VIEW.slice(-1);
let TOTAL_SECONDS;
switch (UNIT) {
  case 'd': TOTAL_SECONDS = DURATION * 86400; break;
  case 'h': TOTAL_SECONDS = DURATION * 3600; break;
  case 'm': TOTAL_SECONDS = DURATION * 60; break;
  case 's': TOTAL_SECONDS = DURATION; break;
  default:
    console.error("\u274C Invalid time unit: use d, h, m, or s");
    process.exit(1);
}

// === Get current timestamp for label ===
function getTimestamp() {
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}
const TIMESTAMP = getTimestamp();
const LABEL = `${USERNAME}_${TIMESTAMP}_${TIER}`;

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
  const SLOTS_PER_EPOCH = 432000;
  const SLOTS_AGO = Math.floor(TOTAL_SECONDS * 25 / 10);
  let startSlot = currentSlot - SLOTS_AGO;
  const epoch = Math.floor(startSlot / SLOTS_PER_EPOCH);

  // === File Setup ===
  const OUTPUT_FILE = `${LABEL}_slot_signatures_${VIEW}_epoch${epoch}.json`;
  const PROGRESS_FILE = `last_slot_${VIEW}_epoch${epoch}.txt`;

  // === Resume if progress file exists ===
  if (fs.existsSync(PROGRESS_FILE)) {
    console.log("\uD83D\uDCCC Resuming from previous progress");
    startSlot = parseInt(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  }

  // === Write opening JSON bracket ===
  fs.writeFileSync(OUTPUT_FILE, '[\n');

  console.log(`\uD83D\uDCC5 View: ${VIEW} → ${TOTAL_SECONDS} sec ago → ${SLOTS_AGO} slots ago`);
  console.log(`\uD83D\uDCE6 Sampling from slot ${startSlot} to ${currentSlot} (step=${STEP}, max=${MAX_ITERATIONS})`);

  // === Main loop ===
  let count = 0;
  let slot = startSlot;
  while (count < MAX_ITERATIONS && slot <= currentSlot) {
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
    if (count !== 0) {
      fs.appendFileSync(OUTPUT_FILE, ',\n');
    }
    fs.appendFileSync(OUTPUT_FILE, responseText);
    fs.writeFileSync(PROGRESS_FILE, slot.toString());
    count++;
    slot += STEP;
    await new Promise(r => setTimeout(r, 1000));
  }
  fs.appendFileSync(OUTPUT_FILE, '\n]');
  console.log(`\u2705 Done — ${count} samples from view '${VIEW}' saved to ${OUTPUT_FILE}`);
})(); 