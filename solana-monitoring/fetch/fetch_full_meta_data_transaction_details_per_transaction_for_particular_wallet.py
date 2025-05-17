import json, argparse, requests, time

from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("input_folder", help="Folder containing signature JSON files")
parser.add_argument("--output_folder", default="full_transaction_details_per_wallet")
args = parser.parse_args()

input_path = Path(args.input_folder)
output_path = Path(args.output_folder)
output_path.mkdir(exist_ok=True)

files = sorted(input_path.glob("*.json"))

RPC_URL = "https://api.devnet.solana.com"
HEADERS = {"Content-Type": "application/json"}
results = []

for file in files:
    print(f"\n📂 Processing {file.name}")
    with open(file) as f: txs = json.load(f)
    signatures = [tx["signature"] for tx in txs if "signature" in tx]
    results = []

    for i, sig in enumerate(signatures):
        print(f"[{i+1}/{len(signatures)}] {sig}")
        try:
            res = requests.post(RPC_URL, headers=HEADERS, json={
                "jsonrpc": "2.0", "id": 1, "method": "getTransaction",
                "params": [sig, {"encoding": "jsonParsed"}]
            }, timeout=10).json().get("result")
            if res:
                results.append({
                    "signature": sig,
                    "blockTime": res.get("blockTime"),
                    "slot": res.get("slot"),
                    "fee": res["meta"]["fee"],
                    "status": res["meta"].get("err"),
                    "preBalances": res["meta"]["preBalances"],
                    "postBalances": res["meta"]["postBalances"],
                    "tokenTransfers": res["meta"].get("postTokenBalances", []),
                    "logMessages": res["meta"].get("logMessages"),
                    "instructions": res["transaction"]["message"].get("instructions", []),
                    "accountKeys": [x["pubkey"] if isinstance(x, dict) else x for x in res["transaction"]["message"]["accountKeys"]]
                })
            time.sleep(0.25)
        except Exception as e:
            print(f"❌ {e}")

    out_file = output_path / f"transactionsmetadata_{file.stem}.json"
    with open(out_file, "w") as f: json.dump(results, f, indent=2)
    print(f"✅ Saved {len(results)} txs to {out_file}")

