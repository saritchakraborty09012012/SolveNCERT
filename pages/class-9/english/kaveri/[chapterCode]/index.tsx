import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { ChevronRight, Home, FileText, Feather } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { ENGLISH_CHAPTERS } from '@/lib/content-english';

interface PageProps { chapterCode: string; }

export default function EnglishChapterHubPage({ chapterCode }: PageProps) {
  const chapter = ENGLISH_CHAPTERS.find(c => c.code === chapterCode);

  if (!chapter) {
    return (
      <Layout title="Chapter Not Found | SolveNCERT">
        <div className="text-center py-20">
          <p className="text-[var(--text-muted)]">Chapter not found.</p>
          <Link href="/class-9/english/kaveri" className="btn-primary mt-4 inline-flex">Browse English</Link>
        </div>
      </Layout>
    );
  }

  const titles = chapter.contents.map(c => c.title).join(' & ');

  return (
    <Layout
      title={`Chapter ${chapter.number} — ${chapter.code.toUpperCase()} | ${titles} | Class 9 English NCERT Solutions`}
      description={`Class 9 English Kaveri Chapter ${chapter.number} (${chapter.code.toUpperCase()}): ${titles}. NCERT Solutions for the 2026 Revised Syllabus.`}
      canonical={`/class-9/english/kaveri/${chapterCode}`}
      keywords={`${chapter.code.toUpperCase()}, ${chapter.code}, class 9 english NCERT solutions, Kaveri chapter ${chapter.number}, ${titles}, CBSE 2026 english`}
    >
      <div className="max-w-screen-sm mx-auto px-6 py-10">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6 flex-wrap">
          <Link href="/" className="hover:text-blue-500 flex items-center gap-1"><Home size={11} />Home</Link>
          <ChevronRight size={10} />
          <Link href="/class-9/english/kaveri" className="hover:text-blue-500">English</Link>
          <ChevronRight size={10} />
          <span className="text-[var(--text-secondary)] font-semibold">Chapter {chapter.number}</span>
        </div>

        <p className="text-xs font-mono font-semibold text-purple-500 mb-1">{chapter.code.toUpperCase()}</p>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-6">
          Chapter {chapter.number}: {titles} <span className="text-lg font-normal text-[var(--text-muted)]">({chapter.code.toUpperCase()})</span>
        </h1>

        <div className="space-y-3">
          {chapter.contents.map(c => (
            <Link key={c.slug} href={`/class-9/english/kaveri/${chapter.code}/${c.slug}`}
              className="card p-5 flex items-center gap-4 hover:border-purple-300 transition-colors block">
              <span className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center flex-shrink-0">
                {c.kind === 'poem' ? <Feather size={18} /> : <FileText size={18} />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">{c.kind === 'poem' ? 'Poem' : 'Story / Play'}</p>
                <p className="font-semibold text-[var(--text-primary)]">{c.title}</p>
              </div>
              <ChevronRight size={16} className="text-[var(--text-muted)] flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: ENGLISH_CHAPTERS.map(ch => ({ params: { chapterCode: ch.code } })),
  fallback: 'blocking'
});

export const getStaticProps: GetStaticProps = async ({ params }) => ({
  props: params || {}, revalidate: 3600
});
