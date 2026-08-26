import React, { useState } from 'react';
import { Flag, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface Props {
  reportedContent: string; // the answer/reply text (or a short reference to it)
  onGuestBlock: () => void;
}

export default function ReportFlag({ reportedContent, onGuestBlock }: Props) {
  const { user, isGuest } = useAuthStore();
  const [step, setStep] = useState<'idle' | 'confirm' | 'reason'>('idle');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function open() {
    if (isGuest || !user) { onGuestBlock(); return; }
    setStep('confirm');
  }

  async function submit() {
    if (!user || !reason.trim()) return;
    setSubmitting(true);
    try {
      await supabase.from('reports').insert({
        user_id: user.id,
        user_name: user.full_name || 'Unknown',
        user_email: user.email,
        reported_content: reportedContent,
        reason: reason.trim(),
      });
      toast.success('Report submitted — thanks for flagging this.');
      setStep('idle'); setReason('');
    } catch {
      toast.error('Could not submit report — try again later.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button onClick={open} title="Report this" className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-red-500 transition-colors">
        <Flag size={13} />
      </button>

      {step === 'confirm' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setStep('idle')} />
          <div className="relative bg-[var(--surface-0)] rounded-2xl shadow-2xl w-full max-w-sm p-5 border border-[var(--border)]">
            <p className="font-semibold text-[var(--text-primary)] mb-2">Report this content?</p>
            <p className="text-sm text-[var(--text-secondary)] mb-5">Reporting will send this answer/AI reply to our organization for review. Do you agree?</p>
            <div className="flex gap-2">
              <button onClick={() => setStep('idle')} className="flex-1 px-4 py-2 rounded-xl bg-[var(--surface-2)] text-[var(--text-secondary)] text-sm font-semibold">Cancel</button>
              <button onClick={() => setStep('reason')} className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold">Yes</button>
            </div>
          </div>
        </div>
      )}

      {step === 'reason' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setStep('idle')} />
          <div className="relative bg-[var(--surface-0)] rounded-2xl shadow-2xl w-full max-w-sm p-5 border border-[var(--border)]">
            <button onClick={() => setStep('idle')} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]"><X size={16} /></button>
            <p className="font-semibold text-[var(--text-primary)] mb-3 pr-6">Why are you reporting this?</p>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Describe the issue…"
              rows={3}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-red-500/30"
            />
            <button
              onClick={submit}
              disabled={!reason.trim() || submitting}
              className="w-full px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold"
            >
              {submitting ? 'Submitting…' : 'Submit Report'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
