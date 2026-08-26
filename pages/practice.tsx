import React, { useEffect } from 'react';
import { ClipboardList, ArrowRight, History, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import { usePracticeStore } from '@/store/practiceStore';
import { useFeedbackStore } from '@/store/feedbackStore';
import PaperCreator from '@/components/practice/PaperCreator';
import PaperSolving from '@/components/practice/PaperSolving';
import ResultDashboard from '@/components/practice/ResultDashboard';
import ExportPanel from '@/components/practice/ExportPanel';
import { cn } from '@/utils/helpers';

function PaperHistory() {
  const { history, setCurrentPaper, setView } = usePracticeStore();

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <History size={32} className="mx-auto mb-3 text-[var(--text-muted)]" />
        <p className="text-sm text-[var(--text-muted)]">No practice papers yet. Create your first one above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {history.slice(0, 10).map((paper) => (
        <button
          key={paper.id}
          onClick={() => { setCurrentPaper(paper); setView('solving'); }}
          className="w-full text-left p-3 rounded-xl bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--brand-primary)]/30 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                {paper.subject} — {paper.chapter}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {paper.question_count} questions · {paper.difficulty} · {new Date(paper.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <ArrowRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] transition-colors" />
          </div>
        </button>
      ))}
    </div>
  );
}

export default function PracticePage() {
  const { user, isGuest, loading: authLoading } = useAuthStore();
  const { view, isGenerating, generationError, setGenerationError, loadHistory } = usePracticeStore();
  const showAiRatingFor = useFeedbackStore(s => s.showAiRatingFor);
  const [showExport, setShowExport] = React.useState(false);

  useEffect(() => {
    if (!isGuest) loadHistory();
  }, [loadHistory, isGuest]);

  useEffect(() => {
    if (view === 'result') showAiRatingFor('ai-practice');
  }, [view, showAiRatingFor]);

  if (authLoading) {
    return (
      <Layout title="Practice Papers | SolveNCERT" description="CBSE Class 9 practice papers for Maths, Science and English." canonical="/practice">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={32} className="animate-spin text-[var(--brand-primary)]" />
        </div>
      </Layout>
    );
  }

  if (isGuest && view === 'create') {
    return (
      <Layout title="Practice Papers | SolveNCERT" description="CBSE Class 9 practice papers for Maths, Science and English." canonical="/practice">
        <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 mb-4">
              <ClipboardList size={24} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)] mb-2">Practice Papers</h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
              Generate chapter-wise practice papers with AI. Strengthen concepts and ace your exams.
            </p>
          </div>

          <PaperCreator />

          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border border-emerald-200 dark:border-emerald-800/30">
            <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm mb-2">Why Practice Papers?</h3>
            <ul className="space-y-1.5 text-xs text-emerald-700 dark:text-emerald-400">
              <li>AI-generated questions aligned with your NCERT syllabus</li>
              <li>Intelligent mix of MCQs, HOTS, Numericals, Case-based and more</li>
              <li>Detailed analytics to track your strengths and weaknesses</li>
              <li>Smart revision system that reintroduces wrong questions</li>
            </ul>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={view === 'result' ? 'Practice Paper Results | SolveNCERT' : 'Practice Paper | SolveNCERT'}
      description="CBSE Class 9 practice papers for Maths, Science and English."
      canonical="/practice"
    >
      <div className="min-h-screen">
        {view === 'create' && (
          <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)]">Create Practice Paper</h1>
                <p className="text-xs text-[var(--text-muted)] mt-1">Choose your subject, chapter and difficulty level</p>
              </div>
              <button
                onClick={() => setShowExport(true)}
                className="p-2 rounded-lg hover:bg-[var(--surface-1)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <History size={18} />
              </button>
            </div>

            <PaperCreator />

            {history.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Recent Papers</h2>
                <PaperHistory />
              </div>
            )}
            <button onClick={() => window.location.href = '/quizzes'} className="mt-6 w-full text-center text-xs font-medium text-amber-500 hover:text-amber-600 transition-colors">Also try Chapter Quizzes for focused practice →</button>
          </div>
        )}

        {view === 'solving' && <PaperSolving />}
        {view === 'result' && <ResultDashboard />}
      </div>

      <ExportPanel isOpen={showExport} onClose={() => setShowExport(false)} />
    </Layout>
  );
}
