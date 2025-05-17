CREATE TABLE streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,                               -- Stream title
  description TEXT,                                  -- Stream description
  start_time TIMESTAMP,                              -- Start time of the stream
  end_time TIMESTAMP,                                -- End time of the stream
  created_at TIMESTAMP DEFAULT NOW(),               -- When the stream was created
  streamers_id UUID REFERENCES streamers(id),              -- Streamer (the one doing the stream)
  influencer_id UUID REFERENCES influencers(id),          -- Influencer involved (if applicable)
  stream_moderator_id UUID REFERENCES stream_moderators(id),  -- Stream moderator
  stream_manager_id UUID REFERENCES stream_manager(id),  -- Stream moderator
  poll_id UUID REFERENCES polls(id),                    -- Poll for the stream (if applicable)
  stream_owner_id UUID REFERENCES users(id)             -- The owner of the stream (linked to users table)
);
