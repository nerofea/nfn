CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  currency TEXT DEFAULT 'EUR',
  created_by UUID REFERENCES ecommerce_managers(id), 
  fulfillment_center_id UUID REFERENCES fulfillment_centers(id),  -- Link to the fulfillment center
  dropshipping_api_hash TEXT  -- Hash or identifier for dropshipping API (if applicable)
);