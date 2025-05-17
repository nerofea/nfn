CREATE TABLE advertisor_managers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT,
  verified BOOLEAN DEFAULT FALSE
);