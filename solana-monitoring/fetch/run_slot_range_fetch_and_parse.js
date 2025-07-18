#!/usr/bin/env node

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

envCheck();

const args = process.argv.slice(2);
const VIEW = args[0];
const USERNAME = args[1];

if (!VIEW || !USERNAME) {
  console.error("\u274C Usage: node run_slot_range_fetch_and_parse.js <time_view> <username>");
  process.exit(1);
}

// Step 1: Fetch signatures (assume fetch_signatures.js exists)
try {
  execSync(`node fetch_signatures.js ${VIEW} ${USERNAME}`, { stdio: 'inherit' });
} catch (e) {
  console.error("\u274C Error running fetch_signatures.js");
  process.exit(1);
}

// Step 2: Get latest matching JSON file
const files = fs.readdirSync('.');
const pattern = new RegExp(`^${USERNAME}_.*slot_signatures_${VIEW}_epoch.*\\.json$`);
const matching = files.filter(f => pattern.test(f));
if (matching.length === 0) {
  console.error("\u274C JSON file not found. Aborting.");
  process.exit(1);
}
// Sort by mtime desc
matching.sort((a, b) => fs.statSync(b).mtime - fs.statSync(a).mtime);
const LATEST_JSON = matching[0];

// Step 3: Parse it (assume fetch_and_parse_transactions.py exists)
try {
  execSync(`python3 fetch_and_parse_transactions.py ${LATEST_JSON} --output directions_${VIEW}_${USERNAME}.json`, { stdio: 'inherit' });
} catch (e) {
  console.error("\u274C Error running fetch_and_parse_transactions.py");
  process.exit(1);
}

console.log(`\u2705 All steps completed for view=${VIEW} and user=${USERNAME}`);

function envCheck() {
  // Check if node-fetch_signatures.js exists
  if (!fs.existsSync('fetch_signatures.js')) {
    console.warn('⚠️  fetch_signatures.js not found. Please convert fetch_signatures.sh to Node.js as fetch_signatures.js.');
  }
  // Check if fetch_and_parse_transactions.py exists
  if (!fs.existsSync('fetch_and_parse_transactions.py')) {
    console.warn('⚠️  fetch_and_parse_transactions.py not found. Please ensure it exists or convert it to Node.js.');
  }
} 