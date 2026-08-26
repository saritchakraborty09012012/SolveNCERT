import React from 'react';
import Link from 'next/link';
import { BookOpen, Home, Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';

export default function NotFound() {
  return (
    <Layout title="Page Not Found | SolveNCERT" description="The page you are looking for does not exist. Browse NCERT solutions for Class 9.">
      <div className="max-w-screen-sm mx-auto px-6 py-24 text-center">
        <div className="text-8xl font-display font-bold text-[var(--surface-3)] mb-4">404</div>
        <BookOpen size={40} className="mx-auto text-blue-400 mb-4" />
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-2">Page Not Found</h1>
        <p className="text-[var(--text-muted)] mb-8">Looks like this page doesn't exist. Let's get you back to studying!</p>
        <div className="flex justify-center gap-3">
          <Link href="/"       className="btn-primary text-sm"><Home size={14} /> Home</Link>
          <Link href="/answers"className="btn-ghost  text-sm"><BookOpen size={14} /> Solutions</Link>
          <Link href="/search" className="btn-ghost  text-sm"><Search size={14} /> Search</Link>
        </div>
      </div>
    </Layout>
  );
}
