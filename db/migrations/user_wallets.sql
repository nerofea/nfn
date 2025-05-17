CREATE TABLE user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  public_key TEXT NOT NULL,
  encrypted_secret_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
