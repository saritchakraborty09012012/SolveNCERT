import React, { useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useBookmarksStore, type BookmarkInput } from '@/store/bookmarksStore';
import { cn } from '@/utils/helpers';

interface Props extends BookmarkInput {
  onGuestBlock: () => void; // called when a guest tries to bookmark — parent shows sign-in prompt/modal
  size?: 'sm' | 'md';
}

export default function BookmarkButton({ onGuestBlock, size = 'sm', ...b }: Props) {
  const { user, isGuest } = useAuthStore();
  const { isBookmarked, toggle, fetchAll, loaded } = useBookmarksStore();

  useEffect(() => {
    if (user?.id && !loaded) fetchAll(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const active = user ? isBookmarked(b.subject, b.chapterCode, b.questionId) : false;
  const iconSize = size === 'sm' ? 12 : 14;

  function handleClick() {
    if (isGuest || !user) { onGuestBlock(); return; }
    toggle(user.id, b);
  }

  return (
    <button
      onClick={handleClick}
      title={active ? 'Remove bookmark' : 'Bookmark this question'}
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-medium transition-all',
        active
          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 border-amber-200'
          : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-transparent hover:border-[var(--border)]'
      )}
    >
      <Bookmark size={iconSize} fill={active ? 'currentColor' : 'none'} />
      {active ? 'Saved' : 'Save'}
    </button>
  );
}
