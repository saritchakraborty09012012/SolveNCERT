-- Mock Tests Module - Supabase Migration
-- Run this to create all mock test tables and functions

-- ============================================================
-- 1. MOCK TESTS - stores generated test configurations
-- ============================================================
CREATE TABLE IF NOT EXISTS mock_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  config JSONB NOT NULL,
  questions JSONB NOT NULL,
  total_marks INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  time_limit INTEGER NOT NULL DEFAULT 120,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. MOCK TEST ATTEMPTS - tracks each attempt
-- ============================================================
CREATE TABLE IF NOT EXISTS mock_test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  test_id UUID REFERENCES mock_tests(id) ON DELETE CASCADE NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  time_spent INTEGER NOT NULL DEFAULT 0,
  auto_submitted BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'submitted', 'expired'))
);

-- ============================================================
-- 3. MOCK TEST RESULTS - stores graded results
-- ============================================================
CREATE TABLE IF NOT EXISTS mock_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  test_id TEXT NOT NULL,
  attempt_id TEXT DEFAULT '',
  config JSONB DEFAULT '{}'::jsonb,
  score NUMERIC NOT NULL DEFAULT 0,
  total_marks INTEGER NOT NULL DEFAULT 0,
  percentage NUMERIC NOT NULL DEFAULT 0,
  accuracy NUMERIC NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  incorrect_answers INTEGER NOT NULL DEFAULT 0,
  skipped_questions INTEGER NOT NULL DEFAULT 0,
  time_taken INTEGER NOT NULL DEFAULT 0,
  time_limit INTEGER NOT NULL DEFAULT 120,
  question_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  topic_wise_accuracy JSONB NOT NULL DEFAULT '[]'::jsonb,
  type_wise_accuracy JSONB NOT NULL DEFAULT '[]'::jsonb,
  difficulty_wise_performance JSONB NOT NULL DEFAULT '[]'::jsonb,
  time_analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
  performance_rating TEXT DEFAULT '',
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  weaknesses JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. WRONG QUESTIONS - smart revision collection
-- ============================================================
CREATE TABLE IF NOT EXISTS wrong_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL,
  chapter TEXT NOT NULL,
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  selected_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  concept TEXT NOT NULL,
  times_wrong INTEGER NOT NULL DEFAULT 1,
  times_correct INTEGER NOT NULL DEFAULT 0,
  mastered BOOLEAN NOT NULL DEFAULT false,
  last_attempted TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. SHARED LEARNING DATA - cross-module knowledge
-- ============================================================
CREATE TABLE IF NOT EXISTS shared_learning_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_mock_tests_user ON mock_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_test_attempts_user ON mock_test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_test_attempts_test ON mock_test_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_mock_test_results_user ON mock_test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_test_results_test ON mock_test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_wrong_questions_user ON wrong_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_wrong_questions_mastered ON wrong_questions(user_id, mastered);
CREATE INDEX IF NOT EXISTS idx_wrong_questions_chapter ON wrong_questions(user_id, chapter);
CREATE INDEX IF NOT EXISTS idx_shared_learning_user ON shared_learning_data(user_id);

-- ============================================================
-- RPC: upsert_mock_test_result
-- Insert or update mock test result
-- ============================================================
CREATE OR REPLACE FUNCTION upsert_mock_test_result(
  p_user_id UUID,
  p_test_id UUID,
  p_attempt_id UUID,
  p_score NUMERIC,
  p_total_marks INTEGER,
  p_percentage NUMERIC,
  p_accuracy NUMERIC,
  p_correct_answers INTEGER,
  p_incorrect_answers INTEGER,
  p_skipped_questions INTEGER,
  p_time_taken INTEGER,
  p_time_limit INTEGER,
  p_question_results JSONB,
  p_topic_wise_accuracy JSONB,
  p_type_wise_accuracy JSONB,
  p_difficulty_wise_performance JSONB,
  p_time_analysis JSONB,
  p_performance_rating TEXT,
  p_strengths JSONB,
  p_weaknesses JSONB,
  p_recommendations JSONB
)
RETURNS UUID AS $$
DECLARE
  result_id UUID;
