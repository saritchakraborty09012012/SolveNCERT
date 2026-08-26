-- ═══════════════════════════════════════════════════════════════════════════
-- V15 — COLLABORATION + CHAT SYSTEM
-- Host invites friends (free: 5, premium: 10). Invitees mirror the host's
-- account in real time. WhatsApp-style chat: general group per session,
-- host-scoped DMs, custom groups, files/voice/polls, ticks, nicknames,
-- group photos, 7-day retention. Persistent collaborative whiteboard.
-- ═══════════════════════════════════════════════════════════════════════════
-- NOTE: All tables are created first, then helpers, then policies — to avoid
-- forward-reference errors (e.g. collab_sessions policy referencing
-- collab_participants before it exists).

-- ── 0. Small additions to existing tables ───────────────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verified boolean NOT NULL DEFAULT false;

ALTER TABLE public.page_history         ADD COLUMN IF NOT EXISTS done_by_name text;
ALTER TABLE public.ai_chats             ADD COLUMN IF NOT EXISTS done_by_name text;
ALTER TABLE public.generated_notes      ADD COLUMN IF NOT EXISTS done_by_name text;
ALTER TABLE public.generated_flashcards ADD COLUMN IF NOT EXISTS done_by_name text;

-- log_page_visit now carries optional attribution (existing calls still work)
CREATE OR REPLACE FUNCTION public.log_page_visit(p_user_id uuid, p_url text, p_label text, p_done_by text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.page_history (user_id, url, label, done_by_name)
  VALUES (p_user_id, p_url, p_label, p_done_by)
  ON CONFLICT (user_id, url) DO UPDATE
    SET created_at = now(), label = excluded.label, done_by_name = excluded.done_by_name
    WHERE public.page_history.archived = false;
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_page_visit(uuid, text, text, text) TO authenticated;

-- ── 1. Tables (no policies yet — created in dependency order) ──────────────
CREATE TABLE IF NOT EXISTS public.collab_sessions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invite_code text UNIQUE NOT NULL,
  is_active   boolean NOT NULL DEFAULT true,
  max_friends integer NOT NULL DEFAULT 5,
  expires_at  timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  ended_at    timestamptz
);

