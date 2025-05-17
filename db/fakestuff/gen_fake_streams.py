import uuid
import random
from faker import Faker
from datetime import datetime, timedelta

fake = Faker()
random.seed(42)
Faker.seed(42)

def load_ids_from_sql(file_path):
    ids = []
    with open(file_path, 'r') as f:
        for line in f:
            if line.startswith("INSERT INTO"):
                id_str = line.split("VALUES")[1].split(",")[0].strip(" (')\n")
                ids.append(id_str)
    return ids

# Load existing UUIDs from your SQL seed files
streamers = load_ids_from_sql("seed_streamers.sql")
influencers = load_ids_from_sql("seed_influencers.sql")
moderators = load_ids_from_sql("seed_stream_moderators.sql")
managers = load_ids_from_sql("seed_stream_managers.sql")
polls = load_ids_from_sql("seed_polls.sql")
owners = load_ids_from_sql("seed_users.sql")

# Generate fake stream rows
for _ in range(1000):
    stream_id = uuid.uuid4()
    title = fake.catch_phrase()
    description = fake.text(max_nb_chars=200)
    start_time = fake.date_time_between(start_date='-30d', end_date='now')
    end_time = start_time + timedelta(hours=random.randint(1, 3))
    created_at = datetime.now().isoformat(sep=' ', timespec='seconds')

    print(
        f"INSERT INTO streams (id, title, description, start_time, end_time, created_at, streamers_id, influencer_id, stream_moderator_id, stream_manager_id, poll_id, stream_owner_id) "
        f"VALUES ('{stream_id}', '{title}', '{description}', '{start_time}', '{end_time}', '{created_at}', "
        f"'{random.choice(streamers)}', '{random.choice(influencers)}', '{random.choice(moderators)}', "
        f"'{random.choice(managers)}', '{random.choice(polls)}', '{random.choice(owners)}');"
    )