BEGIN
  INSERT INTO mock_test_results (
    user_id, test_id, attempt_id, score, total_marks, percentage, accuracy,
    correct_answers, incorrect_answers, skipped_questions, time_taken, time_limit,
    question_results, topic_wise_accuracy, type_wise_accuracy,
    difficulty_wise_performance, time_analysis, performance_rating,
    strengths, weaknesses, recommendations
  ) VALUES (
    p_user_id, p_test_id, p_attempt_id, p_score, p_total_marks, p_percentage, p_accuracy,
    p_correct_answers, p_incorrect_answers, p_skipped_questions, p_time_taken, p_time_limit,
    p_question_results, p_topic_wise_accuracy, p_type_wise_accuracy,
    p_difficulty_wise_performance, p_time_analysis, p_performance_rating,
    p_strengths, p_weaknesses, p_recommendations
  )
  RETURNING id INTO result_id;

  -- Update shared learning data
  INSERT INTO shared_learning_data (user_id, data, updated_at)
  VALUES (p_user_id, jsonb_build_object(
    'last_mock_test_score', p_percentage,
    'last_mock_test_accuracy', p_accuracy,
    'last_mock_test_date', now()
  ), now())
  ON CONFLICT (user_id) DO UPDATE SET
    data = shared_learning_data.data || jsonb_build_object(
      'last_mock_test_score', p_percentage,
      'last_mock_test_accuracy', p_accuracy,
      'last_mock_test_date', now()
    ),
    updated_at = now();

  RETURN result_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- RPC: upsert_wrong_question
-- Insert or update wrong question for smart revision
-- ============================================================
CREATE OR REPLACE FUNCTION upsert_wrong_question(
  p_user_id UUID,
  p_question_text TEXT,
  p_question_type TEXT,
  p_chapter TEXT,
  p_subject TEXT,
  p_difficulty TEXT,
  p_correct_answer TEXT,
  p_selected_answer TEXT,
  p_explanation TEXT,
  p_concept TEXT
)
RETURNS UUID AS $$
DECLARE
  wq_id UUID;
  existing RECORD;
BEGIN
  SELECT id, times_wrong, times_correct, mastered INTO existing
  FROM wrong_questions
  WHERE user_id = p_user_id AND question_text = p_question_text;

  IF FOUND THEN
    IF existing.mastered THEN
      RETURN existing.id;
    END IF;
    UPDATE wrong_questions SET
      times_wrong = times_wrong + 1,
      selected_answer = p_selected_answer,
      last_attempted = now()
    WHERE id = existing.id
    RETURNING id INTO wq_id;
    RETURN wq_id;
  ELSE
    INSERT INTO wrong_questions (
      user_id, question_text, question_type, chapter, subject,
      difficulty, correct_answer, selected_answer, explanation, concept
    ) VALUES (
      p_user_id, p_question_text, p_question_type, p_chapter, p_subject,
      p_difficulty, p_correct_answer, p_selected_answer, p_explanation, p_concept
    )
    RETURNING id INTO wq_id;
    RETURN wq_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- RPC: mark_question_mastered
