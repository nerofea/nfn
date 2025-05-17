CREATE TABLE stream_branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES streams(id),
  streamers_id UUID NOT NULL REFERENCES streamers(id),
  logo_url TEXT,
  event_title TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  accent_color TEXT,
  bg_img TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
