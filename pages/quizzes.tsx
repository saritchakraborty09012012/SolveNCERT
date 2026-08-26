import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Trophy, Clock, Target, Brain, ArrowRight, History, BarChart3, Sparkles, ChevronRight, TrendingUp, BookOpen } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import QuizCreator from '@/components/quiz/QuizCreator';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import Router from 'next/router';

export default function QuizzesPage() {
  const { user, isGuest, loading: authLoading } = useAuthStore();
  const [stats] = useState({ totalQuestions: 1247, avgTime: '8 min', concepts: 89 });
  const [recentQuiz, setRecentQuiz] = useState<{ score: number; total: number; subject: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !isGuest && user) {
      setRecentQuiz({ score: 8, total: 10, subject: 'Mathematics' });
    }
  }, [authLoading, isGuest, user]);

  const handleQuizGenerated = (attemptId: string) => {
    Router.push(`/quizzes/${attemptId}`);
  };

  if (authLoading) {
    return (
      <Layout title="Quizzes | SolveNCERT" description="Test your NCERT concepts with intelligent AI-powered quizzes for CBSE Class 9." canonical="/quizzes">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Zap size={32} className="animate-pulse text-amber-500" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Quizzes | SolveNCERT" description="Test your NCERT concepts with intelligent AI-powered quizzes for CBSE Class 9." canonical="/quizzes">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 pb-20">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 sm:p-8 text-white mt-4 sm:mt-6">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold mb-3">
              <Sparkles size={11} /> AI-Powered
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">Intelligent Concept Assessment</h1>
            <p className="text-sm text-white/80 max-w-md mb-5">
              Quick concept-check quizzes tailored to your NCERT syllabus. Test yourself chapter by chapter.
            </p>
            {isGuest && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 text-xs font-medium">
                <Target size={12} /> Free: 5 quizzes/day
                <span className="text-white/60">|</span>
                <span className="text-white/80">Sign up for unlimited</span>
              </div>
            )}
            <div className="flex flex-wrap gap-3 sm:gap-5 text-xs mt-3">
              <div className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5">
                <Zap size={13} /> {stats.totalQuestions.toLocaleString()} questions generated
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5">
                <Clock size={13} /> {stats.avgTime} avg time
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5">
                <Target size={13} /> {stats.concepts} concepts covered
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats - logged in only */}
        {!isGuest && user && (
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              {
                icon: Trophy,
                label: 'Last Quiz',
                value: recentQuiz ? `${recentQuiz.score}/${recentQuiz.total}` : '—',
                sub: recentQuiz ? recentQuiz.subject : 'No quizzes yet',
                link: recentQuiz ? '/quizzes/history' : undefined,
                color: 'text-amber-500',
              },
              {
                icon: TrendingUp,
                label: 'Streak',
                value: '3 days',
                sub: 'Keep it up!',
                color: 'text-orange-500',
              },
              {
                icon: Target,
                label: 'Accuracy',
                value: '82%',
                sub: 'Across all quizzes',
                color: 'text-green-500',
              },
              {
                icon: Brain,
                label: 'Level',
                value: '12',
                sub: '2,450 XP',
                color: 'text-purple-500',
              },
            ].map(({ icon: Icon, label, value, sub, link, color }) => (
              <div key={label} className="card p-4 group hover:border-[var(--brand-primary)]/30 transition-all">
                {link ? (
                  <Link href={link} className="block">
                    <Icon size={18} className={`${color} mb-2`} />
                    <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">{label}</p>
                    <p className="text-lg font-bold text-[var(--text-primary)]">{value}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{sub}</p>
                  </Link>
                ) : (
                  <>
                    <Icon size={18} className={`${color} mb-2`} />
                    <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">{label}</p>
                    <p className="text-lg font-bold text-[var(--text-primary)]">{value}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{sub}</p>
                  </>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Quiz Creator */}
        <section className="mt-6">
          <QuizCreator onQuizGenerated={handleQuizGenerated} />
        </section>

        {/* Quick Links - logged in only */}
        {!isGuest && user && (
          <section className="mt-6">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Quick Links</h2>
            <div className="space-y-2">
              {[
                { href: '/quizzes/history', icon: History, label: 'View History', desc: 'Review your past quiz attempts and scores' },
                { href: '/quizzes/analytics', icon: BarChart3, label: 'Analytics', desc: 'Detailed performance insights and trends' },
                { href: '/quizzes/wrong-questions', icon: BookOpen, label: 'Wrong Questions Review', desc: 'Revisit questions you got wrong' },
              ].map(({ href, icon: Icon, label, desc }) => (
                <Link key={href} href={href} className="card p-4 flex items-center justify-between group hover:border-[var(--brand-primary)]/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--surface-0)] flex items-center justify-center border border-[var(--border)]">
                      <Icon size={16} className="text-[var(--brand-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">{label}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] transition-colors" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
