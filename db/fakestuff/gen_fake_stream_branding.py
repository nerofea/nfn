import uuid
import random
from faker import Faker
from datetime import datetime

fake = Faker()

# CONFIG
STREAM_IDS = "streams.sql"
STREAMER_IDS = "streamers.sql"
COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF3']
LOGOS = [
    "https://placehold.co/200x200?text=Logo1",
    "https://placehold.co/200x200?text=Logo2",
    "https://placehold.co/200x200?text=Logo3"
]
BGS = [
    "https://placehold.co/600x400?text=EventBG1",
    "https://placehold.co/600x400?text=EventBG2",
    "https://placehold.co/600x400?text=EventBG3"
]

OUT_FILE = "seed_stream_branding.sql"

def generate_branding_row(stream_id, streamer_id):
    branding_id = str(uuid.uuid4())
    logo_url = random.choice(LOGOS)
    bg_img = random.choice(BGS)
    event_title = fake.catch_phrase()
    primary = random.choice(COLORS)
    secondary = random.choice([c for c in COLORS if c != primary])
    accent = random.choice([c for c in COLORS if c != primary and c != secondary])
    return (
        f"INSERT INTO stream_branding "
        f"(id, stream_id, streamers_id, logo_url, event_title, primary_color, secondary_color, accent_color, bg_img, created_at) "
        f"VALUES ('{branding_id}', '{stream_id}', '{streamer_id}', '{logo_url}', "
        f"'{event_title}', '{primary}', '{secondary}', '{accent}', '{bg_img}', NOW());"
    )

def write_seed_data(path, num=50):
    with open(path, "w") as f:
        for _ in range(num):
            stream_id = random.choice(STREAM_IDS)
            streamer_id = random.choice(STREAMER_IDS)
            f.write(generate_branding_row(stream_id, streamer_id) + "\n")

if __name__ == "__main__":
    write_seed_data(OUT_FILE, num=50)
    print(f"✅ Generated 50 fake stream_branding rows into {OUT_FILE}")
