import React from 'react';
import Link from 'next/link';
import { ChevronRight, BookOpen, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { MATHS_SOURCE_CHAPTERS } from '@/lib/content-maths-source';

export default function MathsBookIndexPage() {
  const totalQ = MATHS_SOURCE_CHAPTERS.reduce((a, ch) => a + ch.exercises.reduce((b, ex) => b + ex.questions.length, 0), 0);
  const totalEx = MATHS_SOURCE_CHAPTERS.reduce((a, ch) => a + ch.exercises.length, 0);

  return (
    <Layout
      title="Class 9 Maths NCERT Solutions — Ganita Manjari"
      description={`Complete NCERT solutions for Class 9 Maths (Ganita Manjari Part I). All ${MATHS_SOURCE_CHAPTERS.length} chapters — every exercise with step-by-step notebook-style solutions, diagrams and boxed answers. NCERT 2026 Revised Syllabus.`}
      canonical="/class-9/maths/ganita-manjari"
      schema={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',            item: 'https://solvencert-novexa.pages.dev' },
          { '@type': 'ListItem', position: 2, name: 'NCERT Solutions', item: 'https://solvencert-novexa.pages.dev/answers' },
          { '@type': 'ListItem', position: 3, name: 'Class 9 Maths',   item: 'https://solvencert-novexa.pages.dev/class-9/maths/ganita-manjari' },
        ],
      }}
    >
      <div className="max-w-screen-lg mx-auto px-6 py-10">
        <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6 flex-wrap">
          <Link href="/" className="hover:text-blue-500">Home</Link>
          <ChevronRight size={12} />
          <Link href="/answers" className="hover:text-blue-500">NCERT Solutions</Link>
          <ChevronRight size={12} />
          <span className="text-[var(--text-secondary)] font-medium">Class 9 Maths (Ganita Manjari)</span>
        </nav>

        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 mb-8 border border-[var(--border)]">
          <div className="flex items-center gap-4 flex-wrap justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/15 to-indigo-600/10 border border-blue-500/30 flex items-center justify-center shadow-soft">
                <BookOpen size={26} className="text-blue-400" />
              </div>
              <div>
                <span className="badge-2026 mb-1 inline-flex">NCERT 2026 Revised Syllabus</span>
                <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Class 9 Maths</h1>
                <p className="text-sm text-[var(--text-muted)]">Ganita Manjari Part I · {MATHS_SOURCE_CHAPTERS.length} Chapters · {totalEx} Exercises · {totalQ} Questions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {MATHS_SOURCE_CHAPTERS.map(chapter => {
            const chQ = chapter.exercises.reduce((a, ex) => a + ex.questions.length, 0);
            return (
              <Link key={chapter.code} href={`/class-9/maths/ganita-manjari/${chapter.code}/${chapter.slug}`}
                className="card p-4 flex items-center gap-4 hover:border-blue-300 transition-colors block">
                <span className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center flex-shrink-0 font-display font-bold text-sm">
                  {chapter.number}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">Chapter {chapter.number} · {chapter.exercises.length} exercises</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">{chapter.title}</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)] flex-shrink-0">
                  <CheckCircle2 size={12} className="text-green-500" /> {chQ} questions
                </span>
                <ChevronRight size={16} className="text-[var(--text-muted)] flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}