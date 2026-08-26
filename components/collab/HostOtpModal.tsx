import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Loader2, Mail, RotateCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

/**
 * One-time 6-digit OTP for HOSTS.
 * Uses Supabase Auth signInWithOtp — when "Email OTP" is enabled in
 * Supabase Dashboard → Authentication → Email, this sends a 6-digit
 * code to Gmail inbox (NOT a magic link).
 * If "Email OTP" is OFF, it sends a magic link — fix by enabling
 * "Email OTP" in dashboard.
 */
export default function HostOtpModal({ onVerified, onClose }: { onVerified: () => void; onClose: () => void }) {
  const { user, fetchProfile } = useAuthStore();
  const [stage, setStage] = useState<'send' | 'code'>('send');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const [emailSent, setEmailSent] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (resendIn <= 0) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => setResendIn(v => (v <= 1 ? 0 : v - 1)), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resendIn]);

  async function sendOtp(isResend = false) {
    if (!user?.email) return;
    setBusy(true); setError('');
    try {
      const { error: otpErr } = await supabase.auth.signInWithOtp({ email: user.email });
      if (otpErr) {
        setError(`Could not send OTP: ${otpErr.message}`);
        return;
      }
      setStage('code');
      setEmailSent(user.email);
      setResendIn(60);
      toast.success(`OTP sent to ${user.email} — check inbox (spam too)`);
    } catch {
      setError('Network error. Check connection and try again.');
    } finally { setBusy(false); }
  }

  async function verify() {
    if (!user?.email || code.trim().length !== 6) { setError('Enter the 6-digit code.'); return; }
    setBusy(true); setError('');
    try {
      console.log('[OTP Verify] Calling verifyOtp with:', { email: user.email, token: code.trim(), type: 'email' });
      const { error: verifyErr, data } = await supabase.auth.verifyOtp({
        email: user.email,
        token: code.trim(),
        type: 'email',
      });
      console.log('[OTP Verify] Result:', { error: verifyErr, data });
      if (verifyErr) {
        const msg = verifyErr.message || '';
        console.error('[OTP Verify] Error:', msg);
        if (msg.includes('expired') || msg.includes('invalid') || msg.includes('otp')) {
          setError('Wrong or expired code. Try resend.');
        } else {
          setError(`Verify failed: ${msg}`);
        }
        return;
      }
      const { error: updErr } = await supabase.from('profiles').update({ email_verified: true }).eq('id', user.id);
      if (updErr) {
        setError(`OTP verified but couldn't save: ${updErr.message}`);
        return;
      }
      await fetchProfile(user.id);
      toast.success('Email verified!');
      onVerified();
    } catch (e) {
      console.error('[OTP Verify] Catch:', e);
      setError('Something went wrong. Try again.');
    } finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-sm rounded-t-2xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface-0)] shadow-2xl p-6">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]"><X size={16} /></button>
        <div className="flex items-center gap-2.5 mb-2">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500"><ShieldCheck size={18} /></span>
          <h3 className="text-base font-bold text-[var(--text-primary)] pr-8">Verify it&apos;s you</h3>
        </div>
        <p className="text-xs text-[var(--text-muted)] mb-4">For security, hosts verify email once — 6-digit OTP sent to your Gmail.</p>
        {stage === 'send' ? (
          <button onClick={() => sendOtp(false)} disabled={busy} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm font-semibold">
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />} Send OTP to Gmail
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[var(--text-muted)] text-center">OTP sent to <span className="font-semibold text-[var(--text-primary)]">{emailSent}</span></p>
            <input autoFocus value={code} onChange={(e) => { setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6)); setError(''); }} onKeyDown={(e) => e.key === 'Enter' && verify()} placeholder="6-digit code" maxLength={6} className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2.5 text-sm text-center tracking-[0.3em] font-semibold text-[var(--text-primary)] placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
            <button onClick={verify} disabled={busy || code.length !== 6} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm font-semibold">
              {busy && <Loader2 size={14} className="animate-spin" />} Verify & continue
            </button>
            <button onClick={() => sendOtp(true)} disabled={busy || resendIn > 0} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-40">
              <RotateCcw size={12} />{resendIn > 0 ? `Resend OTP in ${resendIn}s` : 'Resend OTP'}
            </button>
          </div>
        )}
        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}