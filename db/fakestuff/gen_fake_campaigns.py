import uuid
import random
import re
from datetime import datetime, timedelta

# INPUT FILES
TOKENS_FILE = "seed_loyalty_tokens.sql"
PRODUCTS_FILE ="products.sql"
PRODUCT_TOKENS_FILE = "product_loyalty_tokens.sql"
PURCHASES_FILE = "purchases.sql"

# OUTPUT FILES
OUT_CAMPAIGNS = "seed_campaigns.sql"
OUT_CAMPAIGN_POLLS = "seed_campaign_polls.sql"

# -----------------------------
# UTILITIES
# -----------------------------

def extract_token_ids_and_symbols(filepath):
    tokens = []
    with open(filepath, "r") as f:
        for line in f:
            match = re.search(r"VALUES \('([^']+)', '([^']+)',", line)
            if match:
                token_id, symbol = match.groups()
                tokens.append((token_id, symbol))
    return tokens

def extract_product_loyalty_tokens(filepath):
    product_tokens = []
    with open(filepath, "r") as f:
        for line in f:
            match = re.findall(r"'([^']+)'", line)
            if len(match) >= 2:
                product_tokens.append((match[0], match[1]))  # product_id, token_id
    return product_tokens

def extract_purchase_product_ids(filepath):
    purchases = []
    with open(filepath, "r") as f:
        for line in f:
            match = re.findall(r"'([^']+)'", line)
            if match:
                purchases.append(match[0])  # Assume first UUID is product_id or related
    return purchases

def extract_product_ids(filepath):
    products = []
    with open(filepath, "r") as f:
        for line in f:
            match = re.findall(r"'([^']+)'", line)
            if match:
                products.append(match[0])  # Assume first UUID is product_id or related
    return products

# -----------------------------
# DATA GENERATION
# -----------------------------

def generate_campaign_data(tokens, product_tokens, purchases, num=100):
    campaigns = []

    for _ in range(num):
        campaign_id = str(uuid.uuid4())
        poll_id = str(uuid.uuid4())

        # Choose a product/token pair randomly
        product_id, token_id = random.choice(product_tokens)

        # Filter token symbol (optional)
        token_symbol = next((s for t, s in tokens if t == token_id), "UNK")

        # Simulate loyalty token threshold (e.g. cost to access campaign)
        required_token_cost = round(random.uniform(1, 5), 2)

        campaigns.append({
            "campaign_id": campaign_id,
            "poll_id": poll_id,
            "token_id": token_id,
            "token_symbol": token_symbol,
            "required_cost": required_token_cost,
            "product_id": product_id
        })

    return campaigns

# -----------------------------
# WRITE SQL OUTPUT
# -----------------------------

def write_campaigns_sql(campaigns, path):
    with open(path, "w") as f:
        for c in campaigns:
            f.write(
                f"INSERT INTO campaigns (id, poll_id, campaign_id) VALUES "
                f"('{c['campaign_id']}', '{c['poll_id']}', '{c['token_id']}'); "
                f"-- product: {c['product_id']} / min: {c['required_cost']} {c['token_symbol']}\n"
            )

def write_campaign_polls_sql(campaigns, path):
    with open(path, "w") as f:
        for c in campaigns:
            poll_link_id = str(uuid.uuid4())
            f.write(
                f"INSERT INTO campaign_polls (id, poll_id, campaign_id) VALUES "
                f"('{poll_link_id}', '{c['poll_id']}', '{c['campaign_id']}');\n"
            )

# -----------------------------
# MAIN
# -----------------------------

if __name__ == "__main__":
    tokens = extract_token_ids_and_symbols(TOKENS_FILE)
    products = extract_product_ids(PRODUCTS_FILE)  # ✅ correct
    product_tokens = extract_product_loyalty_tokens(PRODUCT_TOKENS_FILE)
    purchases = extract_purchase_product_ids(PURCHASES_FILE)

    if not tokens or not product_tokens or not purchases:
        raise Exception("Missing input data for token or product or purchases.")

    campaigns = generate_campaign_data(tokens, product_tokens, purchases, num=100)
    write_campaigns_sql(campaigns, OUT_CAMPAIGNS)
    write_campaign_polls_sql(campaigns, OUT_CAMPAIGN_POLLS)

    print(f"✅ Generated {len(campaigns)} campaigns with polls and access cost.")
