#!/bin/bash


# === Configuration ===
# Get the view we are going to take a snapshot of data from. 
STEP=7200
MAX_ITERATIONS=10
API_KEY="934c08b5-0c44-4549-bda8-30587b901642"
RPC_URL="https://devnet.helius-rpc.com/?api-key=$API_KEY"

VIEW=$1
EPOCH_LABEL=$2

if [ -z "$VIEW" ] || [ -z "$EPOCH_LABEL" ]; then
  echo "❌ Usage: $0 <time_view> <epoch_label>"
  echo "Example: $0 7d 007"
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

# === Solana slot = ~0.4 sec → ~2.5 slots/sec ===
SLOTS_AGO=$((TOTAL_SECONDS * 25 / 10))

# === Get current slot ===
CURRENT_SLOT=$(curl -s "$RPC_URL" \
  -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getSlot"}' | jq .result)

START_SLOT=$((CURRENT_SLOT - SLOTS_AGO))

# === File Setup ===
OUTPUT_FILE="slot_signatures_${VIEW}_epoch${EPOCH_LABEL}.json"
PROGRESS_FILE="last_slot_${VIEW}_epoch${EPOCH_LABEL}.txt"

if [ -f "$PROGRESS_FILE" ]; then
  echo "📌 Resuming from previous progress"
  START_SLOT=$(cat "$PROGRESS_FILE")
else
  echo "[" > "$OUTPUT_FILE"
fi

echo "📅 View: $VIEW → $TOTAL_SECONDS sec ago → $SLOTS_AGO slots ago"
echo "📦 Sampling from slot $START_SLOT to $CURRENT_SLOT (step=$STEP, samples=$MAX_ITERATIONS)"

# === Main loop ===
COUNT=0
SLOT=$START_SLOT

while [[ $COUNT -lt $MAX_ITERATIONS && $SLOT -le $CURRENT_SLOT ]]; do
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

  if [[ $(tail -c 2 "$OUTPUT_FILE") != "[" ]]; then
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



# === Configuration ===
STEP=7200
MAX_ITERATIONS=10
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
fi

echo "⚙️ Resuming from slot $START_SLOT (step=$STEP) for $MAX_ITERATIONS samples"

# === Main loop ===
COUNT=0
SLOT=$START_SLOT

while [[ $COUNT -lt $MAX_ITERATIONS && $SLOT -le $CURRENT_SLOT ]]; do
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

  # Append comma if needed
  if [[ $(tail -c 2 "$OUTPUT_FILE") != "[" ]]; then
    echo "," >> "$OUTPUT_FILE"
  fi

  echo "$RESPONSE" >> "$OUTPUT_FILE"

  echo $SLOT > "$PROGRESS_FILE"
  ((COUNT++))
  ((SLOT+=STEP))
  sleep 1
done

# Close JSON array
echo "]" >> "$OUTPUT_FILE"

echo "✅ Test complete — $COUNT blocks sampled and saved to $OUTPUT_FILE"
