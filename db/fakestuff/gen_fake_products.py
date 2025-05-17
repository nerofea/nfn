# gen_seed_products.py
import uuid
import random
from faker import Faker
from datetime import datetime, timedelta

fake = Faker()
Faker.seed(42)
random.seed(42)

# Load ecommerce_manager UUIDs from seed_roles.sql
ecommerce_manager_ids = []
with open("seed_roles.sql", "r") as f:
    for line in f:
        if line.startswith("INSERT INTO ecommerce_managers"):
            parts = line.split("VALUES")[1].strip(" ();").split(",")
            ecommerce_manager_ids.append(parts[0].strip(" '"))

# Load loyalty_token IDs from seed_loyalty_tokens.sql
loyalty_token_ids = []
with open("seed_loyalty_tokens.sql", "r") as f:
    for line in f:
        if line.startswith("INSERT INTO loyalty_tokens"):
            parts = line.split("VALUES")[1].strip(" ();").split(",")
            loyalty_token_ids.append(parts[0].strip(" '"))

# Simulate 20 fake fulfillment center UUIDs
fulfillment_center_ids = [str(uuid.uuid4()) for _ in range(20)]
product_categories = [
    "Apparel", "Electronics", "Beauty", "Fitness", "Outdoor",
    "Home", "Digital", "Toys", "Books", "Services"
]

inserts = []
for _ in range(10000):
    pid = str(uuid.uuid4())
    name = fake.catch_phrase().replace("'", "''")
    desc = fake.text(max_nb_chars=120).replace("'", "''")
    price = round(random.uniform(3.5, 299.99), 2)
    currency = "EUR"
    created_by = random.choice(ecommerce_manager_ids)
    fulfillment_center = random.choice(fulfillment_center_ids)
    dropshipping_hash = fake.sha1()
    date_from = fake.date_between(start_date="+1d", end_date="+30d")
    date_to = date_from + timedelta(days=random.randint(7, 90))
    category = random.choice(product_categories)

    # Optional claimable token logic
    if loyalty_token_ids and random.random() < 0.7:
        claimable_token = random.choice(loyalty_token_ids)
        claimable_min_amount = round(random.uniform(5, 100), 2)
        claim_fields = f", '{claimable_token}', {claimable_min_amount}"
    else:
        claim_fields = ", NULL, NULL"

    inserts.append(
        f"INSERT INTO products (id, name, description, minPrice, currency, created_by, "
        f"fulfillment_center_id, dropshipping_api_hash, dateFrom, dateTo, productCategory, "
        f"claimable_by, loyalty_token_rewarded) "
        f"VALUES ('{pid}', '{name}', '{desc}', {price}, '{currency}', '{created_by}', "
        f"'{fulfillment_center}', '{dropshipping_hash}', '{date_from}', '{date_to}', "
        f"'{category}'{claim_fields});"
    )

with open("seed_products.sql", "w") as f:
    for stmt in inserts:
        f.write(stmt + "\n")

print("✅ Generated seed_products.sql with 10,000 products.")
