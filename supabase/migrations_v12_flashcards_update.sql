-- ═══════════════════════════════════════════════════════════════════════════
-- SolveNCERT — Flashcards table update
-- Run this in Supabase SQL Editor to add missing columns
-- ═══════════════════════════════════════════════════════════════════════════

-- Add num_pages column if it doesn't exist
DO $$ BEGIN
  ALTER TABLE public.generated_flashcards ADD COLUMN IF NOT EXISTS num_pages INTEGER DEFAULT 5;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Make user_id nullable for anonymous flashcard generation
ALTER TABLE public.generated_flashcards ALTER COLUMN user_id DROP NOT NULL;

-- Add flashcard_data column as alias (some code may reference it)
DO $$ BEGIN
  ALTER TABLE public.generated_flashcards ADD COLUMN IF NOT EXISTS flashcard_data JSONB;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Ensure share_token index exists
CREATE INDEX IF NOT EXISTS idx_generated_flashcards_share_token
  ON public.generated_flashcards(share_token) WHERE share_token IS NOT NULL;

-- Ensure class_level + subject + chapter index for cache lookups
CREATE INDEX IF NOT EXISTS idx_generated_flashcards_cache_lookup
  ON public.generated_flashcards(class_level, subject, chapter);
