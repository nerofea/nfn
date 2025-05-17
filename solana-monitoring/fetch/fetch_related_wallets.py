import requests
import time
import json
import argparse
from collections import defaultdict

RPC_URL = "https://api.devnet.solana.com"
HEADERS = {"Content-Type": "application/json"}

# --- Step 0: Parse CLI argument for input file ---
parser = argparse.ArgumentParser(description="Analyze directional JSON and extract wallets.")
parser.add_argument("input_file", help="Path to your directional JSON file")
args = parser.parse_args()

# --- Step 1: Load JSON and extract all unique addresses ---
with open(args.input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

unique_addresses = set()
for key in data:
    sender, receiver = key.split("→")
    unique_addresses.add(sender)
    unique_addresses.add(receiver)

unique_addresses = list(unique_addresses)
print(f"Found {len(unique_addresses)} unique addresses.")

# --- Step 2: Helper functions ---
def get_signatures(address, limit=1000):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getSignaturesForAddress",
        "params": [address, {"limit": limit}]
    }
    res = requests.post(RPC_URL, headers=HEADERS, json=payload).json()
    return [sig["signature"] for sig in res.get("result", [])]

def get_transaction(signature):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTransaction",
        "params": [signature, {"encoding": "jsonParsed"}]
    }
    res = requests.post(RPC_URL, headers=HEADERS, json=payload).json()
    return res.get("result")

def extract_wallets(tx, target_address):
    accounts = tx["transaction"]["message"]["accountKeys"]
    pre = tx["meta"]["preBalances"]
    post = tx["meta"]["postBalances"]
    changes = []

    for i, (p, q) in enumerate(zip(pre, post)):
        if p != q:
            wallet = accounts[i]["pubkey"]
            direction = None
            if wallet == target_address:
                direction = "received" if q > p else "sent"
            elif target_address in [a["pubkey"] for a in accounts]:
                direction = "sender" if p > q else "receiver"

            if direction:
                changes.append({
                    "wallet": wallet,
                    "direction": direction,
                    "amount": abs(q - p) / 1e9
                })
    return changes

# --- Step 3: Analyze each address ---
for ADDRESS in unique_addresses:
    print(f"\n🔍 Analyzing address: {ADDRESS}")
    all_results = []
    direction_counts = {
        "incoming": defaultdict(int),
        "outgoing": defaultdict(int)
    }

    signatures = get_signatures(ADDRESS)
    print(f"  ↳ {len(signatures)} signatures found.")

    for sig in signatures:
        print(f"    - Fetching tx: {sig}")
        tx = get_transaction(sig)
        if tx:
            changes = extract_wallets(tx, ADDRESS)
            for ch in changes:
                if ch["wallet"] == ADDRESS:
                    continue
                if ch["direction"] == "received":
                    direction_counts["incoming"][ch["wallet"]] += 1
                elif ch["direction"] == "sent":
                    direction_counts["outgoing"][ch["wallet"]] += 1

            all_results.append({
                "signature": sig,
                "wallet_changes": changes
            })

        time.sleep(1)  # RPC rate limit

    filename_part = ADDRESS[:6] + "_" + ADDRESS[-6:]

    with open(f"directional_summary_{filename_part}.json", "w") as f:
        json.dump({
            "incoming": dict(direction_counts["incoming"]),
            "outgoing": dict(direction_counts["outgoing"])
        }, f, indent=2)

    with open(f"transactions_{filename_part}.json", "w") as f:
        json.dump(all_results, f, indent=2)

    print(f"✅ Done: saved flow summary for {ADDRESS}")
