#!/bin/bash

# Configuration
STEP=7200
API_KEY="934c08b5-0c44-4549-bda8-30587b901642"
RPC_URL="https://devnet.helius-rpc.com/?api-key=$API_KEY"
EPOCH_NUMBER=$1

if [ -z "$EPOCH_NUMBER" ]; then
  echo "❌ Please provide the epoch number as an argument."
  exit 1
fi

OUTPUT_FILE="slot_signatures_epoch${EPOCH_NUMBER}.json"
PROGRESS_FILE="last_slot_epoch${EPOCH_NUMBER}.txt"

# Get latest slot dynamically
CURRENT_SLOT=$(curl -s "$RPC_URL" \
  -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getSlot"}' | jq .result)

# Determine where to start
if [ -f "$PROGRESS_FILE" ]; then
  START_SLOT=$(cat "$PROGRESS_FILE")
else
  START_SLOT=0
  echo "[" > "$OUTPUT_FILE"
  FIRST=1
fi

echo "⚙️ Resuming from slot $START_SLOT up to $CURRENT_SLOT (step=$STEP)"

# Main loop
for (( SLOT=$START_SLOT; SLOT<=$CURRENT_SLOT; SLOT+=$STEP ))
do
  echo "📦 Fetching slot $SLOT..."

  RESPONSE=$(curl -s "$RPC_URL" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{
      "jsonrpc":"2.0",
      "id":1,
      "method":"getBlock",
      "params":['$SLOT', {"transactionDetails":"signatures"}]
    }')

  if [ "$FIRST" != 1 ]; then
    echo "," >> "$OUTPUT_FILE"
  fi
  FIRST=0

  echo "$RESPONSE" >> "$OUTPUT_FILE"
  echo $SLOT > "$PROGRESS_FILE"
  sleep 1
done

echo "]" >> "$OUTPUT_FILE"
echo "✅ Done. JSON saved to $OUTPUT_FILE"
