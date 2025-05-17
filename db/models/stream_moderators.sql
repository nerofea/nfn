CREATE TABLE stream_moderators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),            -- User who is a moderator
  stream_id UUID REFERENCES streams(id),        -- Link to the stream they are moderating
  role TEXT NOT NULL,                            -- Role of the moderator (e.g., "moderator", "admin")
  created_at TIMESTAMP DEFAULT NOW()            -- When the moderator was assigned
);
