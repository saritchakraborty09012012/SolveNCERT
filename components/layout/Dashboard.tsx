import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  X, BookOpen, Download, Brain, Zap,
  FileText, ClipboardCheck, Bookmark,
  History, Settings, Users, Crown, Gift, Lock, ChevronRight, Home,
  ScanSearch
} from 'lucide-react';
import { BrandLogo, NovexaLogo } from '@/components/ui/Logo';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/helpers';

interface Props { open: boolean; onClose: () => void; onAuthRequest: (m:'login'|'signup') => void; }

const NAV = [
  { id:'answers',  label:'Get Solved Answers', icon:BookOpen,       href:'/answers',       active:true,  desc:'Chapter-wise NCERT book solutions' },
  { id:'books',    label:'Get Book',            icon:Download,       href:'/books',         active:true,  desc:'Download NCERT books free' },
  { id:'ai',       label:'AI Learn',            icon:Brain,          href:'/ai-learn',      active:true,  desc:'AI tutor that explains topics step by step' },
  { id:'checker',  label:'AI Answer Checker',   icon:ScanSearch,     href:'/answer-checker', active:true, desc:'Checks your written answers like a board examiner' },
  { id:'quizzes',  label:'Quizzes',             icon:Zap,            href:'/quizzes',       active:true,  desc:'MCQ questions to test every chapter' },
  { id:'practice', label:'Practice Papers',     icon:FileText,       href:'/practice',      active:true,  desc:'Subjective questions for board-pattern practice' },
  { id:'mock',     label:'Mock Tests',          icon:ClipboardCheck, href:'/mock-tests',    active:false, desc:'Full-length timed test with mixed MCQ + subjective questions' },
];

const USER_NAV = [
  { label:'Bookmarks',  icon:Bookmark, href:'/bookmarks'  },
  { label:'History',    icon:History,  href:'/history'    },
  { label:'Settings',   icon:Settings, href:'/settings'   },
  { label:'Invite',     icon:Users,    href:'/invite'     },
  { label:'Study Room', icon:Users,    href:'/study-room' },
];

export default function Dashboard({ open, onClose, onAuthRequest }: Props) {
  const router            = useRouter();
  const { user, isGuest } = useAuthStore();

  useEffect(() => { onClose(); }, [router.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function locked() { onClose(); onAuthRequest('signup'); }

  return (
    <>
      <div className={cn('fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')} onClick={onClose} />

      <aside className={cn('fixed left-0 top-0 h-full w-72 z-50 flex flex-col bg-[var(--surface-0)] border-r border-[var(--border)] transition-transform duration-300 ease-out',
        open ? 'translate-x-0' : '-translate-x-full')}>

        {/* Header */}
        <div className="ribbon-bg flex items-center justify-between px-4 h-14 border-b border-white/10 flex-shrink-0">
          <BrandLogo size={28} onDark />
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"><X size={16} /></button>
        </div>

        {/* User card */}
        <div className="px-4 py-3 border-b border-[var(--border)] flex-shrink-0">
          {!isGuest && user ? (
            <div className="relative p-3 rounded-2xl overflow-hidden
              bg-gradient-to-br from-blue-50/80 to-indigo-50/60
              dark:from-amber-950/25 dark:to-transparent
              border border-blue-100/80 dark:border-amber-800/25
              shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-blue-400/10 blur-2xl dark:bg-amber-400/10 pointer-events-none" />
              <div className="relative flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-amber-500 dark:to-amber-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden ring-2 ring-white/60 dark:ring-white/10">
                  {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="" /> : <span>{user.initials||'SN'}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.full_name}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                </div>
              </div>
              {user.plan !== 'premium' && (
                <Link href="/premium" className="relative mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 transition-colors">
                  <Crown size={11} /><span>Upgrade to Premium — ₹99/mo</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-none">
              <p className="text-xs text-[var(--text-muted)] mb-2.5">Sign up free to unlock all features</p>
              <div className="flex gap-2">
                <button onClick={() => { onClose(); onAuthRequest('signup'); }} className="flex-1 btn-primary text-xs py-2 justify-center">Sign Up Free</button>
                <button onClick={() => { onClose(); onAuthRequest('login');  }} className="flex-1 btn-ghost   text-xs py-2 justify-center">Log In</button>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {/* Home — always visible */}
          <Link href="/" className={cn('sidebar-item', router.pathname === '/' && 'active')}>
            <Home size={15} /><span>Home</span>{router.pathname === '/' && <ChevronRight size={13} className="ml-auto" />}
          </Link>

          <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] px-2 mt-3 mb-2 font-semibold">Study Tools</p>

          {NAV.map(item => {
            const Icon = item.icon;
            const cur  = router.pathname === item.href;
            return item.active ? (
              <Link key={item.id} href={item.href} className={cn('sidebar-item', cur && 'active')}>
                <Icon size={15} className="flex-shrink-0" />
                <span className="flex flex-col min-w-0">
                  <span>{item.label}</span>
                  {item.desc && <span className="text-[10px] leading-tight text-[var(--text-muted)]">{item.desc}</span>}
                </span>
                {cur && <ChevronRight size={13} className="ml-auto flex-shrink-0" />}
              </Link>
            ) : (
              <button key={item.id} onClick={locked} className="sidebar-item w-full opacity-50">
                <Icon size={15} className="flex-shrink-0" />
                <span className="flex flex-col min-w-0">
                  <span>{item.label}</span>
                  {item.desc && <span className="text-[10px] leading-tight text-[var(--text-muted)]">{item.desc}</span>}
                </span>
                {isGuest && <Lock size={11} className="ml-auto flex-shrink-0 text-[var(--text-muted)]" />}
              </button>
            );
          })}

          <hr className="border-[var(--border)] my-3 mx-1" />
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] px-2 mb-2 font-semibold">Account</p>

          {USER_NAV.map(item => {
            const Icon = item.icon;
            return isGuest ? (
              <button key={item.label} onClick={locked} className="sidebar-item w-full opacity-60">
                <Icon size={15} /><span>{item.label}</span><Lock size={11} className="ml-auto text-[var(--text-muted)]" />
              </button>
            ) : (
              <Link key={item.label} href={item.href} className={cn('sidebar-item', router.pathname === item.href && 'active')}>
                <Icon size={15} /><span>{item.label}</span>
              </Link>
            );
          })}

          {!isGuest && (
            <Link href="/referral" className="sidebar-item text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20">
              <Gift size={15} /><span>Referral & Rewards</span>
            </Link>
          )}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-[var(--text-muted)]">Powered by</span>
          <NovexaLogo size={18} withText />
        </div>
      </aside>
    </>
  );
}

