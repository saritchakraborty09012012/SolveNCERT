import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import QuestionCard from '@/components/quiz/QuestionCard';
import QuizTimer from '@/components/quiz/QuizTimer';
import QuizProgress from '@/components/quiz/QuizProgress';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, SkipForward, AlertTriangle, Flag } from 'lucide-react';
import toast from 'react-hot-toast';

function isAnswerCorrect(student: string, correct: string, options?: string[]): boolean {
  if (!student || !correct) return false;
  const s = student.trim().toLowerCase();
  const c = correct.trim().toLowerCase();
  if (s === c) return true;
  const sM = s.match(/^([a-d])[\.\)\s]/);
  const cM = c.match(/^([a-d])[\.\)\s]/);
  if (sM && cM) return sM[1] === cM[1];
  if (sM && options) {
    const opt = (options[sM[1].charCodeAt(0) - 97] || '').trim().toLowerCase().replace(/^[a-d][\.\)\s]\s*/, '');
    if (opt && (opt === c.replace(/^[a-d][\.\)\s]\s*/, '') || opt === c)) return true;
  }
  if (cM && options) {
    const opt = (options[cM[1].charCodeAt(0) - 97] || '').trim().toLowerCase().replace(/^[a-d][\.\)\s]\s*/, '');
    if (opt && (s === opt || s === (options[cM[1].charCodeAt(0) - 97] || '').trim().toLowerCase())) return true;
  }
  const sStr = s.replace(/^[a-d][\.\)\s]\s*/, '');
  const cStr = c.replace(/^[a-d][\.\)\s]\s*/, '');
  return sStr.length > 0 && sStr === cStr;
}

