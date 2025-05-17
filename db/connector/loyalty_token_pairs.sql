CREATE TABLE loyalty_token_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_a_id UUID REFERENCES loyalty_tokens(id),
  token_b_id UUID REFERENCES loyalty_tokens(id),
  purpose TEXT, -- e.g. "voting", "discount", etc.
  created_at TIMESTAMP DEFAULT NOW()
);
