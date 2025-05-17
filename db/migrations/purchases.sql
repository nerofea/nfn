CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  courier_id UUID REFERENCES couriers(id),
  fiat_amount NUMERIC(10,2),
  crypto_amount NUMERIC(10,8),
  loyalty_token_pair_id UUID REFERENCES loyalty_token_pairs(id),
  loyalty_token_used_id UUID REFERENCES loyalty_tokens(id),
  token_amount NUMERIC(10,4),
  delivery_address TEXT,
  poll_id UUID,
  vote_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC(10,2)
);
