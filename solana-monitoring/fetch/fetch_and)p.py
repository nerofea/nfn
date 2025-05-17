import json
import sys

if len(sys.argv) < 2:
    print("Usage: python3 extract_signatures_with_time.py <input.json>")
    sys.exit(1)

input_file = sys.argv[1]
output_file = input_file.replace(".json", "_signatures_with_time.json")

with open(input_file, "r") as f:
    blocks = json.load(f)

signatures = []
for block in blocks:
    result = block.get("result", {})
    block_time = result.get("blockTime")
    for sig in result.get("signatures", []):
        signatures.append({
            "signature": sig,
            "blockTime": block_time
        })

with open(output_file, "w") as out:
    json.dump(signatures, out, indent=2)

print(f"✅ Extracted {len(signatures)} signatures with timestamps to {output_file}")
