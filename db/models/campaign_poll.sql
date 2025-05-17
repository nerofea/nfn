CREATE TABLE campaign_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES polls(id),
  campaign_id UUID -- if you have a campaigns table
);
