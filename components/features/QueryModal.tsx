import React, { useEffect, useState } from 'react';
import { X, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

/**
 * Global "Send a query" modal — opened from the red header icon.
 * Available to guests, free and premium users alike. Inserts into public.queries.
 */
export default function QueryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (user) {
      setName(user.full_name || '');
      setEmail(user.email || '');
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, user, onClose]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || submitting) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('queries').insert({
        user_id: user?.id ?? null,
        name: name.trim() || user?.full_name || null,
        email: email.trim() || user?.email || null,
        page_path: typeof window !== 'undefined' ? window.location.pathname : null,
        message: message.trim(),
      });
      if (error) throw error;
      toast.success('Query received — thank you! We will look into it soon.');
      setMessage('');
      onClose();
    } catch {
      toast.error('Could not submit your query — please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Send a query"
        className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface-0)] shadow-2xl p-5"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2.5 mb-1">
          <span className="grid size-9 place-items-center rounded-xl bg-red-500/15 text-red-500">
            <Send size={16} />
          </span>
          <h3 className="text-base font-bold text-[var(--text-primary)] pr-8">Send us a query</h3>
        </div>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          Missing answer, incomplete solution or anything not up to the mark — tell us immediately.
        </p>

        <form onSubmit={submit} className="space-y-3">
          {!user && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-red-500/30"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="Email (optional)"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-red-500/30"
              />
            </div>
          )}
          <textarea
            autoFocus
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your query or the issue with the answer…"
            rows={4}
            required
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-red-500/30"
          />
          <button
            type="submit"
            disabled={!message.trim() || submitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
          >
            <Send size={14} />
            {submitting ? 'Sending…' : 'Send Query'}
          </button>
        </form>
      </div>
    </div>
  );
}
