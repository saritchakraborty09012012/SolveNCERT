-- ═══════════════════════════════════════════════════════════════════════════
-- V15b — FIX: Re-create the host-access policies dropped to fix login 500
-- Run this with the app CLOSED (no localhost tab open) to avoid deadlock.
-- All policies use the SECURITY DEFINER helpers so they bypass RLS safely.
-- ═══════════════════════════════════════════════════════════════════════════

-- Helpers must exist before policies that use them
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

-- Host profile visible to active invitees (uses helper → no RLS recursion, no 500)
DROP POLICY IF EXISTS "Collab members view host profile" ON public.profiles;
CREATE POLICY "Collab members view host profile" ON public.profiles
  FOR SELECT USING (public.collab_is_member_of_host(profiles.id, auth.uid()));

-- Host account data: invitees can view/add/update but never delete (host-only delete)
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['page_history','ai_chats','generated_notes','generated_flashcards'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', 'Collab view host ' || t, t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT USING (public.collab_is_member_of_host(user_id, auth.uid()));', 'Collab view host ' || t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', 'Collab add host ' || t, t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT WITH CHECK (public.collab_is_member_of_host(user_id, auth.uid()));', 'Collab add host ' || t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', 'Collab update host ' || t, t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE USING (public.collab_is_member_of_host(user_id, auth.uid()));', 'Collab update host ' || t, t);
  END LOOP;
END $$;
