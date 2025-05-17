CREATE TABLE viewers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  loyalty_points INTEGER DEFAULT 0
);