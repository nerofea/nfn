import argparse
import json
import requests
from collections import defaultdict
from time import sleep

# === CLI Args ===
parser = argparse.ArgumentParser(description="Parse Solana token transfer types from the signatures and extract direction flows by token transfer type.")
parser.add_argument("signature_file", help="Path to the JSON file with getBlock results")
parser.add_argument("--output", default="direction_counts_by_token_transfer_type.json", help="Output JSON file")
args = parser.parse_args()

SIGNATURE_FILE = args.signature_file
OUTPUT_FILE = args.output
RPC_URL = "https://devnet.helius-rpc.com/?api-key=934c08b5-0c44-4549-bda8-30587b901642"

# === Load and parse JSON signatures ===
with open(SIGNATURE_FILE, 'r') as f:
    raw_data = json.load(f)

signatures = []
for entry in raw_data:
    result = entry.get("result", {})
    sigs = result.get("signatures", [])
    signatures.extend(sigs)

print(f"📦 Loaded {len(signatures)} signatures.")

# === Process each transaction ===
direction_counts = defaultdict(int)
headers = { "Content-Type": "application/json" }

token_transfers = []

for i, sig in enumerate(signatures):
    try:
        print(f"[{i+1}/{len(signatures)}] Fetching token transfers for {sig}...")
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getTokenTransfers",
            "params": [sig, "jsonParsed"]
        }

        response = requests.post(RPC_URL, headers=headers, json=payload, timeout=10)
        result = response.json().get("result")

        if not result or 'tokenTransfers' not in result:
            print("⚠️ No token transfers, skipping.")
            continue

        for transfer in result['tokenTransfers']:
            token_transfers.append({
                "signature": sig,
                "source": transfer.get("source"),
                "destination": transfer.get("destination"),
                "mint": transfer.get("mint"),
                "amount": transfer.get("amount"),
                "decimals": transfer.get("decimals"),
                "tokenName": transfer.get("tokenName"),
                "tokenSymbol": transfer.get("tokenSymbol"),
                "timestamp": result.get("blockTime"),
            })

        sleep(0.1)
    except Exception as e:
        print(f"❌ Error processing {sig}: {e}")
        continue

# === Save token transfers ===
with open("token_transfers.json", "w") as tf_out:
    json.dump(token_transfers, tf_out, indent=2)

print(f"✅ Saved {len(token_transfers)} token transfers to token_transfers.json")