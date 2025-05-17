CREATE TABLE influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  instagram_handle TEXT,
  tiktok_handle TEXT,
  youtube_handle TEXT
);