export default function QuizPage() {
  const router = useRouter();
  const { id } = router.query;
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [skippedMap, setSkippedMap] = useState<Record<string, boolean>>({});
  const [markedMap, setMarkedMap] = useState<Record<string, boolean>>({});
  const [timeTaken, setTimeTaken] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isGuestQuiz, setIsGuestQuiz] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const cached = typeof window !== 'undefined' ? sessionStorage.getItem('sn_quiz_' + id) : null;
        if (cached) {
          const p = JSON.parse(cached);
          if (!cancelled) {
            setAttempt(p.attempt);
            setQuestions(p.questions || []);
            setIsGuestQuiz(true);
            setLoading(false);
          }
          return;
        }
        const { data, error } = await supabase.from('quiz_attempts').select('*').eq('id', id).single();
        if (error) throw error;
        const { data: qData } = await supabase.from('quiz_questions').select('*').eq('attempt_id', id).order('question_index');
        if (!cancelled) {
          setAttempt({
            id: data.id,
            subject: data.subject,
            book: data.book,
            chapter: data.chapter,
            difficulty: data.difficulty,
            totalQuestions: data.total_questions,
            timeLimitSeconds: data.time_limit_seconds,
            status: data.status,
          });
          setQuestions((qData || []).map((q: any) => ({
            id: q.id,
            index: q.question_index,
            type: q.question_type,
            text: q.question_text,
            options: q.options || [],
            correctAnswer: q.correct_answer,
            explanation: q.explanation || '',
            relatedConcept: q.related_concept || '',
            revisionTip: q.revision_tip || '',
            difficulty: q.difficulty || 'moderate',
            topic: q.topic || '',
            marks: q.marks || 1,
          })));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          toast.error('Failed to load quiz');
          router.push('/quizzes');
        }
      }
    })();
    return () => { cancelled = true; };
  }, [id, router]);

  useEffect(() => {
    if (!id) return;
    const saved = sessionStorage.getItem('quiz_progress_' + id);
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setAnswers(p.answers || {});
        setSkippedMap(p.skipped || {});
        setMarkedMap(p.marked || {});
        setCurrentIndex(p.currentIndex || 0);
        setTimeTaken(p.timeTaken || 0);
      } catch {}
    }
  }, [id]);

  const handleAnswer = useCallback((qId: string, answer: string) => {
    setAnswers(p => ({ ...p, [qId]: answer }));
    setSkippedMap(p => ({ ...p, [qId]: false }));
  }, []);

  const toggleMark = useCallback(() => {
    const q = questions[currentIndex];
    if (!q) return;
    setMarkedMap(p => ({ ...p, [q.id]: !p[q.id] }));
  }, [currentIndex, questions]);

  const handleSkip = useCallback(() => {
    const q = questions[currentIndex];
    if (!q) return;
    setSkippedMap(p => ({ ...p, [q.id]: true }));
    if (currentIndex < questions.length - 1) setCurrentIndex(i => i + 1);
  }, [currentIndex, questions]);

  const handleSubmit = useCallback(async () => {
    if (submitting || !attempt || submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      if (isGuestQuiz) {
        const graded = questions.map(q => {
          const sa = answers[q.id] || '';
          const skipped = !!skippedMap[q.id] || !sa.trim();
          const correct = !skipped && isAnswerCorrect(sa, q.correctAnswer, q.options);
          return { ...q, studentAnswer: sa || null, isSkipped: skipped, isCorrect: correct };
        });
        const correctCount = graded.filter(q => q.isCorrect).length;
        const incorrectCount = graded.filter(q => !q.isSkipped && !q.isCorrect).length;
        const skippedCount = graded.filter(q => q.isSkipped).length;
        const totalMarks = graded.reduce((s, q) => s + (q.marks || 1), 0) || 1;
        const earned = graded.filter(q => q.isCorrect).reduce((s, q) => s + (q.marks || 1), 0);
        const results = {
          attempt: {
            id: attempt.id,
            userId: 'guest',
            classNum: 9,
            subject: attempt.subject,
            book: attempt.book || '',
            chapter: attempt.chapter,
            difficulty: attempt.difficulty,
            totalQuestions: questions.length,
            correctCount,
            incorrectCount,
            skippedCount,
            score: earned,
            percentage: Math.round((earned / totalMarks) * 100),
            timeTakenSeconds: timeTaken,
            timeLimitSeconds: attempt.timeLimitSeconds,
            questionTypes: [],
            status: 'completed',
            questions: [],
          },
          questions: graded,
        };
        sessionStorage.setItem('sn_quiz_results_' + id, JSON.stringify(results));
        sessionStorage.removeItem('sn_quiz_' + id);
        sessionStorage.removeItem('quiz_progress_' + id);
        router.push('/quizzes/' + id + '/results');
        return;
      }

      const entries = questions.map(q => ({ questionId: q.id, answer: answers[q.id] || '', timeSpent: 0 }));
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId: attempt.id, answers: entries, timeTaken }),
      });
      if (!res.ok) throw new Error('Submit failed');
      sessionStorage.removeItem('quiz_progress_' + id);
      router.push('/quizzes/' + id + '/results');
    } catch {
      toast.error('Failed to submit quiz');
      submittedRef.current = false;
      setSubmitting(false);
    }
  }, [attempt, answers, skippedMap, timeTaken, id, router, submitting, questions, isGuestQuiz]);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-muted)]">Loading quiz...</p>
        </div>
      </Layout>
    );
  }

  if (!attempt) return null;

  const currentQ = questions[currentIndex];
  const total = questions.length;
  const answeredCount = Object.keys(answers).filter(k => answers[k] && !skippedMap[k]).length;
  const questionIds = questions.map(q => q.id);
  const progressAnswers: Record<string, { answer: string; isSkipped: boolean }> = {};
  questionIds.forEach(qid => {
    progressAnswers[qid] = { answer: answers[qid] || '', isSkipped: !!skippedMap[qid] };
  });

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/quizzes')} className="p-2 rounded-xl hover:bg-[var(--surface-2)] transition-colors" style={{ color: 'var(--text-primary)' }}>
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate capitalize" style={{ color: 'var(--text-primary)' }}>{attempt.subject}</p>
            {attempt.chapter && <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{attempt.chapter}</p>}
          </div>
          <QuizTimer totalSeconds={attempt.timeLimitSeconds || total * 60} onTimeUp={handleSubmit} onTick={(r: number) => setTimeTaken((attempt.timeLimitSeconds || total * 60) - r)} />
        </div>

        <QuizProgress total={total} current={currentIndex} answers={progressAnswers} questionIds={questionIds} onNavigate={setCurrentIndex} />

        {currentQ && (
          <div className="p-6 rounded-2xl border" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}>
            <QuestionCard
              question={currentQ}
              currentIndex={currentIndex}
              total={total}
              onAnswer={handleAnswer}
              onSkip={handleSkip}
              onNavigate={setCurrentIndex}
              answer={answers[currentQ.id] || ''}
              marked={!!markedMap[currentQ.id]}
              onToggleMark={toggleMark}
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(i => i - 1)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all disabled:opacity-40"
            style={{ background: 'var(--surface-0)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
            <ArrowLeft size={14} /> Previous
          </button>
          <button onClick={handleSkip}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all"
            style={{ background: 'var(--surface-0)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            <SkipForward size={14} /> Skip
          </button>
          {currentIndex < total - 1 ? (
            <button onClick={() => setCurrentIndex(i => i + 1)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--brand-primary)', color: '#fff' }}>
              Next
            </button>
          ) : (
            <button onClick={() => setShowSubmitModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all"
              style={{ background: 'var(--brand-primary)', color: '#fff' }}>
              Submit Quiz
            </button>
          )}
        </div>

        <button onClick={() => setShowReview(!showReview)}
          className="flex items-center gap-2 text-sm font-medium mx-auto px-4 py-2 rounded-xl border transition-all"
          style={{ background: 'var(--surface-0)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <AlertTriangle size={14} /> Review ({answeredCount}/{total} answered)
        </button>

        {showReview && (
          <div className="p-4 rounded-2xl border" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Review Before Submission</h3>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, i) => {
                const hasAnswer = !!answers[q.id] && !skippedMap[q.id];
                const marked = !!markedMap[q.id];
                return (
                  <button key={q.id} onClick={() => { setCurrentIndex(i); setShowReview(false); }}
                    className="w-9 h-9 rounded-lg text-xs font-bold transition-all hover:scale-110 relative"
                    style={{
                      background: marked ? '#a855f7' : i === currentIndex ? 'var(--brand-primary)' : hasAnswer ? '#22c55e' : skippedMap[q.id] ? '#f59e0b' : 'var(--surface-2)',
                      color: marked || i === currentIndex || hasAnswer ? '#fff' : 'var(--text-muted)',
                      outline: marked && i !== currentIndex ? '2px solid #a855f7' : 'none',
                      outlineOffset: '1px',
                    }}>
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-4 mt-3 text-xs flex-wrap" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Answered</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Skipped</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Marked</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--surface-2)' }} /> Unanswered</span>
            </div>
          </div>
        )}

        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowSubmitModal(false)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm p-6 rounded-2xl border" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }} onClick={e => e.stopPropagation()}>
              <AlertTriangle size={32} className="mx-auto mb-3 text-amber-500" />
              <h3 className="text-lg font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>Submit Quiz?</h3>
              <p className="text-sm text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
                You have answered {answeredCount} out of {total} questions.
                {answeredCount < total && ` ${total - answeredCount} questions are unanswered.`}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowSubmitModal(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all"
                  style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>Go Back</button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: submitting ? 'var(--surface-2)' : 'var(--brand-primary)', color: submitting ? 'var(--text-muted)' : '#fff' }}>
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