CREATE TABLE IF NOT EXISTS public.collab_participants (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   uuid NOT NULL REFERENCES public.collab_sessions(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  email        text NOT NULL,
  display_name text NOT NULL,
  joined_at    timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  left_at      timestamptz,
  UNIQUE (session_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.chat_groups (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.collab_sessions(id) ON DELETE CASCADE,
  name       text NOT NULL DEFAULT 'Chat',
  is_default boolean NOT NULL DEFAULT false,
  is_dm      boolean NOT NULL DEFAULT false,
  photo_path text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_group_members (
  group_id     uuid NOT NULL REFERENCES public.chat_groups(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nickname     text,
  last_read_at timestamptz NOT NULL DEFAULT '1970-01-01',
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id             uuid NOT NULL REFERENCES public.chat_groups(id) ON DELETE CASCADE,
  sender_id            uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_name          text NOT NULL,
  kind                 text NOT NULL DEFAULT 'text',
  body                 text,
  file_path            text,
  file_name            text,
  file_size            bigint,
  file_type            text,
  poll_question        text,
  poll_options         jsonb,
  poll_votes           jsonb,
  created_at           timestamptz NOT NULL DEFAULT now(),
  deleted_for_everyone boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS chat_messages_group_idx ON public.chat_messages (group_id, created_at);

CREATE TABLE IF NOT EXISTS public.chat_message_hides (
  message_id uuid NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (message_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.chat_message_reads (
  message_id uuid NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  read_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (message_id, user_id)
);

CREATE INDEX IF NOT EXISTS chat_message_reads_msg_idx ON public.chat_message_reads (message_id);

CREATE TABLE IF NOT EXISTS public.collab_board_strokes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   uuid NOT NULL REFERENCES public.collab_sessions(id) ON DELETE CASCADE,
  author_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name  text NOT NULL,
  tool         text NOT NULL,
  color        text NOT NULL,
  size         numeric NOT NULL DEFAULT 3,
  alpha        numeric NOT NULL DEFAULT 1,
  points       jsonb NOT NULL,
  text_content text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS board_strokes_session_idx ON public.collab_board_strokes (session_id, created_at);

CREATE TABLE IF NOT EXISTS public.ai_followups (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  done_by_id   uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  done_by_name text,
  page_url     text,
  page_label   text,
  question     text NOT NULL,
  answer       text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.collab_sessions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collab_participants   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_groups           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_group_members    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_message_hides    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_message_reads    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collab_board_strokes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_followups          ENABLE ROW LEVEL SECURITY;

-- ── 2. Membership helpers (after tables exist) ─────────────────────────────
CREATE OR REPLACE FUNCTION public.collab_is_member(p_session_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT p_user_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.collab_sessions s
    LEFT JOIN public.collab_participants p
      ON p.session_id = s.id AND p.user_id = p_user_id AND p.left_at IS NULL
    WHERE s.id = p_session_id AND s.is_active AND (s.host_id = p_user_id OR p.id IS NOT NULL)
  );
$$;

CREATE OR REPLACE FUNCTION public.collab_is_member_of_host(p_host_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT p_user_id IS NOT NULL AND (
    p_user_id = p_host_id OR EXISTS (
      SELECT 1 FROM public.collab_sessions s
      JOIN public.collab_participants p ON p.session_id = s.id
      WHERE s.host_id = p_host_id AND s.is_active
        AND p.left_at IS NULL AND p.user_id = p_user_id
    )
  );
$$;

-- ── 3. Policies (after all tables + helpers exist) ─────────────────────────

-- collab_sessions
DROP POLICY IF EXISTS "Host manages own collab session" ON public.collab_sessions;
CREATE POLICY "Host manages own collab session" ON public.collab_sessions
  FOR ALL USING (auth.uid() = host_id) WITH CHECK (auth.uid() = host_id);
DROP POLICY IF EXISTS "Members view collab session" ON public.collab_sessions;
CREATE POLICY "Members view collab session" ON public.collab_sessions
  FOR SELECT USING (
    auth.uid() = host_id OR EXISTS (
      SELECT 1 FROM public.collab_participants p
      WHERE p.session_id = collab_sessions.id AND p.user_id = auth.uid()
    )
  );

-- collab_participants
DROP POLICY IF EXISTS "Session members view participants" ON public.collab_participants;
CREATE POLICY "Session members view participants" ON public.collab_participants
  FOR SELECT USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.collab_sessions s
      WHERE s.id = collab_participants.session_id AND s.host_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM public.collab_participants p2
      WHERE p2.session_id = collab_participants.session_id AND p2.user_id = auth.uid()
    )
  );
DROP POLICY IF EXISTS "Join own participation" ON public.collab_participants;
CREATE POLICY "Join own participation" ON public.collab_participants
  FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Update own presence" ON public.collab_participants;
CREATE POLICY "Update own presence" ON public.collab_participants
  FOR UPDATE USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.collab_sessions s
      WHERE s.id = collab_participants.session_id AND s.host_id = auth.uid()
    )
  );
DROP POLICY IF EXISTS "Host removes participants" ON public.collab_participants;
CREATE POLICY "Host removes participants" ON public.collab_participants
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.collab_sessions s
      WHERE s.id = collab_participants.session_id AND s.host_id = auth.uid()
    )
  );

-- chat_groups
DROP POLICY IF EXISTS "Members view own groups" ON public.chat_groups;
CREATE POLICY "Members view own groups" ON public.chat_groups
  FOR SELECT USING (
    auth.uid() = host_id OR (
      EXISTS (SELECT 1 FROM public.chat_group_members m WHERE m.group_id = chat_groups.id AND m.user_id = auth.uid())
      AND public.collab_is_member_of_host(chat_groups.host_id, auth.uid())
    )
  );
DROP POLICY IF EXISTS "Members create groups" ON public.chat_groups;
CREATE POLICY "Members create groups" ON public.chat_groups
  FOR INSERT WITH CHECK (created_by = auth.uid() AND public.collab_is_member_of_host(chat_groups.host_id, auth.uid()));
DROP POLICY IF EXISTS "Host updates groups" ON public.chat_groups;
CREATE POLICY "Host updates groups" ON public.chat_groups
  FOR UPDATE USING (auth.uid() = host_id);
DROP POLICY IF EXISTS "Host or creator deletes groups" ON public.chat_groups;
CREATE POLICY "Host or creator deletes groups" ON public.chat_groups
  FOR DELETE USING (auth.uid() = host_id OR auth.uid() = created_by);

-- chat_group_members
DROP POLICY IF EXISTS "Members view memberships" ON public.chat_group_members;
CREATE POLICY "Members view memberships" ON public.chat_group_members
  FOR SELECT USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.chat_groups g
      WHERE g.id = chat_group_members.group_id
        AND (g.host_id = auth.uid()
          OR (EXISTS (SELECT 1 FROM public.chat_group_members m2
                      WHERE m2.group_id = g.id AND m2.user_id = auth.uid())
              AND public.collab_is_member_of_host(g.host_id, auth.uid())))
    )
  );
DROP POLICY IF EXISTS "Members add memberships" ON public.chat_group_members;
CREATE POLICY "Members add memberships" ON public.chat_group_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_groups g
      WHERE g.id = chat_group_members.group_id
        AND public.collab_is_member_of_host(g.host_id, auth.uid())
        AND (g.created_by = auth.uid() OR g.host_id = auth.uid() OR user_id = auth.uid()
          OR EXISTS (SELECT 1 FROM public.chat_group_members m2
                     WHERE m2.group_id = g.id AND m2.user_id = auth.uid()))
    )
  );
