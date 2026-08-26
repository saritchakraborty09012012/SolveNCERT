-- ═══════════════════════════════════════════════════════════════════════════
-- RUN THIS ONE SQL in Supabase SQL Editor — fixes signup error
-- ═══════════════════════════════════════════════════════════════════════════

-- Step 1: Make sure email_verified has a default
ALTER TABLE public.profiles ALTER COLUMN email_verified SET DEFAULT false;

-- Step 2: Fix the trigger to include ALL columns
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
