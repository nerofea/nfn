CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_manager_id UUID REFERENCES campaign_managers(id),
  streamer_id UUID REFERENCES streamers(id),
  influencer_id UUID REFERENCES influencers(id),
  poll_manager_id UUID REFERENCES poll_managers(id),
  advertiser_id UUID REFERENCES advertisers(id),
  loyalty_token_pair_id UUID REFERENCES loyalty_token_pairs(id),

  product_id_1 UUID REFERENCES products(id),
  product_id_2 UUID REFERENCES products(id),
  product_id_3 UUID REFERENCES products(id),

  created_at TIMESTAMP DEFAULT NOW()
);