DROP POLICY IF EXISTS "Members update memberships" ON public.chat_group_members;
CREATE POLICY "Members update memberships" ON public.chat_group_members
  FOR UPDATE USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.chat_groups g
      WHERE g.id = chat_group_members.group_id
        AND (g.host_id = auth.uid()
          OR (EXISTS (SELECT 1 FROM public.chat_group_members m2
                      WHERE m2.group_id = g.id AND m2.user_id = auth.uid())
              AND public.collab_is_member_of_host(g.host_id, auth.uid())))
    )
  );
DROP POLICY IF EXISTS "Leave or host removes" ON public.chat_group_members;
CREATE POLICY "Leave or host removes" ON public.chat_group_members
  FOR DELETE USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.chat_groups g
      WHERE g.id = chat_group_members.group_id AND g.host_id = auth.uid()
    )
  );

-- chat_messages
DROP POLICY IF EXISTS "Members view messages" ON public.chat_messages;
CREATE POLICY "Members view messages" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_groups g
      WHERE g.id = chat_messages.group_id
        AND (g.host_id = auth.uid()
          OR (EXISTS (SELECT 1 FROM public.chat_group_members m
                      WHERE m.group_id = g.id AND m.user_id = auth.uid())
              AND public.collab_is_member_of_host(g.host_id, auth.uid())))
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.chat_message_hides h
      WHERE h.message_id = chat_messages.id AND h.user_id = auth.uid()
    )
  );
DROP POLICY IF EXISTS "Members send messages" ON public.chat_messages;
CREATE POLICY "Members send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND EXISTS (
      SELECT 1 FROM public.chat_groups g
      WHERE g.id = chat_messages.group_id
        AND public.collab_is_member_of_host(g.host_id, auth.uid())
    )
  );
DROP POLICY IF EXISTS "Sender or host updates messages" ON public.chat_messages;
CREATE POLICY "Sender or host updates messages" ON public.chat_messages
  FOR UPDATE USING (
    sender_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.chat_groups g
      WHERE g.id = chat_messages.group_id AND g.host_id = auth.uid()
    )
  );
DROP POLICY IF EXISTS "Sender or host deletes messages" ON public.chat_messages;
CREATE POLICY "Sender or host deletes messages" ON public.chat_messages
  FOR DELETE USING (
    sender_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.chat_groups g
      WHERE g.id = chat_messages.group_id AND g.host_id = auth.uid()
    )
  );

-- chat_message_hides
DROP POLICY IF EXISTS "Own hides" ON public.chat_message_hides;
CREATE POLICY "Own hides" ON public.chat_message_hides
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- chat_message_reads
DROP POLICY IF EXISTS "Members view reads" ON public.chat_message_reads;
CREATE POLICY "Members view reads" ON public.chat_message_reads
  FOR SELECT USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.chat_messages msg
      JOIN public.chat_groups g ON g.id = msg.group_id
      WHERE msg.id = chat_message_reads.message_id
        AND public.collab_is_member_of_host(g.host_id, auth.uid())
    )
  );
