RPC_URL="https://api.mainnet-beta.solana.com"

RESPONSE=$(curl -s "$RPC_URL" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"getEpochSchedule"
  }')
  
# Extract firstNormalEpoch and firstNormalSlot using jq
FIRST_NORMAL_EPOCH=$(echo $RESPONSE | jq '.result.firstNormalEpoch')
FIRST_NORMAL_SLOT=$(echo $RESPONSE | jq '.result.firstNormalSlot')
WARMUP=$(echo $RESPONSE | jq '.result.warmup')

echo "🧠 First Normal Epoch: $FIRST_NORMAL_EPOCH"
echo "🧠 First Normal Slot: $FIRST_NORMAL_SLOT"
echo "🧠 Warmup Phase Active?: $WARMUP"