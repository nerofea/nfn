CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  minPrice NUMERIC(10,2),
  currency TEXT DEFAULT 'EUR',
  created_by UUID REFERENCES ecommerce_managers(id),
  fulfillment_center_id UUID REFERENCES fulfillment_centers(id),
  dropshipping_api_hash TEXT,
  dateFrom DATE,
  dateTo DATE, 
  productCategory TEXT,
  claimable_token_type UUID,               -- FK to loyalty_tokens(id) or similar
  claimable_token_min_amount NUMERIC(10,2)  -- Minimum required token amount
);