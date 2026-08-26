-- ═══════════════════════════════════════════════════════════════════════════
-- v18 — Fix "Database error saving new user" + group duplicate creation
-- RUN THIS ONCE in Supabase SQL Editor.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Fix email_verified column default (in case it was created without one)
ALTER TABLE public.profiles ALTER COLUMN email_verified SET DEFAULT false;

-- ── 2. Fix handle_new_user trigger to include ALL required columns ──────────
-- This ensures signUp never fails due to missing column values.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, initials, plan, trial_ends_at, referral_code, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    UPPER(LEFT(COALESCE(NEW.raw_user_meta_data->>'full_name', 'SN'), 2)),
    'trial',
    NOW() + INTERVAL '30 days',
    'SN' || UPPER(LEFT(REPLACE(NEW.id::text, '-', ''), 6)),
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 3. Cleanup: drop any orphaned chat_groups without active sessions ───────
DELETE FROM public.chat_groups
WHERE session_id IS NOT NULL
  AND session_id NOT IN (SELECT id FROM public.collab_sessions WHERE is_active = true);

-- Done! Now hard-refresh your app (Ctrl+Shift+R) and test signup.
