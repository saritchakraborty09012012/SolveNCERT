import React, { useState, useEffect } from 'react';
import { Users, Copy, Check, RefreshCw, X, Shield, Eye, Loader2, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import { cn } from '@/utils/helpers';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/helpers';

interface Session {
  id:          string;
  title:       string;
  invite_link: string;
  is_active:   boolean;
  max_members: number;
  expires_at:  string;
  created_at:  string;
}

// Policy popup shown once
function PolicyPopup({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--surface-0)] rounded-2xl border border-[var(--border)] max-w-md w-full p-7 animate-scale-in shadow-soft-xl">
        <div className="flex items-center gap-2.5 mb-4">
          <Shield size={18} className="text-blue-500" />
          <h2 className="font-display font-bold text-[var(--text-primary)]">Before You Start Inviting</h2>
        </div>
        <div className="space-y-3 text-sm text-[var(--text-secondary)] mb-6">
          <p><strong className="text-[var(--text-primary)]">What gets shared:</strong> Your name, initials, and session content with friends.</p>
          <p><strong className="text-[var(--text-primary)]">Attendee permissions:</strong> Can view, chat, add notes and highlights. Cannot change settings or remove others.</p>
          <p><strong className="text-[var(--text-primary)]">Privacy:</strong> Invite links expire every 24 hours. You can revoke access anytime.</p>
          <p><strong className="text-[var(--text-primary)]">Chat persistence:</strong> Invite chats are temporary. They are deleted when the session ends or an attendee leaves.</p>
        </div>
        <button onClick={onAccept} className="btn-primary w-full justify-center text-sm">
          I Understand â€” Continue
        </button>
      </div>
    </div>
  );
}

export default function InvitePage() {
  const { user, isGuest } = useAuthStore();
  const router = useRouter();

  const [sessions,     setSessions]     = useState<Session[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [creating,     setCreating]     = useState(false);
  const [sessionTitle, setSessionTitle] = useState('');
  const [showPolicy,   setShowPolicy]   = useState(false);
  const [policyDone,   setPolicyDone]   = useState(false);
  const [copied,       setCopied]       = useState<string | null>(null);

  useEffect(() => {
    if (isGuest) { router.replace('/'); return; }
    const seen = localStorage.getItem('sn_invite_policy');
    if (seen) setPolicyDone(true);
    fetchSessions();
  }, [isGuest]);

  async function fetchSessions() {
    if (!user) return;
    const { data } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('host_id', user.id)
      .order('created_at', { ascending: false });
    setSessions((data as Session[]) || []);
    setLoading(false);
  }

  async function createSession() {
    if (!user) return;
    if (!policyDone) { setShowPolicy(true); return; }
    if (!sessionTitle.trim()) return toast.error('Give your session a title.');
    setCreating(true);
    try {
      const sessionId  = crypto.randomUUID();
      const inviteLink = `${window.location.origin}/join/${sessionId}`;
      const expiresAt  = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const { error } = await supabase.from('study_sessions').insert({
        id:          sessionId,
        host_id:     user.id,
        title:       sessionTitle.trim(),
        invite_link: inviteLink,
        is_active:   true,
        max_members: user.plan === 'premium' ? 10 : 5,
        expires_at:  expiresAt,
      });

      if (error) throw error;
      setSessionTitle('');
      await fetchSessions();
      toast.success('Session created!');
    } catch {
      toast.error('Failed to create session.');
    } finally {
      setCreating(false);
    }
  }

  async function revokeSession(id: string) {
    await supabase.from('study_sessions').update({ is_active: false }).eq('id', id);
    setSessions(prev => prev.map(s => s.id === id ? { ...s, is_active: false } : s));
    toast.success('Access revoked.');
  }

  async function copyLink(link: string, id: string) {
    await navigator.clipboard.writeText(link);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success('Link copied!');
  }

  return (
    <Layout title="Invite to Study Room | SolveNCERT" description="Invite friends to a collaborative Study Room on SolveNCERT and solve NCERT problems together." canonical="/invite">
      {showPolicy && (
        <PolicyPopup onAccept={() => {
          localStorage.setItem('sn_invite_policy', '1');
          setPolicyDone(true);
          setShowPolicy(false);
        }} />
      )}

      <div className="max-w-screen-md mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Users size={22} className="text-blue-500" />
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Invite & Collaborate</h1>
        </div>

        {/* Create session */}
        <div className="card p-5 mb-6">
          <h2 className="font-semibold text-[var(--text-primary)] mb-3 text-sm">Create a New Invite Session</h2>
          <div className="flex gap-3">
            <input
              value={sessionTitle}
              onChange={e => setSessionTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createSession()}
              placeholder="Session title, e.g. 'Maths Chapter 1 Study'"
              className="input-field flex-1 text-sm"
            />
            <button onClick={createSession} disabled={creating} className="btn-primary text-sm flex-shrink-0">
              {creating ? <Loader2 size={15} className="animate-spin" /> : 'Create'}
            </button>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-2">
            {user?.plan === 'premium' ? <span className="text-amber-600 dark:text-amber-400 font-semibold">Premium: up to 10 friends</span> : 'Free plan: up to 5 friends Â· '}
            <span>Links expire after 24 hours.</span>
          </p>
        </div>

        {/* Sessions list */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Your Sessions</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={22} className="animate-spin text-blue-500" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="card p-8 text-center">
              <Users size={28} className="mx-auto text-blue-300 mb-3" />
              <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">No sessions yet</p>
              <p className="text-xs text-[var(--text-muted)]">Create a session above to invite friends to study together.</p>
            </div>
          ) : (
            sessions.map(session => (
              <div key={session.id} className={cn('card p-4', !session.is_active && 'opacity-60')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full',
                        session.is_active
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                      )}>
                        {session.is_active ? 'â— Active' : 'â— Expired'}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                        <Clock size={9} /> Expires {formatDate(session.expires_at)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{session.title}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate font-mono">{session.invite_link}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {session.is_active && (
                      <>
                        <button
                          onClick={() => copyLink(session.invite_link, session.id)}
                          className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-blue-500 transition-colors"
                          title="Copy invite link"
                        >
                          {copied === session.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={() => revokeSession(session.id)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                          title="Revoke access"
                        >
                          <X size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
