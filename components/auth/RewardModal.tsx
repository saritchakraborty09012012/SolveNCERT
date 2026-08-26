import React, { useState } from 'react';
import Link from 'next/link';
import { Gift, Copy, Check, Share2, X, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CONFETTI_COLORS = ['#f59e0b', '#fbbf24', '#fde68a', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#e2c37a', '#38bdf8'];

interface Props {
  referralCode: string;
  onClose: () => void;
}

export default function RewardModal({ referralCode, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://solvencert-novexa.pages.dev'}/signup?ref=${referralCode}`;

  const pieces = React.useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.7,
        duration: 2.6 + Math.random() * 2.4,
        size: 6 + Math.random() * 6,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        round: Math.random() > 0.5,
      })),
    []
  );

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Referral link copied!');
    } catch {
      toast.error('Could not copy automatically. Please copy manually.');
    }
  }

  function share() {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      navigator.share({
        title: 'SolveNCERT',
        text: 'Join SolveNCERT — NCERT solutions for CBSE. Get 2 months Premium free!',
        url: referralLink,
      });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent('Join SolveNCERT — NCERT solutions for CBSE. Get 2 months Premium free! ' + referralLink)}`, '_blank');
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-hidden">
      {/* Confetti layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {pieces.map((p) => (
          <span
            key={p.id}
            className="confetti-piece"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: Math.max(4, p.size * (p.round ? 1 : 0.5)),
              background: p.color,
              borderRadius: p.round ? '50%' : '2px',
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Popup */}
      <div className="reward-glow relative w-full max-w-md bg-[var(--surface-0)] rounded-3xl border-2 border-amber-300/70 dark:border-amber-700/60 overflow-hidden max-h-[92vh] flex flex-col animate-scale-in">
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 flex-shrink-0" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]"
          aria-label="Close reward"
        >
          <X size={16} />
        </button>

        <div className="overflow-y-auto flex-1 p-6 sm:p-7 text-center">
          {/* Gift icon scales in */}
          <div className="reward-pop">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/40 border-2 border-amber-200/80 mb-4">
              <Gift size={34} className="text-white" />
            </div>
          </div>

          {/* Headline */}
          <p className="reward-slide text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500" style={{ animationDelay: '0.4s' }}>
            🎉 You&apos;ve Unlocked a Reward!
          </p>
          <h2 className="reward-slide text-2xl font-display font-bold text-[var(--text-primary)] mt-1.5" style={{ animationDelay: '0.5s' }}>
            🎁 Your Referral Link Is Ready
          </h2>
          <p className="reward-slide text-sm text-[var(--text-muted)] mt-2" style={{ animationDelay: '0.6s' }}>
            Share this link with your friends and earn Premium rewards together.
          </p>

          {/* Referral link appears */}
          <div className="reward-slide mt-5" style={{ animationDelay: '0.75s' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1.5">Your Referral Link</p>
            <div className="flex gap-2">
              <div className="flex-1 input-field text-xs font-mono truncate bg-[var(--surface-1)] cursor-default select-all">
                {referralLink}
              </div>
              <button onClick={copyLink} className="btn-primary text-xs px-3 flex-shrink-0" aria-label="Copy referral link">
                {copied ? <Check size={14} className="text-green-300" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={copyLink} className="btn-ghost flex-1 justify-center text-xs py-2">
                {copied ? <Check size={13} /> : <Copy size={13} />} Copy Link
              </button>
              <button onClick={share} className="btn-ghost flex-1 justify-center text-xs py-2">
                <Share2 size={13} /> Share
              </button>
            </div>
          </div>

          {/* Earn section */}
          <div className="reward-slide mt-6" style={{ animationDelay: '0.9s' }}>
            <p className="text-sm font-bold text-[var(--text-primary)] flex items-center justify-center gap-1.5 mb-1">
              💎 The More Friends You Invite, The More You Earn
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1 mb-3">For every person who signs up using your link:</p>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3 text-center">
                <p className="text-2xl">🎁</p>
                <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-1">You get</p>
                <p className="text-[11px] text-amber-700/80 dark:text-amber-300/70">+1 Month FREE Premium Trial</p>
              </div>
              <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-3 text-center">
                <p className="text-2xl">👤</p>
                <p className="text-[11px] font-bold text-blue-700 dark:text-blue-400 mt-1">They get</p>
                <p className="text-[11px] text-blue-700/80 dark:text-blue-300/70">2 Month FREE Premium Trial Instead of 1</p>
              </div>
            </div>
            <p className="reward-slide text-[11px] text-[var(--text-muted)] text-center mt-3" style={{ animationDelay: '1.05s' }}>
              No limit. Invite as many friends as you want and keep stacking your rewards. 🚀
            </p>
          </div>

          {/* Footer + CTA */}
          <p className="reward-slide text-xs text-[var(--text-secondary)] mt-4" style={{ animationDelay: '1.15s' }}>
            Your friends get Premium. You get Premium. Everyone wins. 💛
          </p>
          <Link
            href="/referral"
            onClick={onClose}
            className="reward-scale btn-primary w-full justify-center text-sm mt-4"
            style={{ animationDelay: '1.25s' }}
          >
            Invite Friends <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}