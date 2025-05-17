import uuid
import random
from faker import Faker
from datetime import datetime

fake = Faker()
Faker.seed(42)
random.seed(42)

# Generate 100 fake users (UUIDs only, assuming already inserted in 'users' table)
user_ids = [uuid.uuid4() for _ in range(100)]

# Role distribution
random.shuffle(user_ids)
roles = {
    "campaign_managers": user_ids[0:10],
    "advertisor_managers": user_ids[10:20],
    "ecommerce_managers": user_ids[20:30],
    "poll_managers": user_ids[30:40],
    "stream_managers": user_ids[40:50],
    "stream_moderators": user_ids[45:55],  # Overlap allowed
    "streamers": user_ids[55:65],
    "influencers": user_ids[65:75],
    "viewers": user_ids[76:100],
}

# Generate insert statements
inserts = []

# Campaign Managers
for uid in roles["campaign_managers"]:
    inserts.append(
        f"INSERT INTO campaign_managers (id, user_id, region) VALUES ('{uuid.uuid4()}', '{uid}', '{fake.state()}');"
    )

# Advertisor Managers
for uid in roles["advertisor_managers"]:
    inserts.append(
        f"INSERT INTO advertisor_managers (id, user_id, company_name, verified) VALUES ('{uuid.uuid4()}', '{uid}', '{fake.company()}', {random.choice(['TRUE', 'FALSE'])});"
    )

# E-commerce Managers
for uid in roles["ecommerce_managers"]:
    created = datetime.now().isoformat(sep=' ', timespec='seconds')
    inserts.append(
        f"INSERT INTO ecommerce_managers (id, user_id, created_at) VALUES ('{uuid.uuid4()}', '{uid}', '{created}');"
    )

# Poll Managers
for uid in roles["poll_managers"]:
    inserts.append(
        f"INSERT INTO poll_managers (id, user_id) VALUES ('{uuid.uuid4()}', '{uid}');"
    )

# Stream Managers
for uid in roles["stream_managers"]:
    stream_id = uuid.uuid4()
    inserts.append(
        f"INSERT INTO stream_managers (id, user_id, stream_id, role, created_at) VALUES ('{uuid.uuid4()}', '{uid}', '{stream_id}', '{random.choice(['moderator', 'admin'])}', '{datetime.now().isoformat(sep=' ', timespec='seconds')}');"
    )

# Stream Moderators
for uid in roles["stream_moderators"]:
    stream_id = uuid.uuid4()
    inserts.append(
        f"INSERT INTO stream_moderators (id, user_id, stream_id, role, created_at) VALUES ('{uuid.uuid4()}', '{uid}', '{stream_id}', '{random.choice(['moderator', 'admin'])}', '{datetime.now().isoformat(sep=' ', timespec='seconds')}');"
    )

# Streamers
for uid in roles["streamers"]:
    inserts.append(
        f"INSERT INTO streamers (id, user_id, twitch_handle, youtube_handle) VALUES ('{uuid.uuid4()}', '{uid}');"
    )

# Viewers
for uid in roles["viewers"]:
    inserts.append(
        f"INSERT INTO viewers (id, user_id) VALUES ('{uuid.uuid4()}', '{uid}');"
    )

# Influencers
for uid in roles["influencers"]:
    inserts.append(
        f"INSERT INTO influencers (id, user_id, twitch_handle, youtube_handle) VALUES ('{uuid.uuid4()}', '{uid}');"
    )

# Print or save
with open("seed_roles.sql", "w") as f:
    for stmt in inserts:
        f.write(stmt + "\n")

print("✅ Generated seed_roles.sql with role-based inserts.")
