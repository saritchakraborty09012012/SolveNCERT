-- ============================================================
-- SolveNCERT — Quizzes Module Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── Quiz Attempts ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_num INTEGER NOT NULL DEFAULT 9,
  subject TEXT NOT NULL,
  book TEXT NOT NULL,
  book_slug TEXT NOT NULL,
  chapter TEXT,
  chapter_slug TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy','moderate','hard')),
  total_questions INTEGER NOT NULL,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  skipped_count INTEGER DEFAULT 0,
  score NUMERIC(5,2) DEFAULT 0,
  percentage NUMERIC(5,2) DEFAULT 0,
  time_taken_seconds INTEGER DEFAULT 0,
  time_limit_seconds INTEGER DEFAULT 0,
  question_types TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed','abandoned')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Quiz Questions (stored per attempt) ─────────────────────
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  question_type TEXT NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  student_answer TEXT,
  is_correct BOOLEAN,
  is_skipped BOOLEAN DEFAULT false,
  explanation TEXT,
  related_concept TEXT,
  revision_tip TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy','moderate','hard')),
  topic TEXT,
  marks INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Wrong Questions Collection (Smart Revision) ─────────────
CREATE TABLE IF NOT EXISTS public.wrong_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  chapter TEXT,
  chapter_slug TEXT,
  correct_answer TEXT NOT NULL,
  student_answer TEXT,
  explanation TEXT,
  related_concept TEXT,
  times_seen INTEGER DEFAULT 1,
  times_correct INTEGER DEFAULT 0,
  mastered BOOLEAN DEFAULT false,
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Quiz Analytics (aggregated per subject/chapter) ─────────
CREATE TABLE IF NOT EXISTS public.quiz_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  chapter TEXT,
  chapter_slug TEXT,
  total_attempted INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  total_incorrect INTEGER DEFAULT 0,
  total_skipped INTEGER DEFAULT 0,
  avg_percentage NUMERIC(5,2) DEFAULT 0,
  best_percentage NUMERIC(5,2) DEFAULT 0,
  avg_time_per_question NUMERIC(7,2) DEFAULT 0,
  difficulty_breakdown JSONB DEFAULT '{"easy":{"attempted":0,"correct":0},"moderate":{"attempted":0,"correct":0},"hard":{"attempted":0,"correct":0}}',
  question_type_breakdown JSONB DEFAULT '{}',
  weak_topics TEXT[] DEFAULT '{}',
  strong_topics TEXT[] DEFAULT '{}',
  last_attempted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subject, chapter_slug)
);

-- ── Shared Learning Profile ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.learning_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_chapters TEXT[] DEFAULT '{}',
  completed_topics TEXT[] DEFAULT '{}',
  weak_areas TEXT[] DEFAULT '{}',
  strong_areas TEXT[] DEFAULT '{}',
  preferred_difficulty TEXT DEFAULT 'moderate',
  preferred_language TEXT DEFAULT 'en',
  learning_pace NUMERIC(5,2) DEFAULT 0.5,
  total_quizzes_taken INTEGER DEFAULT 0,
  total_questions_attempted INTEGER DEFAULT 0,
  overall_accuracy NUMERIC(5,2) DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_quiz_date DATE,
  xp_earned INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_status ON public.quiz_attempts(status);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_subject ON public.quiz_attempts(subject);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created ON public.quiz_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_attempt ON public.quiz_questions(attempt_id);
CREATE INDEX IF NOT EXISTS idx_wrong_questions_user ON public.wrong_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_wrong_questions_mastered ON public.wrong_questions(mastered);
CREATE INDEX IF NOT EXISTS idx_wrong_questions_subject ON public.wrong_questions(subject);
CREATE INDEX IF NOT EXISTS idx_quiz_analytics_user ON public.quiz_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_analytics_subject ON public.quiz_analytics(user_id, subject);
CREATE INDEX IF NOT EXISTS idx_learning_profile_user ON public.learning_profile(user_id);

-- ── RLS Policies ────────────────────────────────────────────
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wrong_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_profile ENABLE ROW LEVEL SECURITY;

-- quiz_attempts: users can only see/modify their own
CREATE POLICY "Users can view own quiz attempts"
  ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz attempts"
  ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quiz attempts"
  ON public.quiz_attempts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quiz attempts"
  ON public.quiz_attempts FOR DELETE USING (auth.uid() = user_id);

-- quiz_questions: users can only see/modify via their attempts
CREATE POLICY "Users can view own quiz questions"
  ON public.quiz_questions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.quiz_attempts
    WHERE quiz_attempts.id = quiz_questions.attempt_id
    AND quiz_attempts.user_id = auth.uid()
  ));
CREATE POLICY "Users can insert own quiz questions"
  ON public.quiz_questions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.quiz_attempts
    WHERE quiz_attempts.id = quiz_questions.attempt_id
    AND quiz_attempts.user_id = auth.uid()
  ));
