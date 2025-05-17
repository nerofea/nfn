# gen_loyalty_tokens.py

import uuid
from faker import Faker
from datetime import datetime
import random

fake = Faker()
Faker.seed(42)
random.seed(42)

symbols = set()
inserts = []

while len(symbols) < 100:
    symbol = fake.lexify(text='???').upper()
    if symbol not in symbols:
        symbols.add(symbol)
        token_id = uuid.uuid4()
        name = fake.word().capitalize() + " Token"
        description = fake.sentence(nb_words=6)
        created_at = datetime.now().isoformat(sep=' ', timespec='seconds')

        inserts.append(
            f"INSERT INTO loyalty_tokens (id, symbol, name, description, created_at) VALUES ('{token_id}', '{symbol}', '{name}', '{description}', '{created_at}');"
        )

# Save to file
with open("seed_loyalty_tokens.sql", "w") as f:
    for stmt in inserts:
        f.write(stmt + "\n")

print("✅ Generated seed_loyalty_tokens.sql with 100 fake tokens.")
