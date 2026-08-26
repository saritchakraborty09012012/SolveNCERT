-- ═══════════════════════════════════════════════════════════════════════════
-- SolveNCERT v9 — NEW SQL FOR THIS SESSION
-- Paste this whole file into Supabase SQL Editor and run top to bottom.
-- Sections are ordered so later ones never depend on something below them.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. BOOKS STORAGE BUCKET (fixes Cloudflare Pages 25 MiB/file limit) ───────
-- The 3 NCERT book PDFs (30MB science, 39MB english, 20MB maths) must NOT
-- live in /public/books/ anymore — Cloudflare Pages free tier rejects any
-- static file over 25 MiB. They now live in Supabase Storage instead.
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('books', 'books', true, 52428800) -- 50 MiB safety ceiling per file
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public book read" ON storage.objects
  FOR SELECT USING (bucket_id = 'books');

-- Only you (service role) should be able to upload/replace books — do that
-- via the Supabase Dashboard UI (Storage → books → Upload), not from the app.


-- ── 2. BOOKMARKS (was requested as "migrate from localStorage" — there was no
--    existing bookmark feature in the v8 codebase to migrate, so this builds
--    it fresh directly on Supabase) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject        text NOT NULL,              -- 'maths' | 'science' | 'english' | 'sanskrit'
  chapter_code   text NOT NULL,              -- e.g. '0906ch02'
  chapter_slug   text NOT NULL,
  chapter_title  text NOT NULL,              -- denormalized so the bookmarks page needs no joins
  question_id    text NOT NULL,              -- exercise-scoped id, e.g. 'ex3.1-q2'
  question_number text NOT NULL,             -- e.g. '2', for display
  question_text  text NOT NULL,              -- short snippet for display on the bookmarks page
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, subject, chapter_code, question_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own bookmarks" ON public.bookmarks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS bookmarks_user_idx ON public.bookmarks(user_id, created_at DESC);


