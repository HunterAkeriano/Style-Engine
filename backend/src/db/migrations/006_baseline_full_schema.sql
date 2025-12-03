-- Baseline migration: consolidated schema and indexes
-- Safe to run on existing databases (uses IF NOT EXISTS / WHERE conditions)

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Schema migrations table
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  is_payment BOOLEAN NOT NULL DEFAULT FALSE,
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT users_subscription_tier_check CHECK (subscription_tier IN ('free', 'pro', 'premium'))
);

-- Refresh tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked BOOLEAN NOT NULL DEFAULT FALSE
);

-- Password resets
CREATE TABLE IF NOT EXISTS password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved items (with payload hashes)
CREATE TABLE IF NOT EXISTS saved_gradients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  payload_hash TEXT,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'private',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_shadows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  payload_hash TEXT,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'private',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_animations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  payload_hash TEXT,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'private',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_clip_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  payload_hash TEXT,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'private',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_favicons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  payload_hash TEXT,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'private',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz tables with translations
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  question_text_uk TEXT,
  code_snippet TEXT,
  answers JSONB NOT NULL,
  answers_uk JSONB,
  correct_answer_index INTEGER NOT NULL,
  explanation TEXT,
  explanation_uk TEXT,
  category TEXT NOT NULL DEFAULT 'css',
  difficulty TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT quiz_questions_category_check CHECK (category IN ('css', 'scss', 'stylus')),
  CONSTRAINT quiz_questions_difficulty_check CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

CREATE TABLE IF NOT EXISTS quiz_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questions_per_test INTEGER NOT NULL DEFAULT 20,
  time_per_question INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT quiz_settings_questions_per_test_check CHECK (questions_per_test >= 5 AND questions_per_test <= 100),
  CONSTRAINT quiz_settings_time_per_question_check CHECK (time_per_question >= 10 AND time_per_question <= 300)
);

INSERT INTO quiz_settings (questions_per_test, time_per_question)
SELECT 20, 60
WHERE NOT EXISTS (SELECT 1 FROM quiz_settings);

CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT,
  category TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT quiz_results_category_check CHECK (category IN ('css', 'scss', 'stylus', 'mix')),
  CONSTRAINT quiz_results_score_check CHECK (score >= 0 AND score <= total_questions),
  CONSTRAINT quiz_results_user_or_username_check CHECK (user_id IS NOT NULL OR username IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ip_address TEXT,
  attempt_date DATE NOT NULL DEFAULT CURRENT_DATE,
  attempts_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT quiz_attempts_user_or_ip_check CHECK (user_id IS NOT NULL OR ip_address IS NOT NULL)
);

-- Hash backfill (safe no-op if already set)
UPDATE saved_gradients SET payload_hash = md5(payload::text) WHERE payload_hash IS NULL;
UPDATE saved_shadows SET payload_hash = md5(payload::text) WHERE payload_hash IS NULL;
UPDATE saved_animations SET payload_hash = md5(payload::text) WHERE payload_hash IS NULL;
UPDATE saved_clip_paths SET payload_hash = md5(payload::text) WHERE payload_hash IS NULL;
UPDATE saved_favicons SET payload_hash = md5(payload::text) WHERE payload_hash IS NULL;

-- Indexes and constraints
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_score ON quiz_results(score DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON quiz_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_results_category ON quiz_results(category);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category ON quiz_questions(category);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_difficulty ON quiz_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id_date ON quiz_attempts(user_id, attempt_date);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_ip_date ON quiz_attempts(ip_address, attempt_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_attempts_user_unique ON quiz_attempts(user_id, attempt_date) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_attempts_ip_unique ON quiz_attempts(ip_address, attempt_date) WHERE ip_address IS NOT NULL AND user_id IS NULL;

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

CREATE INDEX IF NOT EXISTS idx_saved_gradients_public_order ON saved_gradients (status, is_featured, approved_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_shadows_public_order ON saved_shadows (status, is_featured, approved_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_animations_public_order ON saved_animations (status, is_featured, approved_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_clip_paths_public_order ON saved_clip_paths (status, is_featured, approved_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_favicons_public_order ON saved_favicons (status, is_featured, approved_at DESC);

CREATE INDEX IF NOT EXISTS idx_saved_gradients_user_created ON saved_gradients (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_shadows_user_created ON saved_shadows (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_animations_user_created ON saved_animations (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_clip_paths_user_created ON saved_clip_paths (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_favicons_user_created ON saved_favicons (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_lookup ON refresh_tokens (token_hash, revoked, expires_at);
CREATE INDEX IF NOT EXISTS idx_password_resets_lookup ON password_resets (token_hash, used, expires_at);
CREATE INDEX IF NOT EXISTS idx_password_resets_user ON password_resets (user_id);

CREATE INDEX IF NOT EXISTS idx_quiz_results_leaderboard ON quiz_results (category, score DESC, time_taken ASC, created_at DESC);
