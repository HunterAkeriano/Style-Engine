-- Quiz system tables migration
-- Adds support for CSS/SCSS/Stylus quiz functionality

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  code_snippet TEXT,
  answers JSONB NOT NULL,
  correct_answer_index INTEGER NOT NULL,
  explanation TEXT,
  category TEXT NOT NULL DEFAULT 'css',
  difficulty TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT quiz_questions_category_check CHECK (category IN ('css', 'scss', 'stylus')),
  CONSTRAINT quiz_questions_difficulty_check CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

-- Quiz settings table (singleton - only one row)
CREATE TABLE IF NOT EXISTS quiz_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questions_per_test INTEGER NOT NULL DEFAULT 20,
  time_per_question INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT quiz_settings_questions_per_test_check CHECK (questions_per_test >= 5 AND questions_per_test <= 100),
  CONSTRAINT quiz_settings_time_per_question_check CHECK (time_per_question >= 10 AND time_per_question <= 300)
);

-- Insert default settings if not exists
INSERT INTO quiz_settings (questions_per_test, time_per_question)
SELECT 20, 60
WHERE NOT EXISTS (SELECT 1 FROM quiz_settings);

-- Quiz results table
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

-- Quiz attempts tracking table (for rate limiting)
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

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_score ON quiz_results(score DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON quiz_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_results_category ON quiz_results(category);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category ON quiz_questions(category);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_difficulty ON quiz_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id_date ON quiz_attempts(user_id, attempt_date);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_ip_date ON quiz_attempts(ip_address, attempt_date);

-- Unique constraints for attempts (one record per user per day, or one per IP per day)
CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_attempts_user_unique ON quiz_attempts(user_id, attempt_date) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_attempts_ip_unique ON quiz_attempts(ip_address, attempt_date) WHERE ip_address IS NOT NULL AND user_id IS NULL;
