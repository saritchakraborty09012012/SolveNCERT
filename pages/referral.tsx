import React, { useState, useEffect } from 'react';
import { Gift, Copy, Check, Users, Crown, Share2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function ReferralPage() {
  const { user, isGuest } = useAuthStore();
  const router  = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isGuest) router.replace('/');
  }, [isGuest, router]);

  if (isGuest) return null;

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://solvencert-novexa.pages.dev'}/signup?ref=${user?.referral_code}`;

  async function copyLink() {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Referral link copied!');
  }

  return (
    <Layout title="Referral & Rewards | SolveNCERT" description="Invite friends to SolveNCERT and earn rewards. Share your referral code and unlock premium features together." canonical="/referral">
      <div className="max-w-screen-sm mx-auto px-6 py-12 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 mb-4 shadow-glow-amber">
            <Gift size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-2">Refer & Earn</h1>
          <p className="text-[var(--text-muted)] text-sm">Invite friends and both of you get 1 month premium free!</p>
        </div>

        {/* How it works */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-[var(--text-primary)] text-sm">How it works</h2>
          {[
            { step: '1', text: 'Share your unique referral link with friends.' },
            { step: '2', text: 'Friend signs up using your link.' },
            { step: '3', text: 'You both get 1 month Premium — free!' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0">{step}</span>
              <p className="text-sm text-[var(--text-secondary)]">{text}</p>
            </div>
          ))}
        </div>

        {/* Referral link */}
        <div className="card p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Your Referral Link</p>
          <div className="flex gap-2">
            <div className="flex-1 input-field text-xs font-mono truncate bg-[var(--surface-1)] cursor-default select-all">
              {referralLink}
            </div>
            <button onClick={copyLink} className="btn-primary text-xs px-3 flex-shrink-0">
              {copied ? <Check size={14} className="text-green-300" /> : <Copy size={14} />}
            </button>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] mt-1.5">Code: <strong className="font-mono">{user?.referral_code}</strong></p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-5 text-center">
            <Users size={20} className="mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold text-[var(--text-primary)]">{user?.total_referrals || 0}</p>
            <p className="text-xs text-[var(--text-muted)]">Total Referrals</p>
          </div>
          <div className="card p-5 text-center">
            <Crown size={20} className="mx-auto text-amber-500 mb-2" />
            <p className="text-2xl font-bold text-[var(--text-primary)]">{user?.total_referrals || 0}</p>
            <p className="text-xs text-[var(--text-muted)]">Free Months Earned</p>
          </div>
        </div>

        {/* Share button */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={() => navigator.share({ title: 'SolveNCERT', text: 'Join SolveNCERT — NCERT solutions for CBSE. Get 1 month Premium free!', url: referralLink })}
            className="btn-ghost w-full justify-center text-sm"
          >
            <Share2 size={15} /> Share via Apps
          </button>
        )}
      </div>
    </Layout>
  );
}