-- Mark a wrong question as mastered after consistent correct answers
-- ============================================================
CREATE OR REPLACE FUNCTION mark_question_mastered(p_user_id UUID, p_question_text TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE wrong_questions SET
    times_correct = times_correct + 1,
    mastered = (times_correct + 1 >= 3),
    last_attempted = now()
  WHERE user_id = p_user_id AND question_text = p_question_text;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- RPC: get_wrong_questions_for_revision
-- Get unmastered wrong questions for a subject
-- ============================================================
CREATE OR REPLACE FUNCTION get_wrong_questions_for_revision(
  p_user_id UUID,
  p_subject TEXT,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  question_text TEXT,
  question_type TEXT,
  chapter TEXT,
  subject TEXT,
  difficulty TEXT,
  correct_answer TEXT,
  explanation TEXT,
  concept TEXT,
  times_wrong INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT wq.id, wq.question_text, wq.question_type, wq.chapter, wq.subject,
         wq.difficulty, wq.correct_answer, wq.explanation, wq.concept, wq.times_wrong
  FROM wrong_questions wq
  WHERE wq.user_id = p_user_id
    AND wq.subject = p_subject
    AND wq.mastered = false
  ORDER BY wq.times_wrong DESC, wq.last_attempted ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- RPC: update_shared_learning_data
-- Update shared learning data from any module
-- ============================================================
CREATE OR REPLACE FUNCTION update_shared_learning_data(
  p_user_id UUID,
  p_data JSONB
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO shared_learning_data (user_id, data, updated_at)
  VALUES (p_user_id, p_data, now())
  ON CONFLICT (user_id) DO UPDATE SET
    data = shared_learning_data.data || p_data,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- RPC: get_user_performance_summary
-- Get aggregated performance data for a user
-- ============================================================
CREATE OR REPLACE FUNCTION get_user_performance_summary(p_user_id UUID)
RETURNS TABLE (
  total_tests_taken BIGINT,
  avg_score NUMERIC,
  avg_accuracy NUMERIC,
  total_questions_attempted BIGINT,
  total_correct BIGINT,
  best_score NUMERIC,
  worst_score NUMERIC,
  total_time_spent BIGINT,
  latest_rating TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_tests_taken,
    COALESCE(AVG(percentage), 0)::NUMERIC as avg_score,
    COALESCE(AVG(accuracy), 0)::NUMERIC as avg_accuracy,
    COALESCE(SUM(correct_answers + incorrect_answers + skipped_questions), 0)::BIGINT as total_questions_attempted,
    COALESCE(SUM(correct_answers), 0)::BIGINT as total_correct,
    COALESCE(MAX(percentage), 0)::NUMERIC as best_score,
    COALESCE(MIN(percentage), 0)::NUMERIC as worst_score,
    COALESCE(SUM(time_taken), 0)::BIGINT as total_time_spent,
    (SELECT performance_rating FROM mock_test_results
     WHERE user_id = p_user_id ORDER BY submitted_at DESC LIMIT 1) as latest_rating
  FROM mock_test_results
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- Users can only read/write their own data
-- Uses DO blocks to check existence — safe to re-run
-- ============================================================

ALTER TABLE mock_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE wrong_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_learning_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_attempts ENABLE ROW LEVEL SECURITY;

-- mock_test_results
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own mock test results' AND tablename = 'mock_test_results') THEN
    CREATE POLICY "Users can read own mock test results" ON mock_test_results FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own mock test results' AND tablename = 'mock_test_results') THEN
    CREATE POLICY "Users can insert own mock test results" ON mock_test_results FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own mock test results' AND tablename = 'mock_test_results') THEN
    CREATE POLICY "Users can update own mock test results" ON mock_test_results FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END
$$;

-- wrong_questions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own wrong questions' AND tablename = 'wrong_questions') THEN
    CREATE POLICY "Users can read own wrong questions" ON wrong_questions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own wrong questions' AND tablename = 'wrong_questions') THEN
    CREATE POLICY "Users can insert own wrong questions" ON wrong_questions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own wrong questions' AND tablename = 'wrong_questions') THEN
    CREATE POLICY "Users can update own wrong questions" ON wrong_questions FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own wrong questions' AND tablename = 'wrong_questions') THEN
    CREATE POLICY "Users can delete own wrong questions" ON wrong_questions FOR DELETE USING (auth.uid() = user_id);
  END IF;
END
$$;

-- shared_learning_data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own shared learning data' AND tablename = 'shared_learning_data') THEN
    CREATE POLICY "Users can read own shared learning data" ON shared_learning_data FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own shared learning data' AND tablename = 'shared_learning_data') THEN
    CREATE POLICY "Users can insert own shared learning data" ON shared_learning_data FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own shared learning data' AND tablename = 'shared_learning_data') THEN
    CREATE POLICY "Users can update own shared learning data" ON shared_learning_data FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END
$$;

-- mock_tests
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own mock tests' AND tablename = 'mock_tests') THEN
    CREATE POLICY "Users can read own mock tests" ON mock_tests FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own mock tests' AND tablename = 'mock_tests') THEN
    CREATE POLICY "Users can insert own mock tests" ON mock_tests FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- mock_test_attempts
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own mock test attempts' AND tablename = 'mock_test_attempts') THEN
    CREATE POLICY "Users can read own mock test attempts" ON mock_test_attempts FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own mock test attempts' AND tablename = 'mock_test_attempts') THEN
    CREATE POLICY "Users can insert own mock test attempts" ON mock_test_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own mock test attempts' AND tablename = 'mock_test_attempts') THEN
    CREATE POLICY "Users can update own mock test attempts" ON mock_test_attempts FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END
$$;
