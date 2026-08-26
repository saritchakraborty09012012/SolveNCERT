-- ── FEEDBACK SYSTEM UPGRADE ─────────────────────────────────────────────────
-- Adds source column to identify which AI tool the feedback is for.
-- user_id stays NOT NULL — only logged-in users can submit feedback.

-- 1. Add source column to tag feedback origin
--    Examples: 'general', 'ai-notes', 'ai-flashcards', 'ai-doubt-solver',
--              'ai-search', 'ai-learn', 'ai-practice', 'ai-mock-test'
ALTER TABLE public.feedback
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'general';

-- 2. Index for admin dashboard queries by source
CREATE INDEX IF NOT EXISTS idx_feedback_source ON public.feedback (source);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON public.feedback (created_at DESC);
