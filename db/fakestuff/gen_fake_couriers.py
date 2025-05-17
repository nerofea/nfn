import uuid
import random

# Read user IDs from the formatted seed_roles.sql file
user_ids = []

with open("seed_users.sql", "r") as f:
    for line in f:
        line = line.strip()
        if line.startswith("INSERT INTO users"):
            uid = line.split("VALUES ('")[1].split("'")[0]
            user_ids.append(uid)

# Safety check
if len(user_ids) < 132:
    raise ValueError(f"Expected at least 132 users, found only {len(user_ids)}")

# Select users 101–131 for couriers
courier_ids = user_ids[101:132]
vehicle_types = ['4meter', '1point5meter', '4wheeler']

# Generate insert statements
inserts = []
for uid in courier_ids:
    vehicle = random.choice(vehicle_types)
    inserts.append(
        f"INSERT INTO couriers (id, user_id, vehicle_type) VALUES ('{uuid.uuid4()}', '{uid}', '{vehicle}');"
    )

# Save to file
with open("seed_couriers.sql", "w") as f:
    f.write("\n".join(inserts))

print("✅ seed_couriers.sql generated with 31 couriers.")