DROP POLICY IF EXISTS "Members mark reads" ON public.chat_message_reads;
CREATE POLICY "Members mark reads" ON public.chat_message_reads
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND EXISTS (
      SELECT 1 FROM public.chat_messages msg
      JOIN public.chat_groups g ON g.id = msg.group_id
      WHERE msg.id = chat_message_reads.message_id
        AND public.collab_is_member_of_host(g.host_id, auth.uid())
    )
  );
DROP POLICY IF EXISTS "Own reads delete" ON public.chat_message_reads;
CREATE POLICY "Own reads delete" ON public.chat_message_reads
  FOR DELETE USING (auth.uid() = user_id);

-- collab_board_strokes
DROP POLICY IF EXISTS "Members view strokes" ON public.collab_board_strokes;
CREATE POLICY "Members view strokes" ON public.collab_board_strokes
  FOR SELECT USING (public.collab_is_member(session_id, auth.uid()));
DROP POLICY IF EXISTS "Members draw strokes" ON public.collab_board_strokes;
CREATE POLICY "Members draw strokes" ON public.collab_board_strokes
  FOR INSERT WITH CHECK (author_id = auth.uid() AND public.collab_is_member(session_id, auth.uid()));
DROP POLICY IF EXISTS "Author or host removes strokes" ON public.collab_board_strokes;
CREATE POLICY "Author or host removes strokes" ON public.collab_board_strokes
  FOR DELETE USING (
    author_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.collab_sessions s
      WHERE s.id = collab_board_strokes.session_id AND s.host_id = auth.uid()
    )
  );

-- ai_followups
DROP POLICY IF EXISTS "View own or collab followups" ON public.ai_followups;
CREATE POLICY "View own or collab followups" ON public.ai_followups
  FOR SELECT USING (
    auth.uid() = user_id OR public.collab_is_member_of_host(user_id, auth.uid())
  );
DROP POLICY IF EXISTS "Insert own or collab followups" ON public.ai_followups;
CREATE POLICY "Insert own or collab followups" ON public.ai_followups
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR public.collab_is_member_of_host(user_id, auth.uid())
  );
DROP POLICY IF EXISTS "Owner or author deletes followups" ON public.ai_followups;
CREATE POLICY "Owner or author deletes followups" ON public.ai_followups
  FOR DELETE USING (auth.uid() = user_id OR auth.uid() = done_by_id);

-- Collab access to host account data (view + add, never delete)
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['page_history','ai_chats','generated_notes','generated_flashcards'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', 'Collab view host ' || t, t);
    EXECUTE format('CREATE POLICY %I ON public.%I
                    FOR SELECT USING (public.collab_is_member_of_host(user_id, auth.uid()));', 'Collab view host ' || t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', 'Collab add host ' || t, t);
    EXECUTE format('CREATE POLICY %I ON public.%I
                    FOR INSERT WITH CHECK (public.collab_is_member_of_host(user_id, auth.uid()));', 'Collab add host ' || t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', 'Collab update host ' || t, t);
    EXECUTE format('CREATE POLICY %I ON public.%I
                    FOR UPDATE USING (public.collab_is_member_of_host(user_id, auth.uid()));', 'Collab update host ' || t, t);
  END LOOP;
END $$;

-- Invitees can see the host's profile row (name/avatar/plan) while active
DROP POLICY IF EXISTS "Collab members view host profile" ON public.profiles;
CREATE POLICY "Collab members view host profile" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.collab_sessions s
      JOIN public.collab_participants p ON p.session_id = s.id
      WHERE s.host_id = profiles.id AND s.is_active AND p.left_at IS NULL AND p.user_id = auth.uid()
    )
  );

