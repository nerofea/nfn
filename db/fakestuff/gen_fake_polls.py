import uuid
import random
from datetime import datetime

def load_ids_from_sql(file_path):
    ids = []
    with open(file_path, "r") as f:
        for line in f:
            if line.startswith("INSERT INTO"):
                id_str = line.split("VALUES")[1].split(",")[0].strip(" (')\n")
                ids.append(id_str)
    return ids

# Load all referenced IDs
campaign_managers = load_ids_from_sql("seed_campaign_managers.sql")
streamers = load_ids_from_sql("seed_streamers.sql")
influencers = load_ids_from_sql("seed_influencers.sql")
poll_managers = load_ids_from_sql("seed_poll_managers.sql")
advertisor_managers = load_ids_from_sql("seed_advertisor_managers.sql")
token_pairs = load_ids_from_sql("seed_loyalty_token_pairs.sql")
products = load_ids_from_sql("seed_products.sql")

with open("seed_polls.sql", "w") as out:
    for _ in range(500):
        poll_id = uuid.uuid4()
        campaign_manager_id = random.choice(campaign_managers)
        streamer_id = random.choice(streamers)
        influencer_id = random.choice(influencers)
        poll_manager_id = random.choice(poll_managers)
        advertisor_id = random.choice(advertisor_managers)
        loyalty_token_pair_id = random.choice(token_pairs)

        product_choices = random.sample(products, 3)
        product_id_1, product_id_2, product_id_3 = product_choices

        created_at = datetime.now().isoformat(sep=' ', timespec='seconds')

        out.write(
            f"INSERT INTO polls (id, campaign_manager_id, streamer_id, influencer_id, poll_manager_id, advertiser_id, loyalty_token_pair_id, "
            f"product_id_1, product_id_2, product_id_3, created_at) "
            f"VALUES ('{poll_id}', '{campaign_manager_id}', '{streamer_id}', '{influencer_id}', '{poll_manager_id}', "
            f"'{advertisor_id}', '{loyalty_token_pair_id}', '{product_id_1}', '{product_id_2}', '{product_id_3}', '{created_at}');\n"
        )
