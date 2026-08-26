-- ═══════════════════════════════════════════════════════════════════════════
-- SolveNCERT v11 — NOTES & FLASHCARDS
-- Paste this whole file into Supabase SQL Editor and run top to bottom.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. GENERATED NOTES ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.generated_notes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_level     TEXT NOT NULL DEFAULT 'class-9',
  subject         TEXT NOT NULL,
  book            TEXT NOT NULL,
  chapter         TEXT NOT NULL,
  chapter_number  INTEGER,
  instructions    TEXT,
  pages           JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_pages     INTEGER NOT NULL DEFAULT 1,
  current_page    INTEGER NOT NULL DEFAULT 1,
  annotations     JSONB NOT NULL DEFAULT '{}'::jsonb,
  rating          TEXT CHECK (rating IN ('up', 'down')),
  share_token     TEXT UNIQUE,
  is_public       BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.generated_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notes"    ON public.generated_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes"  ON public.generated_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes"  ON public.generated_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes"  ON public.generated_notes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Public notes viewable by all" ON public.generated_notes FOR SELECT USING (is_public = true);

-- ── 2. GENERATED FLASHCARDS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.generated_flashcards (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_level     TEXT NOT NULL DEFAULT 'class-9',
  subject         TEXT NOT NULL,
  book            TEXT NOT NULL,
  chapter         TEXT NOT NULL,
  chapter_number  INTEGER,
  instructions    TEXT,
  cards           JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_cards     INTEGER NOT NULL DEFAULT 0,
  current_card    INTEGER NOT NULL DEFAULT 0,
  annotations     JSONB NOT NULL DEFAULT '{}'::jsonb,
  rating          TEXT CHECK (rating IN ('up', 'down')),
  share_token     TEXT UNIQUE,
  is_public       BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.generated_flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own flashcards"    ON public.generated_flashcards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own flashcards"  ON public.generated_flashcards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own flashcards"  ON public.generated_flashcards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own flashcards"  ON public.generated_flashcards FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Public flashcards viewable by all" ON public.generated_flashcards FOR SELECT USING (is_public = true);

-- ── 3. INDEXES ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_generated_notes_user      ON public.generated_notes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_notes_share     ON public.generated_notes(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_generated_flashcards_user ON public.generated_flashcards(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_flashcards_share ON public.generated_flashcards(share_token) WHERE share_token IS NOT NULL;

-- ── 4. UPDATED_AT TRIGGER ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_notes_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_notes_updated
  BEFORE UPDATE ON public.generated_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_notes_timestamp();

CREATE TRIGGER on_flashcards_updated
  BEFORE UPDATE ON public.generated_flashcards
  FOR EACH ROW EXECUTE FUNCTION public.update_notes_timestamp();

-- ── 5. GENERATE SHARE TOKEN FUNCTION ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.generate_share_token(p_table TEXT, p_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token TEXT;
  v_sql TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'NOT_SIGNED_IN';
  END IF;

  v_token := encode(gen_random_bytes(16), 'hex');

  IF p_table = 'notes' THEN
    UPDATE public.generated_notes
    SET share_token = v_token, is_public = true
    WHERE id = p_id AND user_id = auth.uid();
  ELSIF p_table = 'flashcards' THEN
    UPDATE public.generated_flashcards
    SET share_token = v_token, is_public = true
    WHERE id = p_id AND user_id = auth.uid();
  END IF;

  RETURN v_token;
END;
$$;

GRANT EXECUTE ON FUNCTION public.generate_share_token(TEXT, UUID) TO authenticated;
