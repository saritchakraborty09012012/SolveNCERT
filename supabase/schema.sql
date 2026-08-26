-- ============================================================
-- SolveNCERT — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email            TEXT NOT NULL,
  full_name        TEXT NOT NULL,
  phone            TEXT,
  dob              DATE,
  bio              TEXT,
  avatar_url       TEXT,
  initials         TEXT NOT NULL DEFAULT 'SN',
  plan             TEXT NOT NULL DEFAULT 'trial' CHECK (plan IN ('free', 'trial', 'premium')),
  trial_ends_at    TIMESTAMPTZ,
  premium_ends_at  TIMESTAMPTZ,
  referral_code    TEXT UNIQUE,
  referred_by      TEXT,
  total_referrals  INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ── Invitee Profiles ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.invitee_profiles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id  UUID NOT NULL,
  host_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  email       TEXT,
  name        TEXT NOT NULL,
  dob         DATE,
  phone       TEXT,
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  left_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.invitee_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Host can manage invitees" ON public.invitee_profiles FOR ALL USING (auth.uid() = host_id);

-- ── Study Sessions ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  invite_link TEXT NOT NULL,
  is_active   BOOLEAN DEFAULT true,
  max_members INTEGER DEFAULT 5,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Host can manage sessions"  ON public.study_sessions FOR ALL USING (auth.uid() = host_id);
CREATE POLICY "Anyone can view active"    ON public.study_sessions FOR SELECT USING (is_active = true);

-- ── Payments ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount          INTEGER NOT NULL DEFAULT 99,
  utr_number      TEXT NOT NULL,
  screenshot_url  TEXT,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  plan_months     INTEGER DEFAULT 1,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  verified_at     TIMESTAMPTZ
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments"   ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── AI Chats ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ai_chats (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mode       TEXT NOT NULL,
  query      TEXT NOT NULL,
  response   TEXT NOT NULL,
  context    TEXT,
  chapter    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own chats" ON public.ai_chats FOR ALL USING (auth.uid() = user_id);

-- ── Storage Buckets ───────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars',              'avatars',              true);
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-screenshots',  'payment-screenshots',  false);

CREATE POLICY "Public avatar read"     ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Auth avatar upload"     ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Auth screenshot upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-screenshots' AND auth.role() = 'authenticated');

-- ── Function: auto-create profile on signup ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, initials, plan, trial_ends_at, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    UPPER(LEFT(COALESCE(NEW.raw_user_meta_data->>'full_name', 'SN'), 2)),
    'trial',
    NOW() + INTERVAL '30 days',
    'SN' || UPPER(LEFT(REPLACE(NEW.id::text, '-', ''), 6))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
