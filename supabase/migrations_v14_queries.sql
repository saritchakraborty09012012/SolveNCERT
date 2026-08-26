-- ═══════════════════════════════════════════════════════════════════════════
-- V14 — QUERIES (red query button in header)
-- Guests, free and premium users can all submit queries from the header icon.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.queries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,  -- null for guests
  name        text,
  email       text,
  page_path   text,
  message     text NOT NULL,
  status      text NOT NULL DEFAULT 'open',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

-- Anyone (anon / free / premium) may submit a query. No SELECT/UPDATE/DELETE
-- policies at all — only the service role (admin) can read queries back.
DROP POLICY IF EXISTS "Anyone can submit a query" ON public.queries;
CREATE POLICY "Anyone can submit a query" ON public.queries
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS queries_created_at_idx ON public.queries (created_at DESC);
