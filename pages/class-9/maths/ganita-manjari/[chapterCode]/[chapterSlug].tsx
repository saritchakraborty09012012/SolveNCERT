import React, { useState, useRef } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { ChevronRight, BookOpen, Home, Download, Copy, Check } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import BackToTop from '@/components/features/BackToTop';
import ReadAloud from '@/components/features/ReadAloud';
import AIFollowUp from '@/components/features/AIFollowUp';
import GuestPaywall from '@/components/features/GuestPaywall';
import QuestionNav from '@/components/features/QuestionNav';
import BookmarkButton from '@/components/features/BookmarkButton';
import ThumbsRating from '@/components/features/ThumbsRating';
import ReportFlag from '@/components/features/ReportFlag';
import AuthModal from '@/components/auth/AuthModal';
import { MATHS_SOURCE_CHAPTERS, type MathsSourceQuestion, type MathsSourceExercise } from '@/lib/content-maths-source';
import { useAuthStore } from '@/store/authStore';
import { hasReachedGuestLimit, incrementSolutionView } from '@/lib/guestLimits';
import { cn, getSubjectBackground } from '@/utils/helpers';

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function go() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={go} className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-medium transition-all',
      copied ? 'bg-green-100 dark:bg-green-900/30 text-green-600 border-green-200' : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-transparent hover:border-[var(--border)]')}>
      {copied ? <Check size={11} /> : <Copy size={11} />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

function NotebookQuestion({ q, exercise, chapter, onGuestBlock, guestBlocked }: {
  q: MathsSourceQuestion; exercise: MathsSourceExercise;
  chapter: { code: string; slug: string; title: string; number: number };
  onGuestBlock: () => void; guestBlocked: boolean;
}) {
  const ctx = `Maths Question ${q.number}: ${q.plainText}`;
  return (
    <div className="question-block" id={`q-${exercise.id}-${q.id}`}>
      <div className="ganita-notebook">
        <div className="qcard">
          <div className="qhead" dangerouslySetInnerHTML={{ __html: q.head }} />
          {guestBlocked ? (
            <div className="qbody">
              <GuestPaywall onSignUp={onGuestBlock} onLogin={onGuestBlock} />
            </div>
          ) : (
            <div className="qbody" dangerouslySetInnerHTML={{ __html: q.body }} />
          )}
        </div>

        {!guestBlocked && (
          <>
            <div className="flex items-center justify-between gap-2 flex-wrap mt-2 px-1">
              <div className="answer-actions">
                <ReadAloud text={q.plainText} size="sm" />
                <CopyBtn text={q.plainText} />
                <BookmarkButton
                  subject="maths" chapterCode={chapter.code} chapterSlug={chapter.slug} chapterTitle={chapter.title}
                  questionId={`${exercise.id}-${q.id}`} questionNumber={q.number.replace(/\u2605/g, '')} questionText={q.plainText}
                  onGuestBlock={onGuestBlock}
                />
              </div>
              <ReportFlag reportedContent={q.plainText} onGuestBlock={onGuestBlock} />
            </div>
            <ThumbsRating subject="maths" chapterNumber={chapter.number} exerciseLabel={exercise.title} itemKey={`${exercise.id}-${q.id}`} />
          </>
        )}
      </div>
      <AIFollowUp context={ctx} subject="maths" chapterNumber={chapter.number} exerciseLabel={exercise.title} itemKey={`${exercise.id}-${q.id}`} onGuestBlock={onGuestBlock} />
    </div>
  );
}

interface PageProps { chapterCode: string; chapterSlug: string; }

export default function MathsChapterPage({ chapterCode, chapterSlug }: PageProps) {
  const chapter = MATHS_SOURCE_CHAPTERS.find(c => c.code === chapterCode && c.slug === chapterSlug);
  const [selEx, setSelEx] = useState<string>('all');
  const [guestBlocked, setGuestBlocked] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const { isGuest } = useAuthStore();
  const viewCounted = useRef(false);

  React.useEffect(() => {
    if (isGuest && !viewCounted.current) {
      viewCounted.current = true;
      incrementSolutionView();
      setGuestBlocked(hasReachedGuestLimit());
    }
    if (!isGuest) setGuestBlocked(false);
  }, [isGuest]);

  async function downloadPDF() {
    if (!chapter) return;
    const { jsPDF } = await import('jspdf');
    const exercises = selEx === 'all' ? chapter.exercises : chapter.exercises.filter(e => e.id === selEx);
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 48;
    const write = (line: string) => { if (y > 790) { pdf.addPage(); y = 48; } pdf.text(line, 48, y); y += 16; };
    pdf.setFontSize(16); pdf.text(`Chapter ${chapter.number}: ${chapter.title}`, 48, y); y += 20;
    pdf.setFontSize(10);
    write('Class 9 Maths · Ganita Manjari Part I · NCERT 2026 Revised Syllabus');
    y += 10;
    exercises.forEach(ex => {
      pdf.setFontSize(13); write(ex.title); pdf.setFontSize(10); y += 6;
      ex.questions.forEach(q => {
        const lines = pdf.splitTextToSize(`Q${q.number.replace(/\u2605/g, '')}. ${q.plainText}`, 510);
        lines.forEach((l: string) => write(l));
        y += 6;
      });
      y += 8;
    });
    pdf.setFontSize(9);
    write('SolveNCERT — Powered by NOVEXA | solvencert · NCERT 2026 Revised Syllabus');
    pdf.save(`class-9-maths-${chapter.code}-${selEx === 'all' ? 'all-exercises' : selEx}-solutions.pdf`);
  }

  if (!chapter) {
    return (
      <Layout title="Chapter Not Found | SolveNCERT" description="The requested chapter could not be found. Browse all NCERT solutions for Class 9.">
        <div className="max-w-screen-md mx-auto px-6 py-20 text-center">
          <p className="text-[var(--text-muted)]">Chapter not found.</p>
          <Link href="/class-9/maths/ganita-manjari" className="btn-primary mt-4 inline-flex">Browse Maths</Link>
        </div>
      </Layout>
    );
  }

  const exercises = selEx === 'all' ? chapter.exercises : chapter.exercises.filter(e => e.id === selEx);
  const totalQ = chapter.exercises.reduce((a, ex) => a + ex.questions.length, 0);
  const BASE = 'https://solvencert-novexa.vercel.app';
  const chapterUrl = `${BASE}/class-9/maths/ganita-manjari/${chapterCode}/${chapterSlug}`;
  const chapterCodeUpper = chapter.code.toUpperCase();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'NCERT Solutions', item: `${BASE}/answers` },
      { '@type': 'ListItem', position: 3, name: 'Class 9 Maths', item: `${BASE}/class-9/maths/ganita-manjari` },
      { '@type': 'ListItem', position: 4, name: chapter.title, item: chapterUrl },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Chapter ${chapter.number}: ${chapter.title} (${chapterCodeUpper})`,
    description: `NCERT Solutions for Class 9 Maths Chapter ${chapter.number} (${chapterCodeUpper}): ${chapter.title}. Step-by-step notebook-style answers — CBSE 2026 Revised Syllabus.`,
    keywords: `${chapterCodeUpper}, ${chapter.code}, class 9 maths, NCERT solutions, Ganita Manjari, chapter ${chapter.number}`,
    author: { '@type': 'Organization', name: 'SolveNCERT by NOVEXA' },
    publisher: { '@type': 'Organization', name: 'SolveNCERT by NOVEXA', url: BASE },
    url: chapterUrl,
    identifier: chapterCodeUpper,
    about: { '@type': 'Chapter', name: chapter.title, position: chapter.number, code: chapterCodeUpper },
    isPartOf: { '@type': 'Book', name: 'Ganita Manjari Part I', isbn: 'NCERT Class 9 Maths' },
  };

  return (
    <Layout
      title={`${chapter.title} — ${chapterCodeUpper} | Class 9 Maths NCERT Solutions`}
      description={`NCERT Solutions for Class 9 Maths Chapter ${chapter.number} (${chapterCodeUpper}): ${chapter.title}. Step-by-step notebook-style answers for every exercise with diagrams and boxed solutions — CBSE 2026 Revised Syllabus (Ganita Manjari Part I).`}
      canonical={`/class-9/maths/ganita-manjari/${chapterCode}/${chapterSlug}`}
      ogType="article"
      schema={[breadcrumbSchema, articleSchema]}
      bgImage={getSubjectBackground('maths', chapter.number)}
      keywords={`${chapterCodeUpper}, ${chapter.code}, class 9 maths NCERT solutions, Ganita Manjari chapter ${chapter.number}, ${chapter.title} solutions, CBSE 2026 maths`}
    >
      {/* Breadcrumb */}
      <div className="sticky top-14 z-30 bg-[var(--surface-0)]/95 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-screen-lg mx-auto px-4 md:px-6 py-2.5 flex items-center gap-1.5 text-xs text-[var(--text-muted)] overflow-x-auto scrollbar-hide whitespace-nowrap">
          <Link href="/" className="hover:text-blue-500 flex items-center gap-1 flex-shrink-0"><Home size={11} />Home</Link>
          <ChevronRight size={10} className="flex-shrink-0" />
          <Link href="/answers" className="hover:text-blue-500 flex-shrink-0">Solutions</Link>
          <ChevronRight size={10} className="flex-shrink-0" />
          <Link href="/class-9/maths/ganita-manjari" className="hover:text-blue-500 flex-shrink-0">Maths</Link>
          <ChevronRight size={10} className="flex-shrink-0" />
          <span className="text-[var(--text-secondary)] font-semibold flex-shrink-0">Ch {chapter.number}</span>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex gap-7">
          {/* Sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-28 card p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Chapters</p>
              <nav className="space-y-0.5 max-h-[65vh] overflow-y-auto scrollbar-hide">
                {MATHS_SOURCE_CHAPTERS.map(ch => (
                  <Link key={ch.slug} href={`/class-9/maths/ganita-manjari/${ch.code}/${ch.slug}`}
                    className={cn('flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors',
                      ch.slug === chapterSlug ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold' : 'text-[var(--text-muted)] hover:bg-[var(--surface-1)]')}>
                    <span className="w-5 h-5 rounded bg-[var(--surface-2)] text-[10px] font-bold flex items-center justify-center flex-shrink-0">{ch.number}</span>
                    <span className="truncate leading-tight">{ch.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            <div className="mb-6 page-intro p-6 rounded-[2rem] border border-[var(--border)]">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-bold">Class 9 · Maths</span>
                <span className="badge-2026">NCERT 2026 Revised Syllabus</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--text-primary)] leading-tight">Chapter {chapter.number}: {chapter.title} <span className="text-lg md:text-xl font-normal text-[var(--text-muted)]">({chapter.code.toUpperCase()})</span></h1>
              <p className="text-sm text-[var(--text-muted)] mt-2">Ganita Manjari Part I · {totalQ} questions · {chapter.exercises.length} exercises</p>
              <p className="text-xs text-[var(--text-muted)] mt-4">Chapter code: <span className="font-mono font-semibold text-[var(--text-secondary)]">{chapter.code}</span> · Book: Ganita Manjari Part I · Class 9 Maths</p>
            </div>

            {/* Exercise selector + download */}
            <div className="mb-5">
              {chapter.exercises.length > 1 && (
                <div className="mb-3">
                  <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Jump to:</span>
                  <div className="section-nav mt-2">
                    <button onClick={() => setSelEx('all')} className={cn('method-tab section-nav-button text-xs', selEx === 'all' ? 'method-tab-active' : 'method-tab-inactive')}>All Exercises</button>
                    {chapter.exercises.map(ex => (
                      <button key={ex.id} onClick={() => setSelEx(ex.id)} className={cn('method-tab section-nav-button text-xs', selEx === ex.id ? 'method-tab-active' : 'method-tab-inactive')}>{ex.title}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <button onClick={downloadPDF} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text-secondary)] text-xs font-semibold border border-[var(--border)]">
                  <Download size={13} /> Download Solutions PDF
                </button>
              </div>
            </div>

            {exercises.map(exercise => (
              <div key={exercise.id} className="mb-8" id={exercise.id}>
                <h2 className="text-base font-display font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <BookOpen size={15} className="text-blue-500" />
                  {exercise.title}
                  <span className="text-xs font-normal text-[var(--text-muted)]">({exercise.questions.length} questions)</span>
                </h2>
                {exercise.questions.map(q => (
                  <NotebookQuestion key={q.id} q={q} exercise={exercise}
                    chapter={{ code: chapter.code, slug: chapter.slug, title: chapter.title, number: chapter.number }}
                    guestBlocked={guestBlocked && isGuest}
                    onGuestBlock={() => setAuthModal('signup')} />
                ))}
                {exercise.introHtml && (
                  <div className="ganita-notebook" dangerouslySetInnerHTML={{ __html: exercise.introHtml }} />
                )}
              </div>
            ))}

            {/* Mobile chapter nav */}
            <div className="lg:hidden mt-8 card p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Other Chapters</p>
              <div className="flex flex-wrap gap-2">
                {MATHS_SOURCE_CHAPTERS.map(ch => (
                  <Link key={ch.slug} href={`/class-9/maths/ganita-manjari/${ch.code}/${ch.slug}`}
                    className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                      ch.slug === chapterSlug ? 'bg-blue-600 text-white' : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--surface-3)]')}>
                    {ch.number}
                  </Link>
                ))}
              </div>
            </div>
          </main>

          <QuestionNav
            questions={exercises.flatMap(ex => ex.questions.map(q => ({ id: `${ex.id}-${q.id}`, number: q.number.replace(/\u2605/g, ''), section: ex.title })))}
            label={selEx === 'all' ? 'Questions' : (chapter.exercises.find(e => e.id === selEx)?.title || 'Questions')}
          />
        </div>
      </div>

      <BackToTop />
      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={m => setAuthModal(m)} />}
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: MATHS_SOURCE_CHAPTERS.map(ch => ({ params: { chapterCode: ch.code, chapterSlug: ch.slug } })),
  fallback: 'blocking'
});

export const getStaticProps: GetStaticProps = async ({ params }) => ({
  props: params || {}, revalidate: 3600
});