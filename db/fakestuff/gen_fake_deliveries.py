# gen_seed_deliveries.py
import uuid
import random
from faker import Faker
from datetime import datetime, timedelta

fake = Faker()
random.seed(42)

# Load purchase_ids
purchase_ids = []
with open("seed_purchases.sql", "r") as f:
    for line in f:
        if line.startswith("INSERT INTO purchases"):
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

for _ in range(500):  # adjust the number of fake deliveries
    did = uuid.uuid4()
    purchase_id = random.choice(purchase_ids)
    courier_id = random.choice(courier_ids)
    tracking_number = fake.uuid4()
    address = fake.address().replace("\n", ", ")
    status = random.choice(statuses)

    shipped_at = fake.date_time_between(start_date="-10d", end_date="-1d")
    delivered_at = shipped_at + timedelta(days=random.randint(1, 5)) if status == 'delivered' else "NULL"
    notes = fake.sentence(nb_words=6)

    inserts.append(
        f"INSERT INTO deliveries (id, purchase_id, courier_id, tracking_number, delivery_address, delivery_status, shipped_at, delivered_at, notes) "
        f"VALUES ('{did}', '{purchase_id}', '{courier_id}', '{tracking_number}', '{address}', '{status}', '{shipped_at}', {f'\'{delivered_at}\'' if delivered_at != 'NULL' else 'NULL'}, '{notes}');"
    )

with open("seed_deliveries.sql", "w") as f:
    for stmt in inserts:
        f.write(stmt + "\n")

print("✅ Generated seed_deliveries.sql with 500 deliveries.")