CREATE POLICY "Users can update own quiz questions"
  ON public.quiz_questions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.quiz_attempts
    WHERE quiz_attempts.id = quiz_questions.attempt_id
    AND quiz_attempts.user_id = auth.uid()
  ));

-- wrong_questions: users can only see/modify their own
CREATE POLICY "Users can view own wrong questions"
  ON public.wrong_questions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wrong questions"
  ON public.wrong_questions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wrong questions"
  ON public.wrong_questions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own wrong questions"
  ON public.wrong_questions FOR DELETE USING (auth.uid() = user_id);

-- quiz_analytics: users can only see/modify their own
CREATE POLICY "Users can view own quiz analytics"
  ON public.quiz_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own quiz analytics"
  ON public.quiz_analytics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quiz analytics"
  ON public.quiz_analytics FOR UPDATE USING (auth.uid() = user_id);

-- learning_profile: users can only see/modify their own
CREATE POLICY "Users can view own learning profile"
  ON public.learning_profile FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own learning profile"
  ON public.learning_profile FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own learning profile"
  ON public.learning_profile FOR UPDATE USING (auth.uid() = user_id);

-- ── Auto-update updated_at ──────────────────────────────────
CREATE OR REPLACE FUNCTION update_quiz_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_wrong_questions_updated
  BEFORE UPDATE ON public.wrong_questions
  FOR EACH ROW EXECUTE FUNCTION update_quiz_timestamp();

CREATE TRIGGER trigger_quiz_analytics_updated
  BEFORE UPDATE ON public.quiz_analytics
  FOR EACH ROW EXECUTE FUNCTION update_quiz_timestamp();

CREATE TRIGGER trigger_learning_profile_updated
  BEFORE UPDATE ON public.learning_profile
  FOR EACH ROW EXECUTE FUNCTION update_quiz_timestamp();

-- ── Helper: upsert quiz analytics ───────────────────────────
CREATE OR REPLACE FUNCTION upsert_quiz_analytics(
  p_user_id UUID,
  p_subject TEXT,
  p_chapter TEXT,
  p_chapter_slug TEXT,
  p_correct INTEGER,
  p_incorrect INTEGER,
  p_skipped INTEGER,
  p_percentage NUMERIC,
  p_time_seconds INTEGER,
  p_question_count INTEGER,
  p_difficulty TEXT,
  p_question_type TEXT,
  p_weak_topics TEXT[],
  p_strong_topics TEXT[]
)
RETURNS VOID AS $$
DECLARE
  v_avg_time NUMERIC;
BEGIN
  v_avg_time := CASE WHEN p_question_count > 0 THEN p_time_seconds::NUMERIC / p_question_count ELSE 0 END;

  INSERT INTO public.quiz_analytics (
    user_id, subject, chapter, chapter_slug,
    total_attempted, total_correct, total_incorrect, total_skipped,
    avg_percentage, best_percentage, avg_time_per_question,
    difficulty_breakdown, question_type_breakdown,
    weak_topics, strong_topics, last_attempted_at
  ) VALUES (
    p_user_id, p_subject, p_chapter, p_chapter_slug,
    p_question_count, p_correct, p_incorrect, p_skipped,
    p_percentage, p_percentage, v_avg_time,
    jsonb_build_object(p_difficulty, jsonb_build_object('attempted', p_question_count, 'correct', p_correct)),
    jsonb_build_object(p_question_type, jsonb_build_object('attempted', p_question_count, 'correct', p_correct)),
    p_weak_topics, p_strong_topics, NOW()
  )
  ON CONFLICT (user_id, subject, chapter_slug) DO UPDATE SET
    total_attempted = quiz_analytics.total_attempted + p_question_count,
    total_correct = quiz_analytics.total_correct + p_correct,
    total_incorrect = quiz_analytics.total_incorrect + p_incorrect,
    total_skipped = quiz_analytics.total_skipped + p_skipped,
    avg_percentage = (quiz_analytics.avg_percentage * quiz_analytics.total_attempted + p_percentage * p_question_count) / (quiz_analytics.total_attempted + p_question_count),
    best_percentage = GREATEST(quiz_analytics.best_percentage, p_percentage),
    avg_time_per_question = (quiz_analytics.avg_time_per_question * quiz_analytics.total_attempted + v_avg_time * p_question_count) / (quiz_analytics.total_attempted + p_question_count),
    difficulty_breakdown = quiz_analytics.difficulty_breakdown || jsonb_build_object(p_difficulty, jsonb_build_object(
      'attempted', (quiz_analytics.difficulty_breakdown->p_difficulty->>'attempted')::INTEGER + p_question_count,
      'correct', (quiz_analytics.difficulty_breakdown->p_difficulty->>'correct')::INTEGER + p_correct
    )),
    weak_topics = array_cat(quiz_analytics.weak_topics, p_weak_topics),
    strong_topics = array_cat(quiz_analytics.strong_topics, p_strong_topics),
    last_attempted_at = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
