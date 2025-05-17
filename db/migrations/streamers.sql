CREATE TABLE streamers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  twitch_handle TEXT,
  youtube_handle TEXT
);