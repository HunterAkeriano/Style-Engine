-- Create forum_mutes table for tracking user mutes in forum topics
CREATE TABLE IF NOT EXISTS forum_mutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  muted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(topic_id, user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_forum_mutes_topic_user ON forum_mutes(topic_id, user_id);
CREATE INDEX IF NOT EXISTS idx_forum_mutes_expires_at ON forum_mutes(expires_at);
