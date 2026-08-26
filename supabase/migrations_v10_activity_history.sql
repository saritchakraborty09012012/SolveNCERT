-- ═══════════════════════════════════════════════════════════════════════════
-- SolveNCERT v10 — ACTIVITY HISTORY (cross-device, retention settings, archive)
-- Paste this whole file into Supabase SQL Editor and run top to bottom.
-- Builds on top of the page_history table created in migrations_v9.sql.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. RETENTION SETTINGS ON PROFILES ──────────────────────────────────────
-- history_retention_days : how many days of activity history to keep
--                          (free/trial: 1–30, premium: 1–120)
-- history_keep_forever   : premium-only switch — never auto-delete history
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS history_retention_days integer NOT NULL DEFAULT 30;
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS history_keep_forever boolean NOT NULL DEFAULT false;


-- ── 2. SET RETENTION (server-side clamping by plan) ────────────────────────
-- Free/trial users: 1–30 days, "keep forever" is forced off.
-- Premium users:    1–120 days, may keep forever.
-- Raises 'INVALID_RANGE' when out of range for the caller's plan.
CREATE OR REPLACE FUNCTION public.set_history_retention(
  p_days integer,
  p_keep_forever boolean DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'NOT_SIGNED_IN';
  END IF;

  SELECT plan INTO v_plan FROM public.profiles WHERE id = auth.uid();
  IF v_plan IS NULL THEN
    RAISE EXCEPTION 'NOT_SIGNED_IN';
  END IF;

  IF v_plan = 'premium' THEN
    IF p_days < 1 OR p_days > 120 THEN
      RAISE EXCEPTION 'INVALID_RANGE';
    END IF;
    UPDATE public.profiles
    SET history_retention_days = p_days,
        history_keep_forever   = COALESCE(p_keep_forever, false),
        updated_at             = now()
    WHERE id = auth.uid();
  ELSE
    IF p_days < 1 OR p_days > 30 THEN
      RAISE EXCEPTION 'INVALID_RANGE';
    END IF;
    UPDATE public.profiles
    SET history_retention_days = p_days,
        history_keep_forever   = false,
        updated_at             = now()
    WHERE id = auth.uid();
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_history_retention(integer, boolean) TO authenticated;


-- ── 3. ARCHIVE WITH A HARD LIMIT OF 5 ──────────────────────────────────────
-- Max 5 activities can sit in the archive at a time. Archived entries are
-- exempt from every auto-delete and only leave the archive when the user
-- restores or deletes them. Raises 'ARCHIVE_LIMIT' when already full.
-- Returns the new archived count on success.
CREATE OR REPLACE FUNCTION public.archive_history_entry(p_entry_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'NOT_SIGNED_IN';
  END IF;

  SELECT count(*) INTO v_count
  FROM public.page_history
  WHERE user_id = auth.uid() AND archived = true;

  IF v_count >= 5 THEN
    RAISE EXCEPTION 'ARCHIVE_LIMIT';
  END IF;

  UPDATE public.page_history
  SET archived = true
  WHERE id = p_entry_id AND user_id = auth.uid() AND archived = false;

  RETURN v_count + 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.archive_history_entry(uuid) TO authenticated;


-- ── 4. RETENTION CLEANUP (replaces the v9 version) ─────────────────────────
-- Honors each user's own setting instead of a hardcoded free-plan rule:
--   • history_keep_forever = true  → nothing is ever deleted
--   • otherwise delete non-archived rows older than history_retention_days
-- Archived rows are NEVER auto-deleted — they stay until the user deletes
-- them or moves them out of the archive themselves.
CREATE OR REPLACE FUNCTION public.cleanup_expired_history(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_days    integer;
  v_forever boolean;
BEGIN
  SELECT history_retention_days, history_keep_forever
  INTO v_days, v_forever
  FROM public.profiles
  WHERE id = p_user_id;

  IF v_forever THEN
    RETURN;
  END IF;

  DELETE FROM public.page_history
  WHERE user_id = p_user_id
    AND archived = false
    AND created_at < now() - make_interval(days => COALESCE(v_days, 30));
END;
$$;

GRANT EXECUTE ON FUNCTION public.cleanup_expired_history(uuid) TO authenticated;

-- NOTE: like v9, cleanup runs lazily right before the History list is fetched.
-- If you want it running in the background for all users regardless of visits,
-- enable pg_cron (Database → Extensions) and schedule:
--   SELECT cron.schedule('solvencert-history-cleanup', '0 3 * * *', $$
--     DELETE FROM public.page_history ph
--     USING public.profiles p
--     WHERE p.id = ph.user_id
--       AND p.history_keep_forever = false
--       AND ph.archived = false
--       AND ph.created_at < now() - make_interval(days => COALESCE(p.history_retention_days, 30))
--   $$);
