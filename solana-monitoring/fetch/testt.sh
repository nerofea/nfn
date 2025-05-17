#!/bin/bash

# === Configuration ===
STEP=7200
MAX_ITERATIONS=220
API_KEY="934c08b5-0c44-4549-bda8-30587b901642"
RPC_URL="https://devnet.helius-rpc.com/?api-key=$API_KEY"
USERNAME=$2
TIER="free"

VIEW=$1
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LABEL="${USERNAME}_${TIMESTAMP}_${TIER}"

if [ -z "$VIEW" ] || [ -z "$USERNAME" ]; then
  echo "❌ Usage: $0 <time_view> <username>"
  echo "Example: $0 7d nerofea"
  exit 1
fi

# === Convert VIEW (e.g., 30d, 2h, 10m) into seconds ===
DURATION=${VIEW:0:-1}
UNIT=${VIEW: -1}

case $UNIT in
  d) TOTAL_SECONDS=$((DURATION * 86400));;
  h) TOTAL_SECONDS=$((DURATION * 3600));;
  m) TOTAL_SECONDS=$((DURATION * 60));;
  s) TOTAL_SECONDS=$((DURATION));;
  *) echo "❌ Invalid time unit: use d, h, m, or s"; exit 1;;
esac

# === Get current slot ===
CURRENT_SLOT=$(curl -s "$RPC_URL" \
  -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getSlot"}' | jq .result)

SLOTS_PER_EPOCH=432000
SLOTS_AGO=$((TOTAL_SECONDS * 25 / 10))
START_SLOT=$((CURRENT_SLOT - SLOTS_AGO))
EPOCH=$((START_SLOT / SLOTS_PER_EPOCH))

# === File Setup ===
OUTPUT_FILE="${LABEL}_slot_signatures_${VIEW}_epoch${EPOCH}.json"
PROGRESS_FILE="last_slot_${VIEW}_epoch${EPOCH}.txt"

# === Resume if progress file exists ===
if [ -f "$PROGRESS_FILE" ]; then
  echo "📌 Resuming from previous progress"
  START_SLOT=$(cat "$PROGRESS_FILE")
fi

# === Write opening JSON bracket ===
echo "[" > "$OUTPUT_FILE"

echo "📅 View: $VIEW → $TOTAL_SECONDS sec ago → $SLOTS_AGO slots ago"
echo "📦 Sampling from slot $START_SLOT to $CURRENT_SLOT (step=$STEP, max=$MAX_ITERATIONS)"

# === Main loop ===
COUNT=0
SLOT=$START_SLOT

while [[ $COUNT -lt $MAX_ITERATIONS && $SLOT -le $CURRENT_SLOT ]]; do
  echo "📦 Fetching slot $SLOT..."

  RESPONSE=$(curl -s "$RPC_URL" \
    -X POST -H "Content-Type: application/json" \
    -d '{
      "jsonrpc":"2.0",
      "id":1,
      "method":"getBlock",
      "params":['$SLOT', {"transactionDetails":"signatures"}]
    }')

  if [ "$COUNT" -ne 0 ]; then
    echo "," >> "$OUTPUT_FILE"
  fi

  echo "$RESPONSE" >> "$OUTPUT_FILE"
  echo $SLOT > "$PROGRESS_FILE"

  ((COUNT++))
  ((SLOT+=STEP))
  sleep 1
done

echo "]" >> "$OUTPUT_FILE"
echo "✅ Done — $COUNT samples from view '$VIEW' saved to $OUTPUT_FILE"
