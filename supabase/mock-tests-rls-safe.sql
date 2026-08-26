-- ============================================================
-- MOCK TESTS — Safe RLS Policy Migration
-- Run this ONLY if the main migration failed on the policies step
-- This script checks existence before creating each policy
-- ============================================================

-- Enable RLS (safe to re-run, no-op if already enabled)
ALTER TABLE mock_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE wrong_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_learning_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_attempts ENABLE ROW LEVEL SECURITY;

-- mock_test_results: only create if policy doesn't exist
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
