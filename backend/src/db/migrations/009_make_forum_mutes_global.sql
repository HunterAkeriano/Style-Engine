-- Make forum mutes global (not per-topic)
-- Drop the existing unique constraint on (topic_id, user_id)
ALTER TABLE forum_mutes DROP CONSTRAINT IF EXISTS forum_mutes_topic_id_user_id_key;

-- Drop the index on topic_id
DROP INDEX IF EXISTS idx_forum_mutes_topic_id;

-- Drop the foreign key constraint on topic_id
ALTER TABLE forum_mutes DROP CONSTRAINT IF EXISTS forum_mutes_topic_id_fkey;

-- Drop the topic_id column
ALTER TABLE forum_mutes DROP COLUMN IF EXISTS topic_id;

-- Add unique constraint on user_id (one active mute per user globally)
ALTER TABLE forum_mutes ADD CONSTRAINT forum_mutes_user_id_key UNIQUE (user_id);

-- Create index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_forum_mutes_user_id ON forum_mutes(user_id);
