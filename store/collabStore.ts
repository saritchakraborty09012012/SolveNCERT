import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore, applyThemeOnly, restoreOwnTheme, type Theme } from '@/store/themeStore';
import { useUIStore, applyUIOnly, restoreOwnUI, type UI } from '@/store/uiStore';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Profile } from '@/types/database';

export interface CollabMember {
  id: string;
  user_id: string;
  email: string;
  display_name: string;
  joined_at: string;
  last_seen_at: string;
  is_host: boolean;
}

interface CollabState {
  active: boolean;
  role: 'host' | 'invitee' | null;
  sessionId: string | null;
  inviteCode: string | null;
  hostId: string | null;
  hostName: string | null;
  hostProfile: Profile | null;
  members: CollabMember[];
  maxFriends: number;
  channel: RealtimeChannel | null;
  restored: boolean;

  startHosting: () => Promise<string>;
  endHosting: () => Promise<void>;
  joinSession: (code: string) => Promise<{ ok: boolean; error?: string; hostName?: string }>;
  leaveSession: () => Promise<void>;
  refreshMembers: () => Promise<void>;
  restore: () => Promise<void>;
  ensureDms: () => Promise<void>;
  broadcastTheme: () => void;
}

const STORAGE_KEY = 'sn_collab';
const ONLINE_WINDOW_MS = 70 * 1000;

function makeCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function persist(s: Partial<CollabState>) {
  try {
    if (!s.sessionId) { localStorage.removeItem(STORAGE_KEY); return; }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      sessionId: s.sessionId, role: s.role, hostId: s.hostId,
      inviteCode: s.inviteCode, hostName: s.hostName,
    }));
  } catch { /* ignore */ }
}

