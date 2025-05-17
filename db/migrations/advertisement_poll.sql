CREATE TABLE advertisement_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES polls(id),
  advertisement_id UUID, -- Link to a specific advertisement (if you have an advertisements table)
  advertiser_id UUID REFERENCES advertisers(id) -- Link to the advertiser who created the advertisement
);
