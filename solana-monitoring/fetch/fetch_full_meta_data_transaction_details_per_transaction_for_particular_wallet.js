#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));
const inputFolder = args._[0];
const outputFolder = args.output_folder || 'full_transaction_details_per_wallet';

if (!inputFolder) {
  console.log('Usage: node fetch_full_meta_data_transaction_details_per_transaction_for_particular_wallet.js <input_folder> [--output_folder <output_folder>]');
  process.exit(1);
}

const inputPath = path.resolve(inputFolder);
const outputPath = path.resolve(outputFolder);
if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

const files = fs.readdirSync(inputPath).filter(f => f.endsWith('.json')).sort();
const RPC_URL = 'https://api.devnet.solana.com';
const HEADERS = { 'Content-Type': 'application/json' };

(async () => {
  for (const file of files) {
    console.log(`\n📂 Processing ${file}`);
    const txs = JSON.parse(fs.readFileSync(path.join(inputPath, file), 'utf8'));
    const signatures = txs.filter(tx => tx.signature).map(tx => tx.signature);
    const results = [];
    for (let i = 0; i < signatures.length; i++) {
      const sig = signatures[i];
      console.log(`[${i + 1}/${signatures.length}] ${sig}`);
      try {
        const payload = {
          jsonrpc: '2.0', id: 1, method: 'getTransaction',
          params: [sig, { encoding: 'jsonParsed' }]
        };
        const res = await fetch(RPC_URL, {
          method: 'POST',
          headers: HEADERS,
          body: JSON.stringify(payload),
          timeout: 10000
        });
        const data = await res.json();
        const result = data.result;
        if (result) {
          results.push({
            signature: sig,
            blockTime: result.blockTime,
            slot: result.slot,
            fee: result.meta.fee,
            status: result.meta.err,
            preBalances: result.meta.preBalances,
            postBalances: result.meta.postBalances,
            tokenTransfers: result.meta.postTokenBalances || [],
            logMessages: result.meta.logMessages,
            instructions: result.transaction.message.instructions || [],
            accountKeys: (result.transaction.message.accountKeys || []).map(x => (typeof x === 'object' ? x.pubkey : x))
          });
        }
        await new Promise(r => setTimeout(r, 250));
      } catch (e) {
        console.log(`❌ ${e}`);
      }
    }
    const outFile = path.join(outputPath, `transactionsmetadata_${path.parse(file).name}.json`);
    fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
    console.log(`✅ Saved ${results.length} txs to ${outFile}`);
  }
})(); 