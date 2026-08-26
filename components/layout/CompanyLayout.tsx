import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import Layout from './Layout';

interface Props {
  children:     React.ReactNode;
  title:        string;
  description?: string;
  canonical:    string;
  breadcrumb:   string;
  lastUpdated?: string;
  schema?:      object | object[];
}

export default function CompanyLayout({ children, title, description, canonical, breadcrumb, lastUpdated, schema }: Props) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://solvencert-novexa.pages.dev' },
      { '@type': 'ListItem', position: 2, name: breadcrumb, item: `https://solvencert-novexa.pages.dev${canonical}` },
    ],
  };
  const schemas = schema
    ? (Array.isArray(schema) ? [breadcrumbSchema, ...schema] : [breadcrumbSchema, schema])
    : breadcrumbSchema;

  return (
    <Layout title={title} description={description} canonical={canonical} schema={schemas}>
      <div className="max-w-screen-md mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-4 flex-wrap">
          <Link href="/" className="hover:text-blue-500 flex items-center gap-1 transition-colors">
            <Home size={11} /><span>Home</span>
          </Link>
          <ChevronRight size={11} />
          <span className="text-[var(--text-secondary)] font-medium">{breadcrumb}</span>
        </nav>

        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 font-semibold mb-7 group">
          <ChevronRight size={12} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>

        <div className="prose-custom">{children}</div>

        {lastUpdated && (
          <p className="text-xs text-[var(--text-muted)] mt-10 pt-6 border-t border-[var(--border)]">
            Last updated: {lastUpdated}
          </p>
        )}
      </div>
    </Layout>
  );
}
