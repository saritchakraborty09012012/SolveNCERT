import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { submitFeedback, type FeedbackSource } from '@/lib/feedback';
import { cn } from '@/utils/helpers';
import toast from 'react-hot-toast';
import Link from 'next/link';

const MOOD_LABELS: Record<number, string> = {
  1: 'Very Bad', 2: 'Average', 3: 'Considerable', 4: 'Good', 5: 'Excellent',
};

const KEYWORDS_LOW  = ['vulnerable', 'misinformation', 'confusing', 'slow', 'buggy', 'hard to navigate'];
const KEYWORDS_HIGH = ['excellent UI', 'user-friendly', 'accurate', 'fast', 'helpful AI', 'well organized'];

function keywordsFor(rating: number) {
  return rating <= 3 ? KEYWORDS_LOW : KEYWORDS_HIGH;
}

interface ModalProps {
  initialRating: number | null;
  isReprompt?: boolean;
  source?: FeedbackSource;
  onClose: () => void;
}

function FeedbackModal({ initialRating, isReprompt, source = 'general', onClose }: ModalProps) {
  const { user } = useAuthStore();
  const [rating, setRating] = useState<number | null>(initialRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const displayRating = hoverRating ?? rating ?? 0;

  function toggleKeyword(k: string) {
    setSelectedKeywords(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  }

  async function submit() {
    if (!rating || !user) return;
    setSubmitting(true);
    try {
      const ok = await submitFeedback({
        stars: rating,
        source,
        keywords: selectedKeywords,
        text,
      });
      if (ok) {
        toast.success('Thanks for the feedback!');
        onClose();
      } else {
        toast.error('Could not submit right now — try again later.');
        setSubmitting(false);
      }
    } catch {
      toast.error('Could not submit right now — try again later.');
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-[var(--surface-0)] rounded-2xl shadow-2xl w-full max-w-sm p-5 border border-[var(--border)]">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]">
            <X size={16} />
          </button>
          <p className="font-display font-bold text-[var(--text-primary)] mb-2 pr-6">Login to rate</p>
          <p className="text-xs text-[var(--text-muted)] mb-4">Please login to submit your feedback.</p>
          <Link href="/auth" className="btn-primary w-full justify-center block text-center">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--surface-0)] rounded-2xl shadow-2xl w-full max-w-sm p-5 border border-[var(--border)]">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]">
          <X size={16} />
        </button>

        <p className="font-display font-bold text-[var(--text-primary)] mb-1 pr-6">
          {isReprompt ? "You've been with us a while — got a minute?" : 'Rate your experience'}
        </p>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          {isReprompt ? 'Thanks for being a long-time SolveNCERT user. We\'d love to know how it\'s going for you.' : 'Tell us how SolveNCERT is working for you.'}
        </p>

        <div className="flex items-center justify-center gap-1 mb-1">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(null)}
              onClick={() => setRating(n)}
              className="p-1"
            >
              <Star size={28} className={n <= displayRating ? 'text-amber-400' : 'text-[var(--border)]'} fill={n <= displayRating ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
        {displayRating > 0 && (
          <p className="text-center text-xs font-semibold text-amber-500 mb-4">{MOOD_LABELS[displayRating]}</p>
        )}

        {rating !== null && (
          <>
            <div className="flex flex-wrap gap-1.5 justify-center mb-4">
              {keywordsFor(rating).map(k => (
                <button
                  key={k}
                  onClick={() => toggleKeyword(k)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors',
                    selectedKeywords.includes(k)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-[var(--surface-2)] text-[var(--text-secondary)] border-transparent hover:border-[var(--border)]'
                  )}
                >
                  {k}
                </button>
              ))}
            </div>

            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Anything else you'd like to share?"
              rows={3}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />

            <button
              onClick={submit}
              disabled={submitting}
              className="btn-primary w-full justify-center"
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/** Footer star row — parent (Footer) gates rendering on logged-in users. */
export function FeedbackStars() {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [modalRating, setModalRating] = useState<number | null | undefined>(undefined);

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-muted)]">Rate us:</span>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(null)}
              onClick={() => setModalRating(n)}
              title={MOOD_LABELS[n]}
            >
              <Star size={15} className={n <= (hoverRating ?? 0) ? 'text-amber-400' : 'text-[var(--text-muted)]'} fill={n <= (hoverRating ?? 0) ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
      </div>
      {modalRating !== undefined && (
        <FeedbackModal initialRating={modalRating} onClose={() => setModalRating(undefined)} />
      )}
    </>
  );
}

/** Auto re-prompt modal — every 5th visit, logged-in users only. */
export function FeedbackReprompt({ onClose }: { onClose: () => void }) {
  return <FeedbackModal initialRating={null} isReprompt onClose={onClose} />;
}
