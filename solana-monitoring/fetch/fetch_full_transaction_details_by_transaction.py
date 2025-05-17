import requests, json, os

RPC_URL = "https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY"
HEADERS = {"Content-Type": "application/json"}

def fetch_tx_and_blocktime(signature):
    # 1. Fetch full transaction
    tx_payload = {
        "jsonrpc": "2.0", "id": 1, "method": "getTransaction",
        "params": [
            signature,
            {
                "encoding": "json",
                "maxSupportedTransactionVersion": 0,
                "commitment": "confirmed"
            }
        ]
    }
    tx_response = requests.post(RPC_URL, json=tx_payload, headers=HEADERS).json()
    result = tx_response.get("result")

    if not result:
        return None, None

    slot = result.get("slot")
    block_time = result.get("blockTime")

    # 2. Fallback to getBlockTime if missing
    if block_time is None and slot is not None:
        bt_payload = {
            "jsonrpc": "2.0", "id": 1, "method": "getBlockTime",
            "params": [slot]
        }
        bt_response = requests.post(RPC_URL, json=bt_payload, headers=HEADERS).json()
        block_time = bt_response.get("result")

    return result, block_time

def save_transactions_from_file(file_path, out_dir):
    with open(file_path) as f:
        sigs = json.load(f)

    os.makedirs(out_dir, exist_ok=True)

    for sig in sigs:
        signature = sig["signature"] if isinstance(sig, dict) else sig
        tx_data, block_time = fetch_tx_and_blocktime(signature)

        if not tx_data:
            print(f"{signature} | ❌ RPC failed or result is null")
            continue

        print(f"{signature} | blockTime: {block_time if block_time else '❌ missing'}")

        tx_data["resolvedBlockTime"] = block_time  # save it manually
        with open(f"{out_dir}/{signature}.json", "w") as f_out:
            json.dump(tx_data, f_out, indent=2)

def main():
    input_folder = "data"
    for file in os.listdir(input_folder):
        if file.endswith(".json"):
            file_path = os.path.join(input_folder, file)
            wallet_id = file.replace(".json", "")
            output_folder = f"transactions_{wallet_id}"
            print(f"Processing: {file} → {output_folder}")
            save_transactions_from_file(file_path, output_folder)

if __name__ == "__main__":
    main()
