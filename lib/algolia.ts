import algoliasearch from 'algoliasearch';

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!;

// ─── Usage Limits (Algolia Free Tier) ────────────────────────────────────────
// 10K search requests/month  →  daily budget ≈ 333 (we cap at 300)
// 10K crawls/month           →  daily budget ≈ 333 (we cap at 300)
// 10K AI requests/month      →  daily budget ≈ 333 (we cap at 300)

const DAILY_SEARCH_LIMIT = 300;
const MONTHLY_SEARCH_LIMIT = 9500; // 500 safety buffer

const USAGE_KEY  = 'sn_algolia_usage';
const SESSION_KEY = 'sn_session_searches';

interface UsageRecord {
  date:    string;   // YYYY-MM-DD
  month:   string;   // YYYY-MM
  daily:   number;
  monthly: number;
}

function getUsage(): UsageRecord {
  if (typeof window === 'undefined') return { date: '', month: '', daily: 0, monthly: 0 };
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return resetUsage();
    const rec: UsageRecord = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    const month = today.slice(0, 7);
    // Reset daily counter on new day
    if (rec.date !== today) { rec.date = today; rec.daily = 0; }
    // Reset monthly counter on new month
    if (rec.month !== month) { rec.month = month; rec.monthly = 0; }
    return rec;
  } catch { return resetUsage(); }
}

function resetUsage(): UsageRecord {
  const today = new Date().toISOString().slice(0, 10);
  const rec: UsageRecord = { date: today, month: today.slice(0, 7), daily: 0, monthly: 0 };
  if (typeof window !== 'undefined') localStorage.setItem(USAGE_KEY, JSON.stringify(rec));
  return rec;
}

function incrementUsage(): void {
  const rec = getUsage();
  rec.daily++;
  rec.monthly++;
  if (typeof window !== 'undefined') localStorage.setItem(USAGE_KEY, JSON.stringify(rec));
}

export function canSearch(): boolean {
  const rec = getUsage();
  return rec.daily < DAILY_SEARCH_LIMIT && rec.monthly < MONTHLY_SEARCH_LIMIT;
}

// ─── Client ──────────────────────────────────────────────────────────────────
let _client: ReturnType<typeof algoliasearch> | null = null;

function getClient() {
  if (!_client) _client = algoliasearch(APP_ID, SEARCH_KEY);
  return _client;
}

export async function searchContent(
  query: string,
  options: { indexName?: string; hitsPerPage?: number; page?: number } = {}
) {
  if (!canSearch()) {
    // Silent graceful fallback: return empty results, never crash UX
    return { hits: [], nbHits: 0, page: 0, nbPages: 0, fallback: true };
  }

  const client = getClient();
  const index  = client.initIndex(options.indexName || 'solvencert_content');

  try {
    incrementUsage();
    const result = await index.search(query, {
      hitsPerPage: options.hitsPerPage || 10,
      page:        options.page        || 0,
      attributesToHighlight: ['title', 'content'],
      attributesToSnippet:   ['content:30'],
    });
    return { ...result, fallback: false };
  } catch {
    return { hits: [], nbHits: 0, page: 0, nbPages: 0, fallback: true };
  }
}

export { getClient as getAlgoliaClient };
