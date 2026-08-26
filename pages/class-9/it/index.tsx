import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Compass, Laptop2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { CLASS_9_SUBJECTS } from '@/lib/content';

export default function ITLandingPage() {
  const partA = CLASS_9_SUBJECTS.find(s => s.id === 'it-part-a');
  const partB = CLASS_9_SUBJECTS.find(s => s.id === 'it-part-b');

  return (
    <Layout
      title="Class 9 IT (Information Technology) NCERT Solutions — Code 402"
      description="Class 9 Information Technology (Code 402) NCERT solutions — Part A: Employability Skills and Part B: Information Technology. NCERT 2026 Revised Syllabus."
      canonical="/class-9/it"
    >
      <div className="max-w-screen-sm mx-auto px-6 py-10">
        <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6">
          <Link href="/" className="hover:text-blue-500 flex items-center gap-1"><Home size={11} />Home</Link>
          <ChevronRight size={12} />
          <span className="text-[var(--text-secondary)] font-medium">Class 9 IT</span>
        </nav>

        <span className="badge-2026 mb-2 inline-flex">NCERT 2026 Revised Syllabus</span>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">Class 9 IT</h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">Choose a part to continue</p>

        <div className="space-y-4">
          <Link href={`/class-9/it/${partA?.bookSlug}`} className="card p-6 flex items-center gap-4 border-2 border-teal-200 dark:border-teal-800 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-colors block shadow-sm">
            <span className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 flex items-center justify-center flex-shrink-0 text-xl">
              <Compass size={22} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Part A</p>
              <p className="font-display font-bold text-[var(--text-primary)]">Employability Skills</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{partA?.chapters.length} chapters</p>
            </div>
            <ChevronRight size={18} className="text-[var(--text-muted)] flex-shrink-0" />
          </Link>

          <Link href={`/class-9/it/${partB?.bookSlug}`} className="card p-6 flex items-center gap-4 border-2 border-teal-200 dark:border-teal-800 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 transition-colors block shadow-sm">
            <span className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 flex items-center justify-center flex-shrink-0 text-xl">
              <Laptop2 size={22} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Part B</p>
              <p className="font-display font-bold text-[var(--text-primary)]">Information Technology <span className="font-normal">(Subject Code 402)</span></p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{partB?.chapters.length} chapters</p>
            </div>
            <ChevronRight size={18} className="text-[var(--text-muted)] flex-shrink-0" />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
