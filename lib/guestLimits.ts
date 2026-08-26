// ─── Guest Free-View Limit ─────────────────────────────────────────────────────
// Guests get 2 FREE solution page views.
// On the 3rd visit the paywall shows.
//
// Logic:
//   view 1  → increment to 1  → 1 <= 2  → NOT blocked  ✓
//   view 2  → increment to 2  → 2 <= 2  → NOT blocked  ✓
//   view 3  → increment to 3  → 3 >  2  → BLOCKED      ✗
// ──────────────────────────────────────────────────────────────────────────────

const SOLUTION_VIEWS_KEY = 'sn_sol_views';
const GUEST_LIMIT = 2; // number of FREE views allowed

export function getSolutionViewCount(): number {
  try { return parseInt(localStorage.getItem(SOLUTION_VIEWS_KEY) || '0', 10); } catch { return 0; }
}

export function incrementSolutionView(): void {
  try {
    const n = getSolutionViewCount() + 1;
    localStorage.setItem(SOLUTION_VIEWS_KEY, String(n));
  } catch {}
}

// Aliases kept for backward compat with any other callers
export function incrementChapterOpen() { incrementSolutionView(); }
export function getChapterOpenCount()  { return getSolutionViewCount(); }

/**
 * Returns true only AFTER the guest has used up all free views.
 * Free views used = count AFTER increment (done in the page useEffect).
 * Blocked when count > GUEST_LIMIT  i.e. on the (GUEST_LIMIT + 1)th visit.
 */
export function hasReachedGuestLimit(): boolean {
  return getSolutionViewCount() > GUEST_LIMIT;
}

export function clearGuestLimits(): void {
  try { localStorage.removeItem(SOLUTION_VIEWS_KEY); } catch {}
}

// ─── Practice Paper Guest Limit ────────────────────────────────────────────────
// Guests get 5 FREE practice paper generations per day (resets daily).
// Logged-in users: 1 API call/min. Premium: unlimited.
// ──────────────────────────────────────────────────────────────────────────────

const PRACTICE_CALLS_KEY = 'sn_practice_calls';
const PRACTICE_DATE_KEY = 'sn_practice_date';
const PRACTICE_DAILY_LIMIT = 5;

export function getPracticeCallCount(): number {
  try {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem(PRACTICE_DATE_KEY);
    if (storedDate !== today) {
      localStorage.setItem(PRACTICE_DATE_KEY, today);
      localStorage.setItem(PRACTICE_CALLS_KEY, '0');
      return 0;
    }
    return parseInt(localStorage.getItem(PRACTICE_CALLS_KEY) || '0', 10);
  } catch { return 0; }
}

export function incrementPracticeCall(): void {
  try {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem(PRACTICE_DATE_KEY);
    if (storedDate !== today) {
      localStorage.setItem(PRACTICE_DATE_KEY, today);
      localStorage.setItem(PRACTICE_CALLS_KEY, '1');
      return;
    }
    const n = getPracticeCallCount() + 1;
    localStorage.setItem(PRACTICE_CALLS_KEY, String(n));
  } catch {}
}

export function hasReachedPracticeLimit(): boolean {
  return getPracticeCallCount() >= PRACTICE_DAILY_LIMIT;
}

export function getPracticeRemainingCalls(): number {
  return Math.max(0, PRACTICE_DAILY_LIMIT - getPracticeCallCount());
}

// ─── Guest Flashcard Generation Limit ────────────────────────────────────────
// Guests get 5 FREE flashcard generations per day.
// Resets daily based on calendar date.
// ──────────────────────────────────────────────────────────────────────────────

const FC_GEN_COUNT_KEY = 'sn_fc_gen_count';
const FC_GEN_DATE_KEY  = 'sn_fc_gen_date';
const FC_DAILY_LIMIT   = 5;

function todayStr(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function getFlashcardGenCount(): number {
  try {
    const date = localStorage.getItem(FC_GEN_DATE_KEY);
    if (date !== todayStr()) {
      localStorage.setItem(FC_GEN_DATE_KEY, todayStr());
      localStorage.setItem(FC_GEN_COUNT_KEY, '0');
      return 0;
    }
    return parseInt(localStorage.getItem(FC_GEN_COUNT_KEY) || '0', 10);
  } catch { return 0; }
}

export function incrementFlashcardGen(): number {
  const count = getFlashcardGenCount();
  const next = count + 1;
  try {
    localStorage.setItem(FC_GEN_DATE_KEY, todayStr());
    localStorage.setItem(FC_GEN_COUNT_KEY, String(next));
  } catch {}
  return next;
}

export function hasReachedFlashcardLimit(): boolean {
  return getFlashcardGenCount() >= FC_DAILY_LIMIT;
}

export function getFlashcardRemaining(): number {
  return Math.max(0, FC_DAILY_LIMIT - getFlashcardGenCount());
}

// ─── Guest Notes Generation Limit ───────────────────────────────────────────
// Guests get 5 FREE notes generations per day.
// Resets daily based on calendar date.
// ──────────────────────────────────────────────────────────────────────────────

const NOTES_GEN_COUNT_KEY = 'sn_notes_gen_count';
const NOTES_GEN_DATE_KEY  = 'sn_notes_gen_date';
const NOTES_DAILY_LIMIT   = 5;

export function getNotesGenCount(): number {
  try {
    const date = localStorage.getItem(NOTES_GEN_DATE_KEY);
    if (date !== todayStr()) {
      localStorage.setItem(NOTES_GEN_DATE_KEY, todayStr());
      localStorage.setItem(NOTES_GEN_COUNT_KEY, '0');
      return 0;
    }
    return parseInt(localStorage.getItem(NOTES_GEN_COUNT_KEY) || '0', 10);
  } catch { return 0; }
}

export function incrementNotesGen(): number {
  const count = getNotesGenCount();
  const next = count + 1;
  try {
    localStorage.setItem(NOTES_GEN_DATE_KEY, todayStr());
    localStorage.setItem(NOTES_GEN_COUNT_KEY, String(next));
  } catch {}
  return next;
}

export function hasReachedNotesLimit(): boolean {
  return getNotesGenCount() >= NOTES_DAILY_LIMIT;
}

export function getNotesRemaining(): number {
  return Math.max(0, NOTES_DAILY_LIMIT - getNotesGenCount());
}
