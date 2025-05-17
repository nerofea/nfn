import uuid
import random

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

# Avoid duplicate user_ids
random.shuffle(user_ids)
num_to_generate = min(200, len(user_ids))  # Adjust count as needed

with open("seed_campaign_managers.sql", "w") as out:
    for i in range(num_to_generate):
        campaign_manager_id = uuid.uuid4()
        user_id = user_ids[i]
        region = user_ids[i]
        out.write(
            f"INSERT INTO campaign_managers (id, user_id, region) "
            f"VALUES ('{campaign_manager_id}', '{user_id}', '{region}');\n"
        )