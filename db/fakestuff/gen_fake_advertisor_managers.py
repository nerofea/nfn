import uuid
import random
from faker import Faker

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

# Load user_ids
user_ids = load_ids_from_sql("seed_users.sql")
random.shuffle(user_ids)
num_to_generate = min(200, len(user_ids))  # Adjust as needed

with open("seed_advertisor_managers.sql", "w") as out:
    for i in range(num_to_generate):
        advertisor_manager_id = uuid.uuid4()
        user_id = user_ids[i]
        company_name = fake.company()
        verified = random.choice(["TRUE", "FALSE"])

        out.write(
            f"INSERT INTO advertisor_managers (id, user_id, company_name, verified) "
            f"VALUES ('{advertisor_manager_id}', '{user_id}', '{company_name}', {verified});\n"
        )
