-- Add payload_hash columns for saved items and index for duplicate detection
ALTER TABLE saved_gradients ADD COLUMN IF NOT EXISTS payload_hash TEXT;
ALTER TABLE saved_shadows   ADD COLUMN IF NOT EXISTS payload_hash TEXT;
ALTER TABLE saved_animations ADD COLUMN IF NOT EXISTS payload_hash TEXT;
ALTER TABLE saved_clip_paths ADD COLUMN IF NOT EXISTS payload_hash TEXT;
ALTER TABLE saved_favicons ADD COLUMN IF NOT EXISTS payload_hash TEXT;

-- Seed hashes for existing rows to avoid nulls (md5 of JSON payload string)
UPDATE saved_gradients SET payload_hash = md5(payload::text) WHERE payload_hash IS NULL;
UPDATE saved_shadows SET payload_hash = md5(payload::text) WHERE payload_hash IS NULL;
UPDATE saved_animations SET payload_hash = md5(payload::text) WHERE payload_hash IS NULL;
UPDATE saved_clip_paths SET payload_hash = md5(payload::text) WHERE payload_hash IS NULL;
UPDATE saved_favicons SET payload_hash = md5(payload::text) WHERE payload_hash IS NULL;

-- Fast duplicate lookup per user and public duplicate check
CREATE UNIQUE INDEX IF NOT EXISTS idx_saved_gradients_user_payload_hash ON saved_gradients (user_id, payload_hash) WHERE payload_hash IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_saved_shadows_user_payload_hash ON saved_shadows (user_id, payload_hash) WHERE payload_hash IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_saved_animations_user_payload_hash ON saved_animations (user_id, payload_hash) WHERE payload_hash IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_saved_clip_paths_user_payload_hash ON saved_clip_paths (user_id, payload_hash) WHERE payload_hash IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_saved_favicons_user_payload_hash ON saved_favicons (user_id, payload_hash) WHERE payload_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_saved_gradients_status_hash ON saved_gradients (status, payload_hash);
CREATE INDEX IF NOT EXISTS idx_saved_shadows_status_hash ON saved_shadows (status, payload_hash);
CREATE INDEX IF NOT EXISTS idx_saved_animations_status_hash ON saved_animations (status, payload_hash);
CREATE INDEX IF NOT EXISTS idx_saved_clip_paths_status_hash ON saved_clip_paths (status, payload_hash);
CREATE INDEX IF NOT EXISTS idx_saved_favicons_status_hash ON saved_favicons (status, payload_hash);

-- Sorting public lists
CREATE INDEX IF NOT EXISTS idx_saved_gradients_public_order ON saved_gradients (status, is_featured, approved_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_shadows_public_order ON saved_shadows (status, is_featured, approved_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_animations_public_order ON saved_animations (status, is_featured, approved_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_clip_paths_public_order ON saved_clip_paths (status, is_featured, approved_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_favicons_public_order ON saved_favicons (status, is_featured, approved_at DESC);

-- Token / reset lookup speedups
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_lookup ON refresh_tokens (token_hash, revoked, expires_at);
CREATE INDEX IF NOT EXISTS idx_password_resets_lookup ON password_resets (token_hash, used, expires_at);
CREATE INDEX IF NOT EXISTS idx_password_resets_user ON password_resets (user_id);

-- Quiz performance
CREATE INDEX IF NOT EXISTS idx_quiz_results_leaderboard ON quiz_results (category, score DESC, time_taken ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_date ON quiz_attempts (user_id, attempt_date);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_ip_date ON quiz_attempts (ip_address, attempt_date) WHERE user_id IS NULL;
