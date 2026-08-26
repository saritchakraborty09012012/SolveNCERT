import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Loader2, AlertTriangle, LogIn, UserPlus } from 'lucide-react';
import FlashCardViewer from '@/components/flashcards/FlashCardViewer';
import { SolveNCERTLogo } from '@/components/ui/Logo';

const SHARE_VISITS_KEY = 'sn_fc_share_visits';
const MAX_FREE_SHARE_VIEWS = 2;

interface FlashcardQuestion {
  question: string;
  answer: string;
}

interface FlashcardPage {
  questions: FlashcardQuestion[];
}

interface FlashcardMetadata {
  classLevel: number;
  subject: string;
  book: string;
  chapter: string;
  chapterNumber: number;
  numPages: number;
  totalQuestions: number;
  generatedAt: string;
}

interface SharedFlashcardData {
  title: string;
  pages: FlashcardPage[];
  metadata: FlashcardMetadata;
}

interface ShareApiResponse {
  sharedFlashcard: SharedFlashcardData;
  shareToken: string;
  createdAt: string;
  error?: { code: string; message: string };
}

function getShareVisitCount(): number {
  try {
    return parseInt(localStorage.getItem(SHARE_VISITS_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

function incrementShareVisitCount(): void {
  try {
    const count = getShareVisitCount() + 1;
    localStorage.setItem(SHARE_VISITS_KEY, String(count));
  } catch {}
}

export default function SharedFlashCardPage() {
  const router = useRouter();
  const { token } = router.query;

  const [data, setData] = useState<SharedFlashcardData | null>(null);
  const [shareToken, setShareToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [guestBlocked, setGuestBlocked] = useState(false);

  useEffect(() => {
    if (!token || typeof token !== 'string') return;

    const visitCount = getShareVisitCount();
    if (visitCount >= MAX_FREE_SHARE_VIEWS) {
      setGuestBlocked(true);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          '/api/flashcards/share?share_token=' + encodeURIComponent(token as string)
        );
        const json: ShareApiResponse = await res.json();

        if (cancelled) return;

        if (!res.ok || !json.sharedFlashcard) {
          setError(json.error?.message || 'Flashcards not found or no longer shared.');
        } else {
          setData(json.sharedFlashcard);
          setShareToken(json.shareToken);
          incrementShareVisitCount();
        }
      } catch {
        if (!cancelled) setError('Failed to load shared flashcards. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [token]);

  const meta = data?.metadata;
  const pageTitle = meta
    ? meta.chapter + ' - Class ' + meta.classLevel + ' ' + meta.subject + ' Flash Cards'
    : 'Shared Flash Cards | SolveNCERT';
  const pageDesc = meta
    ? 'Revise ' + meta.chapter + ' (Class ' + meta.classLevel + ' ' + meta.subject + ') with AI-powered flashcards on SolveNCERT.'
    : 'AI-powered flashcards shared on SolveNCERT - quick revision for CBSE students.';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="SolveNCERT" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
      </Head>

      <div className="min-h-screen bg-[#0a0618] text-white">
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-2.5 bg-[#0a0618]/80 backdrop-blur-md border-b border-purple-900/20">
          <Link href="/" className="flex items-center">
            <SolveNCERTLogo size={24} withText textSize="text-[14px]" />
          </Link>
          <span className="text-[10px] text-purple-400/40 tracking-widest uppercase hidden sm:inline">
            Shared Flash Cards
          </span>
        </header>

        <main className="pb-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 size={32} className="animate-spin text-purple-400" />
              <p className="text-sm text-purple-300/60">Loading flashcards...</p>
            </div>
          )}

          {guestBlocked && (
            <div className="max-w-md mx-auto px-4 py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={28} className="text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Free view limit reached</h2>
              <p className="text-sm text-purple-300/60 mb-8 max-w-xs mx-auto">
                You have viewed {MAX_FREE_SHARE_VIEWS} shared flashcard sets. Sign in or create a free account to continue studying.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-purple-500/30 text-purple-300 text-sm font-semibold hover:bg-purple-500/10 transition-all"
                >
                  <UserPlus size={16} />
                  Create Free Account
                </Link>
              </div>
              <p className="text-xs text-purple-400/30 mt-6">
                Free accounts get unlimited flashcard access.
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="max-w-md mx-auto px-4 py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={28} className="text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Flashcards not found</h2>
              <p className="text-sm text-purple-300/60 mb-6">{error}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-900/30 text-purple-200 text-sm font-semibold hover:bg-purple-800/40 transition-colors"
              >
                Go to SolveNCERT
              </Link>
            </div>
          )}

          {data && !loading && !guestBlocked && (
            <FlashCardViewer
              classLevel={meta!.classLevel}
              subject={meta!.subject}
              book={meta!.book}
              chapter={meta!.chapter}
              chapterNumber={meta!.chapterNumber}
              pages={data.pages}
              shareToken={shareToken}
            />
          )}
        </main>
      </div>
    </>
  );
}