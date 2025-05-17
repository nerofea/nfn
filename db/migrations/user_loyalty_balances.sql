CREATE TABLE user_loyalty_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  token_id UUID REFERENCES loyalty_tokens(id),
  balance NUMERIC DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
