-- V16 — Host OTP codes (pure 6-digit, no magic link jhanjhat)
CREATE TABLE IF NOT EXISTS public.host_otps (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  email      text NOT NULL,
  code       text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS host_otps_user_idx ON public.host_otps (user_id, expires_at);
ALTER TABLE public.host_otps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Own otps" ON public.host_otps;
CREATE POLICY "Own otps" ON public.host_otps FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- auto-cleanup expired codes (called on verify)
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps() RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  DELETE FROM public.host_otps WHERE expires_at < now() - interval '1 hour';
$$;
