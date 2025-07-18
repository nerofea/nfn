#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');

const STEP = 7200;
const MAX_ITERATIONS = 10;
const API_KEY = "934c08b5-0c44-4549-bda8-30587b901642";
const RPC_URL = `https://devnet.helius-rpc.com/?api-key=${API_KEY}`;

const args = process.argv.slice(2);

function usage() {
  console.error("\u274C Usage:");
  console.error("  node test_fetch.js <time_view> <epoch_label>");
  console.error("  node test_fetch.js <epoch_number>");
  console.error("Examples:");
  console.error("  node test_fetch.js 7d 007");
  console.error("  node test_fetch.js 007");
  process.exit(1);
}

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

async function fetchSlotsByView(view, epochLabel) {
  // === Convert VIEW (e.g., 30d, 2h, 10m) into seconds ===
  const DURATION = parseInt(view.slice(0, -1));
  const UNIT = view.slice(-1);
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
  const SLOTS_AGO = Math.floor(TOTAL_SECONDS * 25 / 10);
  const currentSlot = await getCurrentSlot();
  let startSlot = currentSlot - SLOTS_AGO;
  const OUTPUT_FILE = `slot_signatures_${view}_epoch${epochLabel}.json`;
  const PROGRESS_FILE = `last_slot_${view}_epoch${epochLabel}.txt`;

  if (fs.existsSync(PROGRESS_FILE)) {
    console.log("\uD83D\uDCCC Resuming from previous progress");
    startSlot = parseInt(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } else {
    fs.writeFileSync(OUTPUT_FILE, '[\n');
  }

  console.log(`\uD83D\uDCC5 View: ${view} → ${TOTAL_SECONDS} sec ago → ${SLOTS_AGO} slots ago`);
  console.log(`\uD83D\uDCE6 Sampling from slot ${startSlot} to ${currentSlot} (step=${STEP}, samples=${MAX_ITERATIONS})`);

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
    // Append comma if needed
    const fileContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
    if (!fileContent.endsWith('[\n')) {
      fs.appendFileSync(OUTPUT_FILE, ',\n');
    }
    fs.appendFileSync(OUTPUT_FILE, responseText);
    fs.writeFileSync(PROGRESS_FILE, slot.toString());
    count++;
    slot += STEP;
    await new Promise(r => setTimeout(r, 1000));
  }
  fs.appendFileSync(OUTPUT_FILE, '\n]');
  console.log(`\u2705 Done — ${count} samples from view '${view}' saved to ${OUTPUT_FILE}`);
}

async function fetchSlotsByEpoch(epochNumber) {
  const OUTPUT_FILE = `slot_signatures_epoch${epochNumber}.json`;
  const PROGRESS_FILE = `last_slot_epoch${epochNumber}.txt`;
  const currentSlot = await getCurrentSlot();
  let startSlot = 0;
  if (fs.existsSync(PROGRESS_FILE)) {
    startSlot = parseInt(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } else {
    fs.writeFileSync(OUTPUT_FILE, '[\n');
  }
  console.log(`\u2699\uFE0F Resuming from slot ${startSlot} (step=${STEP}) for ${MAX_ITERATIONS} samples`);
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
    // Append comma if needed
    const fileContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
    if (!fileContent.endsWith('[\n')) {
      fs.appendFileSync(OUTPUT_FILE, ',\n');
    }
    fs.appendFileSync(OUTPUT_FILE, responseText);
    fs.writeFileSync(PROGRESS_FILE, slot.toString());
    count++;
    slot += STEP;
    await new Promise(r => setTimeout(r, 1000));
  }
  fs.appendFileSync(OUTPUT_FILE, '\n]');
  console.log(`\u2705 Test complete — ${count} blocks sampled and saved to ${OUTPUT_FILE}`);
}

(async () => {
  if (args.length === 2) {
    await fetchSlotsByView(args[0], args[1]);
  } else if (args.length === 1) {
    await fetchSlotsByEpoch(args[0]);
  } else {
    usage();
  }
})(); 