import argparse
import json
import requests
from collections import defaultdict
from time import sleep

# === CLI Args ===
parser = argparse.ArgumentParser(description="Parse Solana signatures and extract direction flows.")
parser.add_argument("signature_file", help="Path to the JSON file with getBlock results")
parser.add_argument("--target_file", required=True, help="Path to JSON file with 'A→B' direction keys")
parser.add_argument("--direction_output", default="direction_counts_l2.json", help="Direction counts output")
parser.add_argument("--wallet_output", default="interacting_wallets.json", help="Wallets output")
args = parser.parse_args()

SIGNATURE_FILE = args.signature_file
DIRECTION_OUTPUT = args.direction_output
WALLET_OUTPUT = args.wallet_output

# === Load Target Addresses from JSON with arrows ===
with open(args.target_file, 'r') as tf:
    direction_map = json.load(tf)
    target_addresses = set()
    for direction in direction_map:
        src, dst = direction.split("→")
        target_addresses.update([src, dst])

# === Load and parse JSON signatures ===
with open(SIGNATURE_FILE, 'r') as f:
    raw_data = json.load(f)

signatures = []
for entry in raw_data:
    result = entry.get("result", {})
    sigs = result.get("signatures", [])
    signatures.extend(sigs)

print(f"📦 Loaded {len(signatures)} signatures.")

# === Process Each Transaction ===
interacting_wallets = set()
direction_counts = defaultdict(int)
RPC_URL = "https://devnet.helius-rpc.com/?api-key=934c08b5-0c44-4549-bda8-30587b901642"
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
                        if src in target_addresses or dst in target_addresses:
                            counterparty = dst if src in target_addresses else src
                            interacting_wallets.add(counterparty)

        sleep(0.1)  # Avoid rate limiting
    except Exception as e:
        print(f"❌ Error processing {sig}: {e}")
        continue

# === Save Results ===
filtered_counts = {k: v for k, v in direction_counts.items() if v > 1}

with open(DIRECTION_OUTPUT, 'w') as out:
    json.dump(filtered_counts, out, indent=2)

with open(WALLET_OUTPUT, 'w') as out:
    json.dump(list(interacting_wallets), out, indent=2)

print(f"✅ Saved {len(filtered_counts)} repeated directions to {DIRECTION_OUTPUT}")
print(f"✅ Saved {len(interacting_wallets)} interacting wallets to {WALLET_OUTPUT}")
