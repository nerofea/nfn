import uuid
import random
from faker import Faker
from datetime import datetime

# Initialize faker
fake = Faker()
Faker.seed(42)
random.seed(42)

# Generate 100 INSERT statements
for _ in range(1000):
    user_id = uuid.uuid4()
    email = fake.unique.email()
    username = fake.unique.user_name()
    password_hash = fake.sha256()
    created_at = datetime.now().isoformat(sep=' ', timespec='seconds')

    print(
        f"INSERT INTO users (id, email, username, password_hash, created_at) "
        f"VALUES ('{user_id}', '{email}', '{username}', '{password_hash}', '{created_at}');"
    )
