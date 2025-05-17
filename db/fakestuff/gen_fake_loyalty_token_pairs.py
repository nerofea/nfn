# gen_fake_loyalty_token_pairs.py

import uuid
import re
import itertools

INPUT_FILE = "seed_loyalty_tokens.sql"
OUTPUT_FILE = "seed_loyalty_token_pairs.sql"

def extract_token_ids(file_path):
    token_ids = []
    with open(file_path, "r") as f:
        for line in f:
            match = re.search(r"VALUES \('([^']+)'", line)
            if match:
                token_ids.append(match.group(1))
    return token_ids

def generate_all_unique_pairs(token_ids):
    return list(itertools.combinations(token_ids, 2))  # (base_id, quote_id)

def write_pairs_to_sql(pairs, file_path):
    with open(file_path, "w") as f:
        for base_id, quote_id in pairs:
            pair_id = str(uuid.uuid4())
            f.write(
                f"INSERT INTO loyalty_token_pairs (id, base_token_id, quote_token_id, created_at) "
                f"VALUES ('{pair_id}', '{base_id}', '{quote_id}', NOW());\n"
            )

if __name__ == "__main__":
    token_ids = extract_token_ids(INPUT_FILE)
    pairs = generate_all_unique_pairs(token_ids)
    write_pairs_to_sql(pairs, OUTPUT_FILE)
    print(f"✅ Generated {len(pairs)} loyalty token pairs in {OUTPUT_FILE}")