-- ── 4. RPCs ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.collab_lookup_email(p_email text)
RETURNS TABLE (user_id uuid, full_name text)
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT id, full_name FROM public.profiles WHERE lower(email) = lower(p_email) LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.collab_lookup_email(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.ensure_dm_group(p_host_id uuid, p_other uuid)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  me uuid := auth.uid();
  gid uuid;
  other_name text;
BEGIN
  IF me IS NULL OR p_other IS NULL OR me = p_other THEN RETURN NULL; END IF;
  IF NOT public.collab_is_member_of_host(p_host_id, me)
     OR NOT public.collab_is_member_of_host(p_host_id, p_other) THEN
    RETURN NULL;
  END IF;

  SELECT g.id INTO gid FROM public.chat_groups g
  WHERE g.host_id = p_host_id AND g.is_dm
    AND (SELECT count(*) FROM public.chat_group_members m WHERE m.group_id = g.id) = 2
    AND EXISTS (SELECT 1 FROM public.chat_group_members m WHERE m.group_id = g.id AND m.user_id = me)
    AND EXISTS (SELECT 1 FROM public.chat_group_members m WHERE m.group_id = g.id AND m.user_id = p_other)
  LIMIT 1;
  IF gid IS NOT NULL THEN RETURN gid; END IF;

  SELECT full_name INTO other_name FROM public.profiles WHERE id = p_other;

  INSERT INTO public.chat_groups (host_id, session_id, name, is_default, is_dm, created_by)
  VALUES (p_host_id, NULL, COALESCE(other_name, 'Chat'), false, true, me)
  RETURNING id INTO gid;

  INSERT INTO public.chat_group_members (group_id, user_id) VALUES (gid, me), (gid, p_other);
  RETURN gid;
END;
$$;
GRANT EXECUTE ON FUNCTION public.ensure_dm_group(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.cleanup_expired_collab()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  cutoff timestamptz := now() - interval '7 days';
BEGIN
  DELETE FROM storage.objects WHERE bucket_id = 'chat-attachments' AND created_at < cutoff;
  DELETE FROM public.chat_messages WHERE created_at < cutoff;
  DELETE FROM public.chat_groups g
   WHERE g.created_at < cutoff
     AND NOT EXISTS (SELECT 1 FROM public.chat_messages m WHERE m.group_id = g.id);
  DELETE FROM public.chat_groups g
   WHERE EXISTS (SELECT 1 FROM public.chat_messages m WHERE m.group_id = g.id)
     AND NOT EXISTS (SELECT 1 FROM public.chat_messages m WHERE m.group_id = g.id AND m.created_at >= cutoff);
  DELETE FROM public.chat_group_members m
   WHERE NOT EXISTS (SELECT 1 FROM public.chat_groups g WHERE g.id = m.group_id);
  DELETE FROM public.collab_board_strokes b
   USING public.collab_sessions s
   WHERE b.session_id = s.id AND s.created_at < cutoff;
  UPDATE public.collab_sessions s SET is_active = false, ended_at = now()
   WHERE s.is_active = true AND s.expires_at < now();
  DELETE FROM public.collab_sessions s
   WHERE s.is_active = false AND s.ended_at < now() - interval '30 days';
END;
$$;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_collab() TO authenticated;

-- ── 5. Storage bucket for chat files (private, host-scoped) ────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-attachments', 'chat-attachments', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Chat files read" ON storage.objects;
CREATE POLICY "Chat files read" ON storage.objects FOR SELECT
  USING (bucket_id = 'chat-attachments'
    AND public.collab_is_member_of_host(((storage.foldername(name))[1])::uuid, auth.uid()));
DROP POLICY IF EXISTS "Chat files upload" ON storage.objects;
CREATE POLICY "Chat files upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'chat-attachments'
    AND auth.uid() IS NOT NULL
    AND public.collab_is_member_of_host(((storage.foldername(name))[1])::uuid, auth.uid()));
DROP POLICY IF EXISTS "Chat files delete" ON storage.objects;
CREATE POLICY "Chat files delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'chat-attachments'
    AND (owner = auth.uid()
      OR public.collab_is_member_of_host(((storage.foldername(name))[1])::uuid, auth.uid())));

-- ── 6. Realtime publication ────────────────────────────────────────────────
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'public.chat_messages','public.chat_groups','public.chat_group_members',
    'public.chat_message_reads','public.collab_participants','public.collab_sessions',
    'public.collab_board_strokes','public.ai_followups',
    'public.page_history','public.ai_chats','public.generated_notes','public.generated_flashcards'
  ] LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %s;', t);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
  END LOOP;
END $$;
