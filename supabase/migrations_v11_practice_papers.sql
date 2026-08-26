-- V11: Practice Papers module (ALL DATABASE — NO LOCALSTORAGE)
-- Stores generated papers, attempts, analytics, smart revision, and learning profile

-- ─── practice_papers ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.practice_papers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_level     text NOT NULL DEFAULT '9',
  subject         text NOT NULL,
  book            text NOT NULL,
  chapter         text NOT NULL,
  chapter_code    text,
  difficulty      text NOT NULL CHECK (difficulty IN ('easy', 'moderate', 'hard')),
  question_count  integer NOT NULL,
  questions       jsonb NOT NULL,
  time_taken_sec  integer,
  is_completed    boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  completed_at    timestamptz
);

CREATE INDEX IF NOT EXISTS idx_practice_papers_user ON public.practice_papers(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_papers_subject ON public.practice_papers(user_id, subject);
CREATE INDEX IF NOT EXISTS idx_practice_papers_chapter ON public.practice_papers(user_id, chapter_code);

-- ─── practice_attempts ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.practice_attempts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id        uuid NOT NULL REFERENCES public.practice_papers(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_index  integer NOT NULL,
  question_type   text NOT NULL,
  question_text   text NOT NULL,
  selected_answer text,
  correct_answer  text NOT NULL,
  is_correct      boolean NOT NULL DEFAULT false,
  is_skipped      boolean NOT NULL DEFAULT false,
  is_bookmarked   boolean NOT NULL DEFAULT false,
  difficulty      text NOT NULL,
  topic           text,
  explanation     text,
  related_concept text,
  revision_tip    text,
  time_spent_sec  integer,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_practice_attempts_paper ON public.practice_attempts(paper_id);
CREATE INDEX IF NOT EXISTS idx_practice_attempts_user ON public.practice_attempts(user_id);

-- ─── practice_analytics ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.practice_analytics (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id              uuid NOT NULL REFERENCES public.practice_papers(id) ON DELETE CASCADE,
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_questions       integer NOT NULL,
  correct_count         integer NOT NULL DEFAULT 0,
  incorrect_count       integer NOT NULL DEFAULT 0,
  skipped_count         integer NOT NULL DEFAULT 0,
  score                 numeric(5,2) NOT NULL DEFAULT 0,
  percentage            numeric(5,2) NOT NULL DEFAULT 0,
  accuracy              numeric(5,2) NOT NULL DEFAULT 0,
  time_taken_sec        integer NOT NULL DEFAULT 0,
  overall_rating        text,
  topic_wise            jsonb,
  type_wise             jsonb,
  difficulty_wise       jsonb,
  strengths             jsonb,
  weaknesses            jsonb,
  improvement_areas     jsonb,
  recommended_revision  jsonb,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_practice_analytics_user ON public.practice_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_analytics_paper ON public.practice_analytics(paper_id);

-- ─── practice_wrong_questions ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.practice_wrong_questions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paper_id        uuid REFERENCES public.practice_papers(id) ON DELETE SET NULL,
  question_index  integer NOT NULL,
  question_type   text NOT NULL,
  question_text   text NOT NULL,
  selected_answer text,
  correct_answer  text NOT NULL,
  subject         text NOT NULL,
  chapter         text NOT NULL,
  chapter_code    text,
  topic           text,
  difficulty      text NOT NULL,
  times_seen      integer NOT NULL DEFAULT 1,
  times_correct   integer NOT NULL DEFAULT 0,
  mastered        boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  last_seen_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_practice_wrong_user ON public.practice_wrong_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_wrong_unmastered ON public.practice_wrong_questions(user_id, mastered) WHERE mastered = false;

-- ─── practice_learning_profile ────────────────────────────────────────────────
-- Replaces localStorage shared knowledge — all per-user data in DB
CREATE TABLE IF NOT EXISTS public.practice_learning_profile (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  weak_areas      jsonb NOT NULL DEFAULT '[]',
  strong_areas    jsonb NOT NULL DEFAULT '[]',
  frequent_mistakes jsonb NOT NULL DEFAULT '[]',
  practice_performance jsonb NOT NULL DEFAULT '[]',
  preferred_difficulty text NOT NULL DEFAULT 'moderate',
  recommended_revision jsonb NOT NULL DEFAULT '[]',
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_practice_profile_user ON public.practice_learning_profile(user_id);

-- ─── RPC: upsert learning profile weak areas ──────────────────────────────────
CREATE OR REPLACE FUNCTION public.upsert_practice_weak_areas(
  p_user_id uuid,
  p_topic text,
  p_subject text,
  p_chapter text
)
RETURNS void AS $$
DECLARE
  existing jsonb;
  found boolean := false;
  new_arr jsonb := '[]';
  item jsonb;
BEGIN
  SELECT weak_areas INTO existing
  FROM public.practice_learning_profile
  WHERE user_id = p_user_id;

  IF existing IS NULL THEN
    INSERT INTO public.practice_learning_profile (user_id, weak_areas)
    VALUES (p_user_id, jsonb_build_array(
      jsonb_build_object('topic', p_topic, 'subject', p_subject, 'chapter', p_chapter, 'severity', 1)
    ));
    RETURN;
  END IF;

  FOR i IN 0..jsonb_array_length(existing) - 1 LOOP
    item := existing->i;
    IF item->>'topic' = p_topic AND item->>'chapter' = p_chapter THEN
      new_arr := new_arr || jsonb_build_object(
        'topic', p_topic,
        'subject', p_subject,
        'chapter', p_chapter,
        'severity', LEAST(5, (item->>'severity')::int + 1)
      );
      found := true;
    ELSE
      new_arr := new_arr || item;
    END IF;
  END LOOP;

  IF NOT found THEN
    new_arr := new_arr || jsonb_build_object(
      'topic', p_topic, 'subject', p_subject, 'chapter', p_chapter, 'severity', 1
    );
  END IF;

  UPDATE public.practice_learning_profile
  SET weak_areas = new_arr, updated_at = now()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── RPC: upsert learning profile strong areas ────────────────────────────────
CREATE OR REPLACE FUNCTION public.upsert_practice_strong_areas(
  p_user_id uuid,
  p_topic text,
  p_subject text
)
RETURNS void AS $$
DECLARE
  existing jsonb;
  found boolean := false;
  new_arr jsonb := '[]';
  item jsonb;
BEGIN
  SELECT strong_areas INTO existing
  FROM public.practice_learning_profile
  WHERE user_id = p_user_id;

  IF existing IS NULL THEN
    INSERT INTO public.practice_learning_profile (user_id, strong_areas)
    VALUES (p_user_id, jsonb_build_array(
      jsonb_build_object('topic', p_topic, 'subject', p_subject, 'accuracy', 80)
    ));
    RETURN;
  END IF;

  FOR i IN 0..jsonb_array_length(existing) - 1 LOOP
    item := existing->i;
    IF item->>'topic' = p_topic AND item->>'subject' = p_subject THEN
      new_arr := new_arr || jsonb_build_object(
        'topic', p_topic,
        'subject', p_subject,
        'accuracy', LEAST(100, (item->>'accuracy')::int + 5)
      );
      found := true;
    ELSE
      new_arr := new_arr || item;
    END IF;
  END LOOP;

  IF NOT found THEN
    new_arr := new_arr || jsonb_build_object('topic', p_topic, 'subject', p_subject, 'accuracy', 80);
  END IF;

  UPDATE public.practice_learning_profile
  SET strong_areas = new_arr, updated_at = now()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── RPC: upsert practice performance ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.upsert_practice_performance(
  p_user_id uuid,
  p_subject text,
  p_score numeric,
  p_total integer
)
RETURNS void AS $$
DECLARE
  existing jsonb;
  found boolean := false;
  new_arr jsonb := '[]';
  item jsonb;
  pct numeric;
  new_total integer;
  new_avg numeric;
BEGIN
  pct := CASE WHEN p_total > 0 THEN (p_score / p_total::numeric) * 100 ELSE 0 END;
  SELECT practice_performance INTO existing
  FROM public.practice_learning_profile
  WHERE user_id = p_user_id;

  IF existing IS NULL THEN
    INSERT INTO public.practice_learning_profile (user_id, practice_performance)
    VALUES (p_user_id, jsonb_build_array(
      jsonb_build_object('subject', p_subject, 'avg_score', pct, 'total_papers', 1, 'last_practiced', now()::text)
    ));
    RETURN;
  END IF;

  FOR i IN 0..jsonb_array_length(existing) - 1 LOOP
    item := existing->i;
    IF item->>'subject' = p_subject THEN
      new_total := (item->>'total_papers')::int + 1;
      new_avg := ((item->>'avg_score')::numeric * (item->>'total_papers')::int + pct) / new_total;
      new_arr := new_arr || jsonb_build_object(
        'subject', p_subject, 'avg_score', new_avg, 'total_papers', new_total, 'last_practiced', now()::text
      );
      found := true;
    ELSE
      new_arr := new_arr || item;
    END IF;
  END LOOP;

  IF NOT found THEN
    new_arr := new_arr || jsonb_build_object('subject', p_subject, 'avg_score', pct, 'total_papers', 1, 'last_practiced', now()::text);
  END IF;

  UPDATE public.practice_learning_profile
  SET practice_performance = new_arr, updated_at = now()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── RPC: mark wrong question mastered ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.mark_wrong_question_mastered(p_question_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.practice_wrong_questions SET mastered = true WHERE id = p_question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── RPC: increment wrong question seen count ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.increment_wrong_question(p_question_id uuid, p_was_correct boolean)
RETURNS void AS $$
BEGIN
  UPDATE public.practice_wrong_questions
  SET times_seen = times_seen + 1,
      times_correct = times_correct + CASE WHEN p_was_correct THEN 1 ELSE 0 END,
      mastered = CASE WHEN times_correct + CASE WHEN p_was_correct THEN 1 ELSE 0 END >= 3 THEN true ELSE mastered END,
      last_seen_at = now()
  WHERE id = p_question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── RLS policies ─────────────────────────────────────────────────────────────
ALTER TABLE public.practice_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_wrong_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_learning_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own practice papers"
  ON public.practice_papers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own practice attempts"
  ON public.practice_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own practice analytics"
  ON public.practice_analytics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wrong questions"
  ON public.practice_wrong_questions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own learning profile"
  ON public.practice_learning_profile FOR ALL USING (auth.uid() = user_id);
