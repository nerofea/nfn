# gen_seed_deliveries.py
import uuid
import random
from faker import Faker
from datetime import datetime, timedelta

fake = Faker()
random.seed(42)

# Load purchase_ids
purchase_ids = []
with open("seed_buy_transactions.sql", "r") as f:
    for line in f:
        if line.startswith("INSERT INTO transactions"):
            parts = line.split("VALUES")[1].strip(" ();").split(",")
            purchase_ids.append(parts[0].strip(" '"))

# Load courier_ids
courier_ids = []
with open("seed_couriers.sql", "r") as f:
    for line in f:
        if line.startswith("INSERT INTO couriers"):
            parts = line.split("VALUES")[1].strip(" ();").split(",")
            courier_ids.append(parts[0].strip(" '"))

# Safety check
if not purchase_ids or not courier_ids:
    raise Exception("Missing purchase or courier IDs.")

statuses = ['pending', 'shipped', 'delivered']
inserts = []

for _ in range(5000):  # Generage 5000 fake purchases
    did = uuid.uuid4()
    purchase_id = random.choice(purchase_ids)
    courier_id = random.choice(courier_ids)
    tracking_number = fake.uuid4()
    delivery_address = fake.address().replace("\n", ", ")
    status = random.choice(statuses)

    shipped_at = fake.date_time_between(start_date="-10d", end_date="-1d")
    delivered_at = shipped_at + timedelta(days=random.randint(1, 5)) if status == 'delivered' else "NULL"
    notes = fake.sentence(nb_words=6)

    inserts.append(
        f"INSERT INTO deliveries (id, purchase_id, courier_id, tracking_number, delivery_address, delivery_status, shipped_at, delivered_at, notes) "
        f"VALUES ('{did}', '{purchase_id}', '{courier_id}', '{tracking_number}', '{address}', '{status}', '{shipped_at}', {f'\'{delivered_at}\'' if delivered_at != 'NULL' else 'NULL'}, '{notes}');"
    )

CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  courier_id UUID REFERENCES couriers(id),
  fiat_amount NUMERIC(10,2),
  crypto_amount NUMERIC(10,8),
  loyalty_token_pair_id UUID REFERENCES loyalty_token_pairs(id),
  loyalty_token_used_id UUID REFERENCES loyalty_tokens(id),
  token_amount NUMERIC(10,4),
  delivery_address TEXT,
  poll_id UUID,
  vote_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

#Your public transaction is not known by the system directly, Neither will the system publicse your poll_id, neither your vote_id. 
# Privately, on db, the public tranaction or event extrinsic isnt tied to the vote or poll creation, even though we do the keep the poll id and vote id on hand. 
# THis is meant for the human rights to privacy
# At the time of purchase,
# what is chained, is the value of the transaction to the live stream and live stream poll.  The exac 


with open("seed_deliveries.sql", "w") as f:
    for stmt in inserts:
        f.write(stmt + "\n")

print("✅ Generated seed_deliveries.sql with 500 deliveries.")
