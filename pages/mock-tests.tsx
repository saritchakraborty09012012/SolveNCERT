import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Trophy, Clock, Target, Brain, ArrowRight, History, BarChart3, AlertTriangle, ChevronRight, TrendingUp, BookOpen, ClipboardCheck } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import TestSetup from '@/components/mock-test/TestSetup';
import ExamInterface from '@/components/mock-test/ExamInterface';
import TestResults from '@/components/mock-test/results/TestResults';
import { useMockTestStore } from '@/store/mockTestStore';
import { useAuthStore } from '@/store/authStore';
import { useFeedbackStore } from '@/store/feedbackStore';

export default function MockTestsPage() {
  const { user, isGuest, loading: authLoading } = useAuthStore();
  const { status } = useMockTestStore();
  const showAiRatingFor = useFeedbackStore(s => s.showAiRatingFor);
  const [stats] = useState({ totalTests: 342, avgTime: '28 min', accuracy: '76%' });

  const showChrome = status !== 'in-progress';

  useEffect(() => {
    if (status === 'submitted') showAiRatingFor('ai-mock-test');
  }, [status, showAiRatingFor]);

  if (authLoading) {
    return (
      <Layout title="Mock Tests | SolveNCERT" description="Full-length CBSE Class 9 mock tests with AI-generated questions, timer, and detailed analysis." canonical="/mock-tests">
        <div className="flex items-center justify-center min-h-[60vh]">
          <ClipboardCheck size={32} className="animate-pulse text-amber-500" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Mock Tests | SolveNCERT"
      description="Full-length CBSE Class 9 mock tests with AI-generated questions, timer, and detailed analysis."
      canonical="/mock-tests"
      noDock={status === 'in-progress'}
      noFooter={status === 'in-progress'}
    >
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 pb-20">
        {status === 'setup' && (
          <>
            {/* Hero */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 sm:p-8 text-white mt-4 sm:mt-6">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold mb-3">
                  <Zap size={11} /> AI-Powered
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">Full-Length Mock Examination</h1>
                <p className="text-sm text-white/80 max-w-md mb-5">
                  Simulate real CBSE examination conditions with AI-generated questions, timer, and comprehensive analysis.
                </p>
                {isGuest && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 text-xs font-medium">
                    <Target size={12} /> Free: 5 tests/day
                    <span className="text-white/60">|</span>
                    <span className="text-white/80">Sign up for unlimited</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-3 sm:gap-5 text-xs mt-3">
                  <div className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5">
                    <Zap size={13} /> {stats.totalTests.toLocaleString()} tests taken
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5">
                    <Clock size={13} /> {stats.avgTime} avg time
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5">
                    <Target size={13} /> {stats.accuracy} avg accuracy
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Stats - logged in only */}
            {!isGuest && user && (
              <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {[
                  { icon: Trophy, label: 'Last Test', value: '—', sub: 'No tests yet', color: 'text-amber-500' },
                  { icon: TrendingUp, label: 'Streak', value: '0 days', sub: 'Start today!', color: 'text-orange-500' },
                  { icon: Target, label: 'Accuracy', value: '—', sub: 'Take a test first', color: 'text-green-500' },
                  { icon: Brain, label: 'Level', value: '1', sub: '0 XP', color: 'text-purple-500' },
                ].map(({ icon: Icon, label, value, sub, color }) => (
                  <div key={label} className="card p-4 group hover:border-[var(--brand-primary)]/30 transition-all">
                    <Icon size={18} className={`${color} mb-2`} />
                    <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide">{label}</p>
                    <p className="text-lg font-bold text-[var(--text-primary)]">{value}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{sub}</p>
                  </div>
                ))}
              </section>
            )}

            {/* Test Creator */}
            <section className="mt-6">
              <TestSetup />
            </section>

            {/* Quick Links - logged in only */}
            {!isGuest && user && (
              <section className="mt-6">
                <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Quick Links</h2>
                <div className="space-y-2">
                  {[
                    { icon: History, label: 'View History', desc: 'Review your past mock test attempts and scores' },
                    { icon: BarChart3, label: 'Analytics', desc: 'Detailed performance insights and trends' },
                    { icon: BookOpen, label: 'Wrong Questions Review', desc: 'Revisit questions you got wrong' },
                  ].map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="card p-4 flex items-center justify-between group hover:border-[var(--brand-primary)]/30 transition-all">
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
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="text-center mt-8">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Also try <Link href="/quizzes" className="font-medium" style={{ color: 'var(--brand-primary)' }}>Chapter Quizzes</Link> for focused practice on specific topics.</p>
            </div>
          </>
        )}

        {status === 'in-progress' && <ExamInterface />}
        {status === 'review' && <ExamInterface reviewMode />}
        {status === 'submitted' && <TestResults />}
        {status === 'results' && <TestResults />}
      </div>
    </Layout>
  );
}
