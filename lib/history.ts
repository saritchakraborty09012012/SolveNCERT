import { formatDistanceToNowStrict } from 'date-fns';
import type { Profile } from '@/types/database';

// ── Pages that are STORED but never SHOWN in the activity list ──────────────
// Utility / navigation / legal pages still get logged (full activity record),
// they just don't clutter the human-facing History list.
const HIDDEN_EXACT = new Set([
  '/',
  '/answers',
  '/search',
  '/settings',
  '/profile',
  '/history',
  '/pricing',
  '/premium',
  '/books',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/refund-policy',
  '/404',
]);
const HIDDEN_PREFIXES = ['/auth'];

export function isDisplayableHistoryUrl(url: string): boolean {
  const path = url.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  if (HIDDEN_EXACT.has(path)) return false;
  if (HIDDEN_PREFIXES.some(p => path.startsWith(p))) return false;
  return true;
}

// ── Human-readable label fallback for URLs logged without a page title ──────
const STATIC_LABELS: Record<string, string> = {
  '/practice':      'Practice Papers',
  '/quizzes':       'Quizzes',
  '/mock-tests':    'Mock Tests',
  '/ai-learn':      'AI Learn',
  '/study-room':    'Study Room',
  '/bookmarks':     'Bookmarks',
  '/referral':      'Referral & Rewards',
  '/invite':        'Study Invite',
};

function prettifySegment(seg: string): string {
  return seg
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

/** Derives a readable label from a path when no page title is available. */
export function describePath(url: string): string {
  const path = url.split('?')[0].split('#')[0].replace(/\/+$/, '');
  if (STATIC_LABELS[path]) return STATIC_LABELS[path];
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return 'Home';
  // Chapter solution URLs end with the chapter slug — that's the readable part.
  return prettifySegment(parts[parts.length - 1]);
}

// ── Icon kind per entry, so the list can show a meaningful glyph ────────────
export type HistoryKind =
  | 'chapter' | 'practice' | 'quiz' | 'mock'
  | 'ai' | 'study-room' | 'bookmarks' | 'page';

export function classifyHistoryUrl(url: string): HistoryKind {
  const path = url.split('?')[0];
  if (/^\/(class-9|class-\d+)\//.test(path) || /^\/[^/]+\/[^/]+\/.+/.test(path)) {
    if (path.split('/').filter(Boolean).length >= 4) return 'chapter';
  }
  if (path.startsWith('/practice'))      return 'practice';
  if (path.startsWith('/quizzes'))       return 'quiz';
  if (path.startsWith('/mock-tests'))    return 'mock';
  if (path.startsWith('/ai-learn'))      return 'ai';
  if (path.startsWith('/study-room'))    return 'study-room';
  if (path.startsWith('/bookmarks'))     return 'bookmarks';
  return 'page';
}

// ── Relative time ("2 hours ago") for list rows ─────────────────────────────
export function timeAgo(date: string | Date): string {
  return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
}

// ── Retention description shared by History page, Settings and login popup ──
export const FREE_RETENTION_MAX  = 30;
export const PREMIUM_RETENTION_MAX = 120;
export const ARCHIVE_LIMIT = 5;

export function retentionText(profile: Pick<Profile, 'plan' | 'history_retention_days' | 'history_keep_forever'> | null): string {
  if (!profile) return 'Auto-deletes after 30 days.';
  if (profile.plan === 'premium' && profile.history_keep_forever) {
    return 'Kept forever on your Premium plan.';
  }
  const days = profile.history_retention_days ?? 30;
  return `Auto-deletes after ${days} day${days === 1 ? '' : 's'}.`;
}

export function isPremium(profile: Pick<Profile, 'plan'> | null): boolean {
  return profile?.plan === 'premium';
}
