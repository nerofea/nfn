import uuid
import random
from faker import Faker
from datetime import datetime

fake = Faker()
random.seed(42)

def load_ids_from_sql(file_path):
    ids = []
    with open(file_path, 'r') as f:
        for line in f:
            if line.startswith("INSERT INTO"):
                id_str = line.split("VALUES")[1].split(",")[0].strip(" (')\n")
                ids.append(id_str)
    return ids

# Load user_ids and stream_ids
user_ids = load_ids_from_sql("seed_users.sql")
roles = ["admin", "moderator", "manager", "support"]

# Write to output file
with open("seed_stream_managers.sql", "w") as out:
    for _ in range(500):
        manager_id = uuid.uuid4()
        user_id = random.choice(user_ids)
        role = random.choice(roles)
        created_at = datetime.now().isoformat(sep=' ', timespec='seconds')

        out.write(
            f"INSERT INTO stream_managers (id, user_id, stream_id, role, created_at) "
            f"VALUES ('{manager_id}', '{user_id}', '{role}', '{created_at}');\n"
        )
