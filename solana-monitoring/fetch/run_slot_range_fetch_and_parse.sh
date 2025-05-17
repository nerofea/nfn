#!/bin/bash

# Usage: ./run_all.sh <time_view> <username>
VIEW=$1
USERNAME=$2

if [ -z "$VIEW" ] || [ -z "$USERNAME" ]; then
  echo "❌ Usage: $0 <time_view> <username>"
  exit 1
fi

# Step 1: Fetch signatures
bash fetch_signatures.sh "$VIEW" "$USERNAME"

# Step 2: Get latest matching JSON file from fetch_signatures
LATEST_JSON=$(ls -t ${USERNAME}_*slot_signatures_${VIEW}_epoch*.json | head -n 1)

if [ ! -f "$LATEST_JSON" ]; then
  echo "❌ JSON file not found. Aborting."
  exit 1
fi

# Step 3: Parse it
python3 fetch_and_parse_transactions.py "$LATEST_JSON" --output "directions_${VIEW}_${USERNAME}.json"

echo "✅ All steps completed for view=$VIEW and user=$USERNAME"
