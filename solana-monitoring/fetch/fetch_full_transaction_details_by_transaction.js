#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');

const RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY';
const HEADERS = { 'Content-Type': 'application/json' };

async function fetchTxAndBlockTime(signature) {
  // 1. Fetch full transaction
  const txPayload = {
    jsonrpc: '2.0', id: 1, method: 'getTransaction',
    params: [
      signature,
      {
        encoding: 'json',
        maxSupportedTransactionVersion: 0,
        commitment: 'confirmed'
      }
    ]
  };
  const txRes = await fetch(RPC_URL, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(txPayload)
  });
  const txResponse = await txRes.json();
  const result = txResponse.result;
  if (!result) return [null, null];
  const slot = result.slot;
  let blockTime = result.blockTime;
  // 2. Fallback to getBlockTime if missing
  if (blockTime == null && slot != null) {
    const btPayload = {
      jsonrpc: '2.0', id: 1, method: 'getBlockTime',
      params: [slot]
    };
    const btRes = await fetch(RPC_URL, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(btPayload)
    });
    const btResponse = await btRes.json();
    blockTime = btResponse.result;
  }
  return [result, blockTime];
}

async function saveTransactionsFromFile(filePath, outDir) {
  const sigs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  for (const sig of sigs) {
    const signature = typeof sig === 'object' && sig.signature ? sig.signature : sig;
    const [txData, blockTime] = await fetchTxAndBlockTime(signature);
    if (!txData) {
      console.log(`${signature} | ❌ RPC failed or result is null`);
      continue;
    }
    console.log(`${signature} | blockTime: ${blockTime !== undefined && blockTime !== null ? blockTime : '❌ missing'}`);
    txData.resolvedBlockTime = blockTime;
    fs.writeFileSync(path.join(outDir, `${signature}.json`), JSON.stringify(txData, null, 2));
  }
}

async function main() {
  const inputFolder = 'data';
  const files = fs.readdirSync(inputFolder);
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(inputFolder, file);
      const walletId = file.replace('.json', '');
      const outputFolder = `transactions_${walletId}`;
      console.log(`Processing: ${file} → ${outputFolder}`);
      await saveTransactionsFromFile(filePath, outputFolder);
    }
  }
}

main(); 