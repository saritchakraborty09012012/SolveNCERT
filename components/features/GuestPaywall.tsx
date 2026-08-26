import React from 'react';
import { BookOpen, Bookmark, Users, Infinity, LogIn } from 'lucide-react';

interface Props { onSignUp: () => void; onLogin: () => void; }

export default function GuestPaywall({ onSignUp, onLogin }: Props) {
  return (
    <div className="rounded-2xl overflow-hidden border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-[var(--surface-0)] to-blue-50/50 dark:to-blue-950/20">
      <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500" />
      <div className="p-5 md:p-6">
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center mb-3 shadow-lg shadow-blue-200 dark:shadow-blue-900">
            <BookOpen size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-display font-bold text-[var(--text-primary)] mb-1">Continue to Full Solutions</h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-xs leading-relaxed">
            You&apos;re browsing as a guest. Create a free account to unlock complete NCERT solutions — takes less than 30 seconds.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {[
            { icon: Infinity,  text: 'Unlimited solution access' },
            { icon: Bookmark,  text: 'Save bookmarks & progress' },
            { icon: Users,     text: 'Study Room access'         },
            { icon: BookOpen,  text: 'Free forever'              },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface-0)] border border-[var(--border)]">
              <Icon size={13} className="text-blue-500 flex-shrink-0" />
              <span className="text-xs font-medium text-[var(--text-secondary)]">{text}</span>
            </div>
          ))}
        </div>
        <button onClick={onSignUp} className="btn-primary w-full justify-center text-sm py-2.5 font-bold mb-2.5">
          Create Free Account
        </button>
        <p className="text-center text-sm text-[var(--text-muted)]">
          Already have an account?{' '}
          <button onClick={onLogin} className="text-blue-500 hover:text-blue-600 font-semibold inline-flex items-center gap-1">
            <LogIn size={12} /> Log in
          </button>
        </p>
      </div>
    </div>
  );
}
