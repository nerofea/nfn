CREATE TABLE product_loyalty_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  token_id UUID REFERENCES loyalty_tokens(id),
  required_amount NUMERIC NOT NULL,
  reward_description TEXT
);