export const useCollabStore = create<CollabState>((set, get) => ({
  active: false,
  role: null,
  sessionId: null,
  inviteCode: null,
  hostId: null,
  hostName: null,
  hostProfile: null,
  members: [],
  maxFriends: 5,
  channel: null,
  restored: false,

  /** Host: reuse existing active session or create a fresh one (24h link) + "general [date]" group. */
  startHosting: async () => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('not-logged-in');

    // Check for existing active session (not expired)
    const { data: existing } = await supabase
      .from('collab_sessions')
      .select('*')
      .eq('host_id', user.id)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) {
      // Reuse existing session
      set({
        active: true, role: 'host', sessionId: existing.id, inviteCode: existing.invite_code,
        hostId: user.id, hostName: user.full_name || 'Host', hostProfile: user,
        maxFriends: existing.max_friends, members: [],
      });
      persist(get());
      get().broadcastTheme();
      get().refreshMembers().then(() => { get().broadcastTheme(); });
      return existing.invite_code;
    }

    // Create new session
    const code = makeCode();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const maxFriends = user.plan === 'premium' ? 10 : 5;

    const { data: sess, error } = await supabase
      .from('collab_sessions')
      .insert({ host_id: user.id, invite_code: code, expires_at: expires, max_friends: maxFriends })
      .select()
      .single();
    if (error || !sess) {
      const msg = (error as { message?: string })?.message || '';
      console.error('[startHosting] Insert error:', { error, msg, code: error?.code, details: error?.details, hint: error?.hint });
      if (msg.includes('does not exist') || msg.includes('relation')) {
        throw new Error('Database not ready — please run v17_ALL_IN_ONE_RUN_THIS.sql in Supabase SQL Editor, then refresh.');
      }
      throw new Error(`Create session failed: ${msg || error?.code || 'unknown error'}`);
    }

    // Check if default group already exists for this session
    let grp;
    const { data: existingGrp } = await supabase
      .from('chat_groups')
      .select('*')
      .eq('session_id', sess.id)
      .eq('is_default', true)
      .limit(1)
      .maybeSingle();

    if (existingGrp) {
      grp = existingGrp;
    } else {
      const dateLabel = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      const { data: newGrp, error: gErr } = await supabase
        .from('chat_groups')
        .insert({ host_id: user.id, session_id: sess.id, name: `general ${dateLabel}`, is_default: true, is_dm: false, created_by: user.id })
        .select()
        .single();
      if (gErr || !newGrp) throw gErr || new Error('group-failed');
      grp = newGrp;
      await supabase.from('chat_group_members').insert({ group_id: grp.id, user_id: user.id });
    }

    await supabase.from('collab_participants').insert({
      session_id: sess.id, user_id: user.id,
      email: user.email, display_name: user.full_name || 'Host',
    });

    set({
      active: true, role: 'host', sessionId: sess.id, inviteCode: code,
      hostId: user.id, hostName: user.full_name || 'Host', hostProfile: user,
      maxFriends, members: [],
    });
    persist(get());
    get().broadcastTheme();
    get().refreshMembers().then(() => { get().broadcastTheme(); });
    return code;
  },

  endHosting: async () => {
    const { sessionId } = get();
    if (sessionId) {
      await supabase.from('collab_sessions').update({ is_active: false, ended_at: new Date().toISOString() }).eq('id', sessionId);
    }
    get().channel?.unsubscribe();
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    set({ active: false, role: null, sessionId: null, inviteCode: null, hostId: null, hostName: null, hostProfile: null, members: [], channel: null });
  },

  /** Invitee: join by invite code (must already be logged in). */
  joinSession: async (code) => {
    const { user } = useAuthStore.getState();
    if (!user) return { ok: false, error: 'not-logged-in' };

    const { data: sess } = await supabase
      .from('collab_sessions')
      .select('*')
      .eq('invite_code', code.toUpperCase().trim())
      .maybeSingle();

    if (!sess || !sess.is_active || new Date(sess.expires_at) < new Date()) {
      return { ok: false, error: 'Link expired or invalid. Ask your friend for a new invite.' };
    }
    if (sess.host_id === user.id) {
      return { ok: false, error: 'This is your own invite link.' };
    }

    const { data: existing } = await supabase
      .from('collab_participants')
      .select('*')
      .eq('session_id', sess.id).eq('user_id', user.id)
      .maybeSingle();

    if (existing && existing.left_at) {
      await supabase.from('collab_participants').update({ left_at: null, joined_at: new Date().toISOString(), last_seen_at: new Date().toISOString() }).eq('id', existing.id);
    } else if (!existing) {
      const { count } = await supabase
        .from('collab_participants')
        .select('id', { count: 'exact', head: true })
        .eq('session_id', sess.id).is('left_at', null).neq('user_id', sess.host_id);
      if ((count ?? 0) >= sess.max_friends) {
        return { ok: false, error: `This friend circle is full (${sess.max_friends} max).` };
      }
      const { error: pErr } = await supabase.from('collab_participants').insert({
        session_id: sess.id, user_id: user.id, email: user.email, display_name: user.full_name || 'Friend',
      });
      if (pErr) return { ok: false, error: 'Could not join — try again.' };
    }

    const { data: hostProfile } = await supabase.from('profiles').select('*').eq('id', sess.host_id).maybeSingle();

    set({
      active: true, role: 'invitee', sessionId: sess.id, inviteCode: sess.invite_code,
      hostId: sess.host_id, hostName: hostProfile?.full_name || 'Friend',
      hostProfile: (hostProfile as Profile) || null, maxFriends: sess.max_friends, members: [],
    });
    persist(get());

    get().refreshMembers().then(() => get().ensureDms());
    return { ok: true, hostName: hostProfile?.full_name || 'Friend' };
  },

  leaveSession: async () => {
    const { sessionId } = get();
    const { user } = useAuthStore.getState();
    if (sessionId && user) {
      await supabase.from('collab_participants').update({ left_at: new Date().toISOString() })
        .eq('session_id', sessionId).eq('user_id', user.id);
    }
    get().channel?.unsubscribe();
    restoreOwnTheme();
    restoreOwnUI();
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    set({ active: false, role: null, sessionId: null, inviteCode: null, hostId: null, hostName: null, hostProfile: null, members: [], channel: null });
  },

  refreshMembers: async () => {
    const { sessionId } = get();
    if (!sessionId) return;
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: sess } = await supabase.from('collab_sessions').select('host_id, is_active, expires_at, max_friends').eq('id', sessionId).maybeSingle();
    if (!sess || !sess.is_active || new Date(sess.expires_at) < new Date()) {
      // session over — leave quietly
      if (get().role === 'invitee') await get().leaveSession();
      else await get().endHosting();
      return;
    }
    const { data: rows } = await supabase
      .from('collab_participants')
      .select('*')
      .eq('session_id', sessionId).is('left_at', null)
      .gte('last_seen_at', dayAgo)
      .order('joined_at');
    const members: CollabMember[] = (rows || []).map(r => ({
      id: r.id, user_id: r.user_id, email: r.email, display_name: r.display_name,
      joined_at: r.joined_at, last_seen_at: r.last_seen_at, is_host: r.user_id === sess.host_id,
    }));
    set({ members });
  },

  /** Re-attach to a stored session after page refresh. */
  restore: async () => {
    if (get().restored) return;
    set({ restored: true });
    let saved: { sessionId: string; role: 'host' | 'invitee'; hostId: string; inviteCode: string; hostName: string } | null = null;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { /* ignore */ }
    if (!saved?.sessionId) return;
    const { user } = useAuthStore.getState();
    if (!user) return;

    const { data: sess } = await supabase.from('collab_sessions').select('*').eq('id', saved.sessionId).maybeSingle();
    if (!sess || !sess.is_active || new Date(sess.expires_at) < new Date()) {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      return;
    }

    set({
      active: true, role: saved.role, sessionId: sess.id, inviteCode: sess.invite_code,
      hostId: sess.host_id, hostName: saved.hostName, maxFriends: sess.max_friends, members: [],
    });

    if (saved.role === 'invitee') {
      const { data: hostProfile } = await supabase.from('profiles').select('*').eq('id', sess.host_id).maybeSingle();
      if (hostProfile) set({ hostProfile: hostProfile as Profile, hostName: hostProfile.full_name });
      await supabase.from('collab_participants').update({ last_seen_at: new Date().toISOString() })
        .eq('session_id', sess.id).eq('user_id', user.id);
    }
    get().refreshMembers();
  },

  /** Ensure a DM exists between me and every other active member (host-scoped). */
  ensureDms: async () => {
    const { hostId, members } = get();
    const { user } = useAuthStore.getState();
    if (!hostId || !user) return;
    const others = members.filter(m => m.user_id !== user.id).map(m => m.user_id);
    for (const other of others) {
      await supabase.rpc('ensure_dm_group', { p_host_id: hostId, p_other: other });
    }
  },

  /** Host pushes current theme + UI to everyone (invitees apply without saving). */
  broadcastTheme: () => {
    const { role, channel } = get();
    if (role !== 'host' || !channel) return;
    const theme = useThemeStore.getState().theme as Theme;
    const ui = useUIStore.getState().ui as UI;
    channel.send({ type: 'broadcast', event: 'collab-theme', payload: { theme, ui } });
  },
}));

