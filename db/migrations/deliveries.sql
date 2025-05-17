CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
  courier_id UUID REFERENCES couriers(id),
  tracking_number TEXT UNIQUE NOT NULL,
  delivery_address TEXT,
  delivery_status TEXT DEFAULT 'pending',
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  notes TEXT
);
