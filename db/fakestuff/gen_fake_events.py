import uuid
import random
import hashlib
from faker import Faker
from datetime import datetime, timedelta
import os

fake = Faker()
random.seed(42)

# Simulate loading IDs
purchase_ids = [str(uuid.uuid4()) for _ in range(100)]
courier_ids = [str(uuid.uuid4()) for _ in range(10)]
user_ids = [str(uuid.uuid4()) for _ in range(50)]
token_pair_ids = [str(uuid.uuid4()) for _ in range(10)]
token_ids = [str(uuid.uuid4()) for _ in range(10)]

statuses = ['pending', 'shipped', 'delivered']

# Storage for SQL insert strings
sql_files = {
    "deliveries": [],
    "purchases": [],
    "hashed_purchases": [],
    "nfn_purchases": [],

    "campaign_events": [],
    "campaign_manager_events": [],
    "live_stream_manager_events": [],
    "advertising_manager_events": [],
    "ecommerce_manager_events": [],
    "moderator_events": [],
    "live_stream_events": [],
    "live_streamer_events": [],
    "poll_events": [],
    
    "poll_manager_events": [],
    "social_media_manager_events": [],
    "influencer_events": [],
    "collab_events": [],
    "loyalty_token_pair_events": [],
    "loyalty_token_events": [],

    "loyalty_token_claimed_events": [],
    "loyalty_token_staked_events": [],
    "loyalty_token_createdorreleased_events": [],

    "nfn_events": [],
    "solana_events": [],
    "aztec_events": [],

    "event_transactions": [],
    "event_happenings": [],
    "nfn": [],
    "campaign_loyalty_token_metrics": [],
    "campaign_loyalty_token_pair_metrics": [],
    
}


def generate_event_hash(purchase_id, user_id, salt="nfn_salt"):
    raw = f"{purchase_id}{user_id}{salt}"
    return hashlib.sha256(raw.encode()).hexdigest()

for _ in range(100):  # Generate 100 fake purchases for demo
    did = str(uuid.uuid4())
    purchase_id = random.choice(purchase_ids)
    courier_id = random.choice(courier_ids)
    user_id = random.choice(user_ids)
    loyalty_token_pair_id = random.choice(loyalty_token_pair_ids)
    token_id = random.choice(token_ids)
    fiat_amount = round(random.uniform(5, 500), 2)
    crypto_amount = round(random.uniform(0.001, 1.0), 8)
    token_amount = round(random.uniform(1, 100), 4)
    tracking_number = fake.uuid4()
    delivery_address = fake.address().replace("\n", ", ")
    status = random.choice(statuses)
    shipped_at = fake.date_time_between(start_date="-10d", end_date="-1d")
    delivered_at = shipped_at + timedelta(days=random.randint(1, 5)) if status == 'delivered' else None
    notes = fake.sentence(nb_words=6)
    created_at = shipped_at
    event_hash = generate_event_hash(purchase_id, user_id)

    delivered_at_value = f"'{delivered_at}'" if delivered_at else "NULL"

    # Campaign Events
    sql_files["modular_events"].append(
    f"INSERT INTO campaign_events (id, campaign_id, event_hash, timestamp) VALUES ('{uuid.uuid4()}', '{uuid.uuid4()}', '{event_hash}', '{created_at}');"
    )

    # Poll events
    sql_files["modular_events"].append(
        f"INSERT INTO poll_events (id, poll_id, event_hash, user_id, created_at) VALUES ('{uuid.uuid4()}', '{uuid.uuid4()}', '{event_hash}', '{user_id}', '{created_at}');"
    )


    # Deliveries
    sql_files["deliveries"].append(
        f"INSERT INTO deliveries (id, purchase_id, courier_id, tracking_number, delivery_address, delivery_status, shipped_at, delivered_at, notes) "
        f"VALUES ('{did}', '{purchase_id}', '{courier_id}', '{tracking_number}', '{delivery_address}', '{status}', '{shipped_at}', {delivered_at_value}, '{notes}');"
    )

    # Hashed Purchases
    sql_files["hashed_purchases"].append(
        f"INSERT INTO hashed_purchases (event_hash, tx_hash, chain, loyalty_token_pair_id, fiat_amount, crypto_amount, token_amount, timestamp) "
        f"VALUES ('{event_hash}', '{tracking_number}', 'NFN', '{token_pair_id}', {fiat_amount}, {crypto_amount}, {token_amount}, '{created_at}');"
    )

    # Chain Events
    sql_files["chain_events_nfn"].append(
        f"INSERT INTO chain_events_nfn (event_hash, tx_hash, loyalty_token_pair_id, fiat_amount, token_amount, timestamp) "
        f"VALUES ('{event_hash}', '{uuid.uuid4()}', '{token_pair_id}', {fiat_amount}, {token_amount}, '{created_at}');"
    )
    sql_files["chain_events_solana"].append(
        f"INSERT INTO chain_events_solana (tx_signature, event_hash, slot, block_time, program_id, token_mint, token_amount, decoded_metadata, confirmed) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', {random.randint(10000000, 20000000)}, '{created_at}', 'ProgramXYZ', '{token_id}', {token_amount}, '{{}}', TRUE);"
    )

    sql_files["chain_events_aztec"].append(
        f"INSERT INTO chain_events_aztec (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )

    sql_files["campaign_manager_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )

    sql_files["live_stream_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )

    sql_files["live_stream_manager_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )
    sql_files["ecommerce_manager_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )
    sql_files["advertising_manager_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )
    sql_files["moderator_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )
    sql_files["poll_manager_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )
    sql_files["influencer_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )
    sql_files["social_media_manager_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )

    sql_files["collab_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )

    sql_files["social_media_manager_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )

    sql_files["loyalty_token_claimed_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )

    sql_files["loyalty_token_createdorreleased_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )

    sql_files["loyalty_token_claimed_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )

    sql_files["loyalty_token_pair_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )
    sql_files["loyalty_token_opened_positions_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )

    sql_files["loyalty_token_closed_positions_events"].append(
        f"INSERT INTO campaign_manager_events (nullifier_hash, event_hash, zk_proof, commitment, block_number, timestamp, verified) "
        f"VALUES ('{uuid.uuid4()}', '{event_hash}', '{uuid.uuid4()}', '{uuid.uuid4()}', {random.randint(100000, 999999)}, '{created_at}', TRUE);"
    )

    # Other Events (placeholders)
    sql_files["event_transactions"].append(f"-- Simulated insert for event_transactions with event_hash {event_hash};")
    sql_files["event_happenings"].append(f"-- Simulated insert for event_happenings with event_hash {event_hash};")
    sql_files["nfn"].append(f"-- Simulated insert for nfn with event_hash {event_hash};")
    sql_files["loyalty_token_events"].append(f"-- Simulated insert for loyalty_token_events with token_id {token_id};")
    sql_files["campaign_loyalty_token_metrics"].append(f"-- Simulated insert for campaign_loyalty_token_metrics for token {token_id};")
    sql_files["campaign_loyalty_token_pair_metrics"].append(f"-- Simulated insert for campaign_loyalty_token_pair_metrics for pair {token_pair_id};")



 (distinct from metrics table)



# Save to files
output_dir = "generated_sql"
os.makedirs(output_dir, exist_ok=True)

for key, lines in sql_files.items():
    with open(os.path.join(output_dir, f"{key}.sql"), "w") as f:
        f.writelines(line + "\n" for line in lines)

print("✅ All SQL files generated in /generated_sql folder.")
