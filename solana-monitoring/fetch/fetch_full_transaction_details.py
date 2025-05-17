import argparse
import json
import requests
from collections import defaultdict
from time import sleep

# === CLI Args ===
parser = argparse.ArgumentParser(description="Parse Solana signatures and extract direction flows.")
parser.add_argument("signature_file", help="Path to the JSON file with getBlock results")
parser.add_argument("--output", default="direction_counts.json", help="Output JSON file")
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

for i, sig in enumerate(signatures):
    try:
        print(f"[{i+1}/{len(signatures)}] Fetching {sig}...")
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getTransaction",
            "params": [sig, "jsonParsed"]
        }

        response = requests.post(RPC_URL, headers=headers, json=payload, timeout=10)
        result = response.json().get("result")

        if not result:
            print("⚠️ No result, skipping.")
            continue

        instructions = result["transaction"]["message"].get("instructions", [])
        for instr in instructions:
            if instr.get("program") == "system":
                parsed = instr.get("parsed", {})
                if parsed.get("type") == "transfer":
                    info = parsed.get("info", {})
                    src = info.get("source")
                    dst = info.get("destination")
                    if src and dst:
                        direction_counts[f"{src}→{dst}"] += 1

        sleep(0.1)  # Safe from rate limits
    except Exception as e:
        print(f"❌ Error processing {sig}: {e}")
        continue

# === Save ===
with open(OUTPUT_FILE, 'w') as out:
    json.dump(dict(direction_counts), out, indent=2)

print(f"✅ Saved {len(direction_counts)} unique directions to {OUTPUT_FILE}")
