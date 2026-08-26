import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, BookOpen, Flower2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { CLASS_9_SUBJECTS } from '@/lib/content';

export default function HindiLandingPage() {
  const ganga = CLASS_9_SUBJECTS.find(s => s.id === 'hindi');
  const reva = CLASS_9_SUBJECTS.find(s => s.id === 'hindi-reva');

  return (
    <Layout
      title="Class 9 Hindi NCERT Solutions — Ganga & Reva"
      description="Class 9 Hindi NCERT solutions — R1 and R2 book- Ganga and R3 book- Reva. NCERT 2026 Revised Syllabus."
      canonical="/class-9/hindi"
    >
      <div className="max-w-screen-sm mx-auto px-6 py-10">
        <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6">
          <Link href="/" className="hover:text-blue-500 flex items-center gap-1"><Home size={11} />Home</Link>
          <ChevronRight size={12} />
          <span className="text-[var(--text-secondary)] font-medium">Class 9 Hindi</span>
        </nav>

        <span className="badge-2026 mb-2 inline-flex">NCERT 2026 Revised Syllabus</span>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">Class 9 Hindi</h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">Choose a book to continue</p>

        <div className="space-y-4">
          <Link href={`/class-9/hindi/${ganga?.bookSlug}`} className="card p-6 flex items-center gap-4 border-2 border-red-200 dark:border-red-800 hover:border-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors block shadow-sm">
            <span className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center flex-shrink-0 text-xl">
              <BookOpen size={22} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">R1 and R2</p>
              <p className="font-display font-bold text-[var(--text-primary)]">Ganga</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{ganga?.chapters.length} chapters</p>
            </div>
            <ChevronRight size={18} className="text-[var(--text-muted)] flex-shrink-0" />
          </Link>

          <Link href={`/class-9/hindi/${reva?.bookSlug}`} className="card p-6 flex items-center gap-4 border-2 border-red-200 dark:border-red-800 hover:border-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors block shadow-sm">
            <span className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center flex-shrink-0 text-xl">
              <Flower2 size={22} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">R3</p>
              <p className="font-display font-bold text-[var(--text-primary)]">Reva</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{reva?.chapters.length} chapters</p>
            </div>
            <ChevronRight size={18} className="text-[var(--text-muted)] flex-shrink-0" />
          </Link>
        </div>
      </div>
    </Layout>
  );
}