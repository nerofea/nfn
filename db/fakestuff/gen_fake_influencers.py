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

# Write to file
with open("seed_influencers.sql", "w") as out:
    for _ in range(500):
        influencer_id = uuid.uuid4()
        user_id = random.choice(user_ids)
        instagram = f"tinstagram.com/{fake.user_name()}"
        tiktok = f"tiktok.com/@{fake.user_name()}"
        youtube = f"youtube.com/@{fake.user_name()}"

        out.write(
            f"INSERT INTO influencers (id, user_id, instagram_handle, tiktok_handle, youtube_handle) "
            f"VALUES ('{influencer_id}', '{user_id}', '{instagram}', '{tiktok}', '{youtube}');\n"
        )
