import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Bookmark, Trash2, Loader2, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import { useBookmarksStore } from '@/store/bookmarksStore';
import { CLASS_9_SUBJECTS } from '@/lib/content';
import { formatDate } from '@/utils/helpers';

function chapterHref(subjectSlug: string, chapterCode: string, chapterSlug: string) {
  if (subjectSlug === 'science') return `/class-9/science/exploration/${chapterCode}/${chapterSlug}`;
  if (subjectSlug === 'english') return `/class-9/english/kaveri/${chapterCode}/${chapterSlug}`;
  // Some subjects (e.g. IT) have multiple "parts" sharing one slug — disambiguate
  // using which part actually contains this chapter code.
  const candidates = CLASS_9_SUBJECTS.filter(s => s.slug === subjectSlug);
  const subject = candidates.length > 1
    ? candidates.find(s => s.chapters.some(c => c.code === chapterCode)) || candidates[0]
    : candidates[0];
  const bookSlug = subject?.bookSlug || subjectSlug;
  return `/class-9/${subjectSlug}/${bookSlug}/${chapterCode}/${chapterSlug}`;
}

export default function BookmarksPage() {
  const router = useRouter();
  const { user, isGuest } = useAuthStore();
  const { items, loaded, loading, fetchAll, remove } = useBookmarksStore();

  useEffect(() => {
    if (isGuest) { router.replace('/'); return; }
    if (user?.id && !loaded) fetchAll(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGuest, user?.id]);

  return (
    <Layout title="Bookmarks | SolveNCERT" description="Your saved NCERT questions, synced across devices." canonical="/bookmarks">
      <div className="max-w-screen-md mx-auto px-6 py-10">
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
          <Bookmark size={20} className="text-amber-500" /> Bookmarks
        </h1>

        {loading && !loaded ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-blue-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="card p-10 text-center">
            <Bookmark size={32} className="mx-auto text-amber-300 mb-3" />
            <p className="font-semibold text-[var(--text-primary)] mb-1">No bookmarks yet</p>
            <p className="text-sm text-[var(--text-muted)]">Tap "Save" on any question to bookmark it — synced across all your devices.</p>
            <Link href="/quizzes" className="mt-3 inline-block text-xs font-medium text-amber-500 hover:text-amber-600 transition-colors">Test yourself with a Quiz →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(b => (
              <div key={b.id} className="card p-4 group">
                <div className="flex items-start justify-between gap-3">
                  <Link href={chapterHref(b.subject, b.chapter_code, b.chapter_slug)} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 uppercase tracking-wide capitalize">
                        {b.subject}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)]">{b.chapter_title}</span>
                      <span className="text-[10px] text-[var(--text-muted)] ml-auto">{formatDate(b.created_at)}</span>
                    </div>
                    <p className="text-sm text-[var(--text-primary)] font-medium truncate">
                      Q{b.question_number}. {b.question_text}
                    </p>
                  </Link>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => user && remove(user.id, b.id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-all"
                      title="Remove bookmark"
                    >
                      <Trash2 size={14} />
                    </button>
                    <Link href={chapterHref(b.subject, b.chapter_code, b.chapter_slug)}>
                      <ChevronRight size={16} className="text-[var(--text-muted)]" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
