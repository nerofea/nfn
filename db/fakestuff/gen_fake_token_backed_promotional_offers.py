import uuid
import random
import re
from datetime import datetime, timedelta

# INPUT FILES
TOKENS_FILE = "seed_loyalty_tokens.sql"
CAMPAIGN = "seed_campaigns.sql"
PRODUCTS_FILE ="seed_products.sql"
#RODUCT_TOKENS_FILE = "seed_product_loyalty_tokens.sql"
PURCHASES_FILE = "seed_purchases.sql"

CREATE TABLE loyalty_token_backed_promotional_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loyalty_campaign_id UUID REFERENCES loyalty_campaigns(id) ON DELETE CASCADE,  -- Reference to the loyalty campaign
  loyalty_token_id UUID REFERENCES loyalty_tokens(id),  -- Reference to the loyalty token
  token_amount NUMERIC(10,2) NOT NULL,  -- Amount of the token to reward
  created_at TIMESTAMP DEFAULT NOW(),
  product_id UUID REFERENCES products(id)
);

# OUTPUT FILES
OUT_LOYALTY_TOKEN_BACKED_PROMOTIONAL_OFFERS = "seed_loyalty_token_backed_promotional_offers.sql"
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


def extract_campaign_ids(filepath):
    campaigns = []
    with open(filepath, "r") as f:
        for line in f:
            match = re.findall(r"'([^']+)'", line)
            if match:
                campaigns.append(match[0])  # Assume first UUID is product_id or related
    return campaigns

# -----------------------------
# DATA GENERATION
# -----------------------------

def generate_loyalty_token_backed_offers_data(loyalty_tokens, product_tokens, purchases, num=100):
    loyalty_backed_promotional_offers = []

    for _ in range(num):
        loyalty_token_backed_promotional_offer_id = str(uuid.uuid4())
        loyalty_token_id = str(uuid.uuid4())

        # Choose a product/token pair randomly
        campaign_id, product_id, loyalty_token_id = random.choice(product)

        # Filter token symbol (optional)
        loyalty_token_symbol = next((s for t, s in tokens if t == token_id), "UNK")

        # Simulate loyalty token threshold (e.g. cost to access campaign)
        required_loyalty_token_cost = round(random.uniform(1, 5), 2)

        loyalty_token_backed_promotional_offers.append({
            "loyalty_token_backed_promotional_offers": loyalty_token_backed_promotional_offers,
            "product_id": poll_id,
            "loyalty_token_id": token_id,
            "loyalty_token_symbol": loyalty_token_symbol,
            "required_loyalty_token_cost": required_loyaty_token_cost,
            "product_id": product_id
        })

    return loyalty_token_backed_promotional_offers

# -----------------------------
# WRITE SQL OUTPUT
# -----------------------------

def write_loyalty_token_backed_promotional_offers_sql(loyalty_token_backed_promotional_offers, path):
    with open(path, "w") as f:
        for c in loyalty_token_backed_promotional_offers:
            f.write(
                f"INSERT INTO loyalty_token_backed_promotional_offers (id, poll_id, campaign_id) VALUES "
                f"('{c['campaign_id']}', '{c['poll_id']}', '{c['token_id']}'); "
                f"-- product: {c['product_id']} / min: {c['required_cost']} {c['token_symbol']}\n"
            )


# -----------------------------
# MAIN
# -----------------------------

if __name__ == "__main__":
    loyalty_tokens = extract_token_ids_and_symbols(TOKENS_FILE)
    products = extract_product_ids(PRODUCTS_FILE)  # ✅ correct
    product_tokens = extract_product_loyalty_tokens(PRODUCT_TOKENS_FILE)
    purchases = extract_purchase_product_ids(PURCHASES_FILE)

    if not tokens or not product_tokens or not purchases:
        raise Exception("Missing input data for token or product or purchases.")

    loyalty_token_backed_promotional_offers = generate_loyalty_token_backed_promotional_offers_data(loyalty_tokens, campaigns, product_tokens, purchases, num=100)
    write_loyalty_token_backed_promotional_offers_sql(campaigns, OUT_CAMPAIGNS)+

    print(f"✅ Generated {len(loyalty_token_backed_promotional_offers)} loyalty_token_backed_promotional_offers with product promotional offers.")
