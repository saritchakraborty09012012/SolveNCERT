import React from 'react';
import Link from 'next/link';
import { ChevronRight, FileText, Feather } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { ENGLISH_CHAPTERS } from '@/lib/content-english';

export default function EnglishBookIndexPage() {
  const totalContents = ENGLISH_CHAPTERS.length * 2;

  return (
    <Layout
      title="Class 9 English NCERT Solutions — Kaveri"
      description={`Complete NCERT solutions for Class 9 English (Kaveri). All ${ENGLISH_CHAPTERS.length} chapters — each with its story/play and poem — covered. NCERT 2026 Revised Syllabus.`}
      canonical="/class-9/english/kaveri"
      schema={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',            item: 'https://solvencert-novexa.pages.dev' },
          { '@type': 'ListItem', position: 2, name: 'NCERT Solutions', item: 'https://solvencert-novexa.pages.dev/answers' },
          { '@type': 'ListItem', position: 3, name: 'Class 9 English', item: 'https://solvencert-novexa.pages.dev/class-9/english/kaveri' },
        ],
      }}
    >
      <div className="max-w-screen-lg mx-auto px-6 py-10">
        <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6">
          <Link href="/" className="hover:text-blue-500">Home</Link>
          <ChevronRight size={12} />
          <Link href="/answers" className="hover:text-blue-500">NCERT Solutions</Link>
          <ChevronRight size={12} />
          <span className="text-[var(--text-secondary)] font-medium">Class 9 English (Kaveri)</span>
        </nav>

        <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-violet-500/5 mb-8 border border-[var(--border)]">
          <div className="flex items-center gap-4 flex-wrap justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/15 to-purple-600/10 border border-violet-500/30 flex items-center justify-center shadow-soft">
                <Feather size={26} className="text-violet-400" />
              </div>
              <div>
                <span className="badge-2026 mb-1 inline-flex">NCERT 2026 Revised Syllabus</span>
                <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Class 9 English</h1>
                <p className="text-sm text-[var(--text-muted)]">Kaveri · {ENGLISH_CHAPTERS.length} Chapters · {totalContents} Readings (story/play + poem each)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {ENGLISH_CHAPTERS.map(chapter => (
            <div key={chapter.code} className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg bg-[var(--surface-2)] text-sm font-bold text-[var(--text-secondary)] flex items-center justify-center flex-shrink-0">
                  {chapter.number}
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">{chapter.code.toUpperCase()}</span>
                <Link href={`/class-9/english/kaveri/${chapter.code}`} className="text-xs text-purple-500 hover:text-purple-600 ml-auto font-medium">
                  Chapter overview →
                </Link>
              </div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-xs font-semibold text-[var(--text-muted)]">Chapter {chapter.number}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {chapter.contents.map(c => (
                  <Link key={c.slug} href={`/class-9/english/kaveri/${chapter.code}/${c.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl border-2 border-purple-500/25 bg-[var(--surface-0)] hover:border-purple-400 hover:bg-purple-500/10 transition-colors shadow-sm">
                    <span className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center flex-shrink-0">
                      {c.kind === 'poem' ? <Feather size={14} /> : <FileText size={14} />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">{c.kind === 'poem' ? 'Poem' : 'Story / Play'}</p>
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{c.title}</p>
                    </div>
                    <ChevronRight size={14} className="text-[var(--text-muted)] flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
