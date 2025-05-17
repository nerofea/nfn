count the number of iterative duplicated signatures, 

from solana.rpc.api import Client
client = Client("https://devnet.helius-rpc.com/?api-key=934c08b5-0c44-4549-bda8-30587b901642")

RPC_URL = client


# open the file of signatures 
import json

for json in data: 
    with open('data/slot_signatures_epoch779.json') as f:
        data = json.load(f)    



all_signatures = []
all_block_times = []

for block in data:
    block_time = block.get('blockTime')
    transactions = block.get('transactions', [])
    for tx in transactions:
        signatures = tx['transaction']['signatures']
        for sig in signatures:
            all_signatures.append(sig)
            all_block_times.append(block_time)



# Detect smurfing
# Check if a sender has 5+ transactions within 10 seconds

threshold_seconds = 10
burst_count = 5

previous_time = None
burst_times = []

for i, time in enumerate(all_block_times):
    if previous_time and (time - previous_time) <= threshold_seconds:
        burst_times.append(time)
        if len(burst_times) >= burst_count:
            print(f"⚠️ Potential structuring detected starting at {burst_times[0]}")
    else:
        burst_times = [time]
    previous_time = time



#  Detect Obfuscation / Randomized Gaps (fake "human" behavior)

# Check for inconsistent time gaps between transactions

time_gaps = []

for i in range(1, len(all_block_times)):
    gap = all_block_times[i] - all_block_times[i-1]
    time_gaps.append(gap)

# Check if gaps are very random (high variance)
import statistics

if len(time_gaps) > 1:
    variance = statistics.variance(time_gaps)
    print(f"🔎 Gap variance: {variance}")
    if variance > 20:  # Arbitrary number, tune based on real data
        print("⚠️ Potential obfuscation behavior detected (high timing randomness).")


# 3️⃣ Detect Probing / Weakness Testing (rapid bursts then gaps)
# Look for burst of fast txs, then sudden long delay

threshold_burst_gap = 3  # seconds
long_pause = 30  # seconds

for i in range(1, len(all_block_times)-1):
    gap1 = all_block_times[i] - all_block_times[i-1]
    gap2 = all_block_times[i+1] - all_block_times[i]

    if gap1 <= threshold_burst_gap and gap2 >= long_pause:
        print(f"⚡ Possible probing detected: burst at {all_block_times[i-1]}, pause after {gap2}s")

# 4️⃣ Detect Transaction Floods (spam detection)
# Find slots where number of signatures is abnormally high

for block in data:
    block_time = block.get('blockTime')
    tx_count = len(block.get('transactions', []))
    if tx_count > 1500:  # Arbitrary spam threshold (normal = 300-700 usually)
        print(f"🚨 Possible spam/flood detected at blockTime {block_time}: {tx_count} transactions")


# 5️⃣ Detect Forks / Slot Skips (missing slot numbers)
# Check for skipped slots (gap in slot numbers)

previous_slot = None
for block in data:
    current_slot = block.get('parentSlot') + 1  # Expected next slot
    if previous_slot is not None and current_slot != previous_slot + 1:
        print(f"⚡ Missing or skipped slot detected between {previous_slot} and {current_slot}")
    previous_slot = current_slot