/** Subscribe the session channel (call after active+sessionId are set). */
export function attachCollabChannel() {
  const s = useCollabStore.getState();
  if (!s.active || !s.sessionId || s.channel) return;
  const { user } = useAuthStore.getState();

  const channel = supabase.channel(`collab-${s.sessionId}`, {
    config: { presence: { key: user?.id || 'anon' } },
  });

  channel
    .on('broadcast', { event: 'collab-members' }, () => {
      useCollabStore.getState().refreshMembers().then(() => {
        const st = useCollabStore.getState();
        st.ensureDms();
        if (st.role === 'host') st.broadcastTheme();
      });
    })
    .on('broadcast', { event: 'collab-theme' }, ({ payload }) => {
      const st = useCollabStore.getState();
      if (st.role !== 'invitee' || !payload) return;
      applyThemeOnly(payload.theme as Theme);
      applyUIOnly(payload.ui as UI);
    })
    .subscribe();

  useCollabStore.setState({ channel });

  // Host mirrors own theme/UI changes to everyone live
  if (s.role === 'host') {
    useThemeStore.subscribe(() => useCollabStore.getState().broadcastTheme());
    useUIStore.subscribe(() => useCollabStore.getState().broadcastTheme());
  }

  // Heartbeat — keeps presence alive
  const hb = setInterval(() => {
    const st = useCollabStore.getState();
    const u = useAuthStore.getState().user;
    if (!st.active || !st.sessionId || !u) return;
    supabase.from('collab_participants').update({ last_seen_at: new Date().toISOString() })
      .eq('session_id', st.sessionId).eq('user_id', u.id)
      .then(() => {}, () => {});
  }, 30 * 1000);
  (channel as unknown as { _hb?: ReturnType<typeof setInterval> })._hb = hb;
}

// ── Helpers used across the app ──────────────────────────────────────────────

/** The account whose data should be shown/edited right now (host when mirroring). */
export function useCollabEffective(): { accountId: string | null; doneByName: string | null; isInvitee: boolean; isCollab: boolean; hostId: string | null } {
  const { active, role, hostId } = useCollabStore();
  const { user } = useAuthStore();
  if (active && role === 'invitee' && hostId) {
    return { accountId: hostId, doneByName: user?.full_name || 'Friend', isInvitee: true, isCollab: true, hostId };
  }
  return { accountId: user?.id || null, doneByName: null, isInvitee: false, isCollab: active, hostId };
}

export function isMemberOnline(lastSeenAt: string): boolean {
  return Date.now() - new Date(lastSeenAt).getTime() < ONLINE_WINDOW_MS;
}

export function lastActiveLabel(lastSeenAt: string): string {
  const diff = Date.now() - new Date(lastSeenAt).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'active just now';
  if (mins < 60) return `active ${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `active ${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `active ${days}d ago`;
}
