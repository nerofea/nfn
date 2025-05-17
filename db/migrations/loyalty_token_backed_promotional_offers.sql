CREATE TABLE loyalty_token_backed_promotional_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loyalty_campaign_id UUID REFERENCES loyalty_campaigns(id) ON DELETE CASCADE,  -- Reference to the loyalty campaign
  loyalty_token_id UUID REFERENCES loyalty_tokens(id),  -- Reference to the loyalty token
  token_amount NUMERIC(10,2) NOT NULL,  -- Amount of the token to reward
  created_at TIMESTAMP DEFAULT NOW(),
  product_id UUID REFERENCES products(id)
);