-- ── 3. STAR-RATING FEEDBACK ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.feedback (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  star_rating    integer CHECK (star_rating BETWEEN 1 AND 5),
  keywords       jsonb,
  experience_text text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Insert-only — users submit feedback but never read it back (avoids anyone
-- browsing others' feedback; admin review happens via service role / dashboard).
CREATE POLICY "Users insert own feedback" ON public.feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Visit counter for the "every 5th visit" re-prompt. One column on profiles
-- is enough — no separate table needed.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS visits_since_feedback integer NOT NULL DEFAULT 0;

-- Called once per browser session (guarded client-side via sessionStorage,
-- since a real "visit" should count once per session, not once per page nav).
-- Returns true when this visit should trigger the feedback re-prompt.
CREATE OR REPLACE FUNCTION public.bump_visit_and_check_feedback(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  UPDATE public.profiles
  SET visits_since_feedback = visits_since_feedback + 1
  WHERE id = p_user_id
  RETURNING visits_since_feedback INTO v_count;

  IF v_count IS NULL THEN
    RETURN false;
  END IF;

  IF v_count >= 5 THEN
    UPDATE public.profiles SET visits_since_feedback = 0 WHERE id = p_user_id;
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

GRANT EXECUTE ON FUNCTION public.bump_visit_and_check_feedback(uuid) TO authenticated;


-- ── 4. THUMBS UP / DOUBLE-UP / DOWN (anonymous, works for guest+free+premium) ─
CREATE TABLE IF NOT EXISTS public.answer_ratings (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject                 text NOT NULL,
  chapter_number          integer NOT NULL,
  exercise_label          text NOT NULL,
  thumbs_up_count         integer NOT NULL DEFAULT 0,
  thumbs_up_double_count  integer NOT NULL DEFAULT 0,
  thumbs_down_count       integer NOT NULL DEFAULT 0,
  UNIQUE (subject, chapter_number, exercise_label)
);

ALTER TABLE public.answer_ratings ENABLE ROW LEVEL SECURITY;

-- No direct table access at all (not even SELECT) — every read/write goes
-- through the RPC below. This is the main abuse guard: a client can only ever
-- increment one counter by exactly 1 per call, never set arbitrary values or
-- read/manipulate other rows directly.
-- Note: true bot-proofing (e.g. per-IP throttling) would need an edge
-- function or Cloudflare Turnstile — out of scope for the free tier, but
-- flagging it as a future hardening step if abuse ever becomes a problem.
CREATE OR REPLACE FUNCTION public.react_to_answer(
  p_subject text, p_chapter_number integer, p_exercise_label text, p_reaction text
)
RETURNS TABLE (thumbs_up_count integer, thumbs_up_double_count integer, thumbs_down_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_reaction NOT IN ('up', 'double_up', 'down') THEN
    RAISE EXCEPTION 'invalid reaction';
  END IF;

  INSERT INTO public.answer_ratings (subject, chapter_number, exercise_label)
  VALUES (p_subject, p_chapter_number, p_exercise_label)
  ON CONFLICT (subject, chapter_number, exercise_label) DO NOTHING;

  IF p_reaction = 'up' THEN
    UPDATE public.answer_ratings SET thumbs_up_count = thumbs_up_count + 1
    WHERE subject = p_subject AND chapter_number = p_chapter_number AND exercise_label = p_exercise_label;
  ELSIF p_reaction = 'double_up' THEN
    UPDATE public.answer_ratings SET thumbs_up_double_count = thumbs_up_double_count + 1
    WHERE subject = p_subject AND chapter_number = p_chapter_number AND exercise_label = p_exercise_label;
  ELSE
    UPDATE public.answer_ratings SET thumbs_down_count = thumbs_down_count + 1
    WHERE subject = p_subject AND chapter_number = p_chapter_number AND exercise_label = p_exercise_label;
  END IF;

  RETURN QUERY
  SELECT a.thumbs_up_count, a.thumbs_up_double_count, a.thumbs_down_count
  FROM public.answer_ratings a
  WHERE a.subject = p_subject AND a.chapter_number = p_chapter_number AND a.exercise_label = p_exercise_label;
END;
$$;

-- anon covers guests; authenticated covers free/premium — both allowed, no user identity captured
GRANT EXECUTE ON FUNCTION public.react_to_answer(text, integer, text, text) TO anon, authenticated;


-- ── 5. REPORT / FLAG (logged-in users only, not guests) ──────────────────
CREATE TABLE IF NOT EXISTS public.reports (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name         text NOT NULL,
  user_email        text NOT NULL,
  reported_content  text NOT NULL,
  reason            text NOT NULL,
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Insert-only for authenticated users; no read policy at all — only the
-- service role (admin/dashboard access) can read reports back.
CREATE POLICY "Users submit own reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ── 6. HISTORY (auto-logged page visits, logged-in users only) ────────────
CREATE TABLE IF NOT EXISTS public.page_history (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url         text NOT NULL,
  label       text NOT NULL,
  archived    boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, url)   -- revisiting a page bumps it to the top instead of duplicating
);

ALTER TABLE public.page_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own history" ON public.page_history
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS page_history_user_idx ON public.page_history(user_id, created_at DESC);

-- Called by Layout.tsx on every chapter/solution page view (logged-in users only).
-- Skips bumping an entry the user already archived, so a stray revisit doesn't
-- silently un-archive it back into the main History list.
CREATE OR REPLACE FUNCTION public.log_page_visit(p_user_id uuid, p_url text, p_label text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.page_history (user_id, url, label)
  VALUES (p_user_id, p_url, p_label)
  ON CONFLICT (user_id, url) DO UPDATE
    SET created_at = now(), label = excluded.label
    WHERE public.page_history.archived = false;
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_page_visit(uuid, text, text) TO authenticated;

-- Retention policy: free-plan history older than 30 days auto-deletes;
-- premium keeps history indefinitely. Implemented as CHECK-ON-READ (called
-- right before the History page fetches its list) rather than a pg_cron
-- scheduled job — this needs zero extra dashboard setup (pg_cron requires
-- manually enabling the extension in Database → Extensions first). If you'd
-- rather have it run automatically in the background regardless of whether
-- anyone opens the History page, enable pg_cron and schedule this same query;
-- see the note at the end of this file.
CREATE OR REPLACE FUNCTION public.cleanup_expired_history(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan text;
BEGIN
  SELECT plan INTO v_plan FROM public.profiles WHERE id = p_user_id;
  IF v_plan IS DISTINCT FROM 'premium' THEN
    DELETE FROM public.page_history
    WHERE user_id = p_user_id AND archived = false AND created_at < now() - interval '30 days';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cleanup_expired_history(uuid) TO authenticated;


-- ── 7. STUDY ROOM — real-time collaboration ────────────────────────────────
-- study_sessions already exists (host_id, title, invite_link, is_active,
-- max_members, expires_at). Adding a short shareable room code — cleaner for
-- a URL/invite than the full invite_link field, which can stay as a
-- convenience full-URL mirror of it.
ALTER TABLE public.study_sessions ADD COLUMN IF NOT EXISTS code text;
CREATE UNIQUE INDEX IF NOT EXISTS study_sessions_code_idx ON public.study_sessions(code) WHERE code IS NOT NULL;

-- No extra tables needed for the whiteboard/chat/presence themselves — those
-- are ephemeral and go over a Supabase Realtime channel (Broadcast for
-- drawing strokes + chat messages, Presence for the participant list). Using
-- Broadcast/Presence instead of persisting every stroke to a table keeps this
-- fast and free-tier-friendly (no per-stroke row writes).
--
-- MANUAL DASHBOARD STEP REQUIRED: Realtime must be enabled for this to work.
-- Go to Database → Replication (or Project Settings → Realtime) and make sure
-- Realtime is ON for your project (it's on by default for new projects, but
-- double-check). No table needs to be added to a publication for this,
-- since Broadcast/Presence don't rely on Postgres change data capture —
-- they're plain WebSocket channels through the Realtime server.
