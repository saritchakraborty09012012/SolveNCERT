import type {
  SharedLearningData,
  PerformanceSummary,
  Difficulty,
} from './types';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'sn_shared_learning';
const TABLE = 'shared_learning_data';

const DEFAULT_SHARED_DATA: SharedLearningData = {
  completedChapters: [],
  completedTopics: [],
  weakAreas: [],
  strongAreas: [],
  frequentMistakes: [],
  wrongQuestionHistory: [],
  revisionHistory: [],
  preferredDifficulty: 'mixed',
  learningPace: 'average',
  preferredLanguage: 'English',
  mockTestPerformance: [],
  practicePerformance: [],
  quizPerformance: [],
  aiTutorProgress: { topicsCovered: 0, totalTime: 0 },
  studyRoomActivity: { sessionsJoined: 0, lastActive: '' },
  recommendedRevisionTopics: [],
};

let _currentUserId: string | null = null;
let _cachedData: SharedLearningData | null = null;
let _syncInProgress = false;

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function readLocalCache(): SharedLearningData {
  if (!isClient()) return { ...DEFAULT_SHARED_DATA };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SHARED_DATA };
    return { ...DEFAULT_SHARED_DATA, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SHARED_DATA };
  }
}

function writeLocalCache(data: SharedLearningData): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* storage full */ }
}

function clearLocalCache(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

function unique(arr: string[]): string[] {
  return [...new Set(arr)];
}

function deepMergePerformance(
  remote: PerformanceSummary[],
  local: PerformanceSummary[]
): PerformanceSummary[] {
  const merged = [...remote, ...local];
  const deduped = merged.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.testId === item.testId && t.date === item.date)
  );
  return deduped.slice(-100);
}

// ─── INITIALIZATION ──────────────────────────────────────────────
// Called on auth state change. Loads Supabase data and merges with local cache.

export async function initSharedLearningOnLogin(userId: string): Promise<SharedLearningData> {
  _currentUserId = userId;
  const local = readLocalCache();

  try {
    const { data: row } = await supabase
      .from(TABLE)
      .select('data')
      .eq('user_id', userId)
      .single();

    if (!row?.data) {
      // No remote data — push local to Supabase
      await pushToSupabase(userId, local);
      _cachedData = local;
      return local;
    }

    const remote = row.data as SharedLearningData;
    const merged: SharedLearningData = {
      ...DEFAULT_SHARED_DATA,
      ...remote,
      ...local,
      completedChapters: unique([...remote.completedChapters, ...local.completedChapters]),
      completedTopics: unique([...remote.completedTopics, ...local.completedTopics]),
      weakAreas: unique([...remote.weakAreas, ...local.weakAreas]),
      strongAreas: unique([...remote.strongAreas, ...local.strongAreas]),
      frequentMistakes: unique([...remote.frequentMistakes, ...local.frequentMistakes]).slice(-50),
      wrongQuestionHistory: unique([...remote.wrongQuestionHistory, ...local.wrongQuestionHistory]).slice(-200),
      revisionHistory: unique([...remote.revisionHistory, ...local.revisionHistory]).slice(-100),
      mockTestPerformance: deepMergePerformance(remote.mockTestPerformance, local.mockTestPerformance),
      practicePerformance: deepMergePerformance(remote.practicePerformance, local.practicePerformance),
      quizPerformance: deepMergePerformance(remote.quizPerformance, local.quizPerformance),
      recommendedRevisionTopics: unique([...remote.recommendedRevisionTopics, ...local.recommendedRevisionTopics]).slice(-20),
      aiTutorProgress: {
        topicsCovered: Math.max(remote.aiTutorProgress.topicsCovered, local.aiTutorProgress.topicsCovered),
        totalTime: Math.max(remote.aiTutorProgress.totalTime, local.aiTutorProgress.totalTime),
      },
      studyRoomActivity: {
        sessionsJoined: Math.max(remote.studyRoomActivity.sessionsJoined, local.studyRoomActivity.sessionsJoined),
        lastActive: remote.studyRoomActivity.lastActive > local.studyRoomActivity.lastActive
          ? remote.studyRoomActivity.lastActive
          : local.studyRoomActivity.lastActive,
      },
      preferredDifficulty: local.preferredDifficulty !== 'mixed' ? local.preferredDifficulty : remote.preferredDifficulty,
      learningPace: local.learningPace !== 'average' ? local.learningPace : remote.learningPace,
      preferredLanguage: local.preferredLanguage !== 'English' ? local.preferredLanguage : remote.preferredLanguage,
    };

    writeLocalCache(merged);
    _cachedData = merged;

    // Push merged data back to Supabase to keep it in sync
    await pushToSupabase(userId, merged);

    return merged;
  } catch {
    _cachedData = local;
    return local;
  }
}

export function initSharedLearningOnLogout(): void {
  _currentUserId = null;
  _cachedData = null;
  clearLocalCache();
}

// ─── CORE READ/WRITE ─────────────────────────────────────────────
// Supabase-first when logged in, localStorage fallback.

async function pushToSupabase(userId: string, data: SharedLearningData): Promise<void> {
  if (_syncInProgress) return;
  _syncInProgress = true;
  try {
    await supabase
      .from(TABLE)
      .upsert(
        { user_id: userId, data, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );
  } catch { /* best effort */ }
  _syncInProgress = false;
}

async function pullFromSupabase(userId: string): Promise<SharedLearningData | null> {
  try {
    const { data: row } = await supabase
      .from(TABLE)
      .select('data')
      .eq('user_id', userId)
      .single();
    return (row?.data as SharedLearningData) || null;
  } catch {
    return null;
  }
}

export async function getSharedLearningDataAsync(): Promise<SharedLearningData> {
  if (_cachedData) return { ..._cachedData };

  if (_currentUserId) {
    const remote = await pullFromSupabase(_currentUserId);
    if (remote) {
      _cachedData = { ...DEFAULT_SHARED_DATA, ...remote };
      writeLocalCache(_cachedData);
      return { ..._cachedData };
    }
  }

  const local = readLocalCache();
  _cachedData = local;
  return { ...local };
}

export function getSharedLearningData(): SharedLearningData {
  if (_cachedData) return { ..._cachedData };
  const local = readLocalCache();
  _cachedData = local;
  return { ...local };
}

async function saveAndSync(data: SharedLearningData): Promise<void> {
  _cachedData = { ...data };
  writeLocalCache(data);

  if (_currentUserId) {
    await pushToSupabase(_currentUserId, data);
  }
}

// ─── UPDATE FUNCTIONS (async, database-first) ────────────────────

export async function updateMockTestPerformance(summary: PerformanceSummary): Promise<void> {
  const data = getSharedLearningData();
  data.mockTestPerformance.push(summary);
  if (data.mockTestPerformance.length > 100) {
    data.mockTestPerformance = data.mockTestPerformance.slice(-100);
  }
  await saveAndSync(data);
}

export async function updateWeakAreas(chapters: string[]): Promise<void> {
  const data = getSharedLearningData();
  for (const ch of chapters) {
    if (!data.weakAreas.includes(ch)) {
      data.weakAreas.push(ch);
    }
  }
  await saveAndSync(data);
}

export async function updateStrongAreas(chapters: string[]): Promise<void> {
  const data = getSharedLearningData();
  for (const ch of chapters) {
    if (!data.strongAreas.includes(ch)) {
      data.strongAreas.push(ch);
    }
    data.weakAreas = data.weakAreas.filter((w) => w !== ch);
  }
  await saveAndSync(data);
}

export async function addFrequentMistake(mistake: string): Promise<void> {
  const data = getSharedLearningData();
  data.frequentMistakes.push(mistake);
  if (data.frequentMistakes.length > 50) {
    data.frequentMistakes = data.frequentMistakes.slice(-50);
  }
  await saveAndSync(data);
}

export async function addWrongQuestionToHistory(questionId: string): Promise<void> {
  const data = getSharedLearningData();
  data.wrongQuestionHistory = data.wrongQuestionHistory.filter((q) => q !== questionId);
  data.wrongQuestionHistory.push(questionId);
  if (data.wrongQuestionHistory.length > 200) {
    data.wrongQuestionHistory = data.wrongQuestionHistory.slice(-200);
  }
  await saveAndSync(data);
}

export async function addRevisionTopic(topic: string): Promise<void> {
  const data = getSharedLearningData();
  data.revisionHistory = data.revisionHistory.filter((t) => t !== topic);
  data.revisionHistory.push(topic);
  if (data.revisionHistory.length > 100) {
    data.revisionHistory = data.revisionHistory.slice(-100);
  }
  await saveAndSync(data);
}

export async function updateLearningPreferences(
  difficulty?: Difficulty,
  pace?: string,
  language?: string
): Promise<void> {
  const data = getSharedLearningData();
  if (difficulty !== undefined) data.preferredDifficulty = difficulty;
  if (pace !== undefined) data.learningPace = pace;
  if (language !== undefined) data.preferredLanguage = language;
  await saveAndSync(data);
}

export async function updateAITutorProgress(
  topicsCovered: number,
  totalTime: number
): Promise<void> {
  const data = getSharedLearningData();
  data.aiTutorProgress = { topicsCovered, totalTime };
  await saveAndSync(data);
}

export async function updateStudyRoomActivity(sessionsJoined?: number): Promise<void> {
  const data = getSharedLearningData();
  if (sessionsJoined !== undefined) {
    data.studyRoomActivity.sessionsJoined = sessionsJoined;
  } else {
    data.studyRoomActivity.sessionsJoined += 1;
  }
  data.studyRoomActivity.lastActive = new Date().toISOString();
  await saveAndSync(data);
}

export async function addRecommendedRevisionTopic(topic: string): Promise<void> {
  const data = getSharedLearningData();
  data.recommendedRevisionTopics = data.recommendedRevisionTopics.filter((t) => t !== topic);
  data.recommendedRevisionTopics.push(topic);
  if (data.recommendedRevisionTopics.length > 20) {
    data.recommendedRevisionTopics = data.recommendedRevisionTopics.slice(-20);
  }
  await saveAndSync(data);
}

export async function updatePracticePerformance(summary: PerformanceSummary): Promise<void> {
  const data = getSharedLearningData();
  data.practicePerformance.push(summary);
  if (data.practicePerformance.length > 100) {
    data.practicePerformance = data.practicePerformance.slice(-100);
  }
  await saveAndSync(data);
}

export async function updateQuizPerformance(summary: PerformanceSummary): Promise<void> {
  const data = getSharedLearningData();
  data.quizPerformance.push(summary);
  if (data.quizPerformance.length > 100) {
    data.quizPerformance = data.quizPerformance.slice(-100);
  }
  await saveAndSync(data);
}

export async function addCompletedChapter(chapter: string): Promise<void> {
  const data = getSharedLearningData();
  if (!data.completedChapters.includes(chapter)) {
    data.completedChapters.push(chapter);
  }
  await saveAndSync(data);
}

export async function addCompletedTopic(topic: string): Promise<void> {
  const data = getSharedLearningData();
  if (!data.completedTopics.includes(topic)) {
    data.completedTopics.push(topic);
  }
  await saveAndSync(data);
}

// ─── READ FUNCTIONS (sync, from cache) ───────────────────────────

export function getPerformanceTrend(
  metric: 'score' | 'accuracy',
  limit: number = 10
): PerformanceSummary[] {
  const data = getSharedLearningData();
  const entries = data.mockTestPerformance.slice(-limit);
  if (metric === 'score') {
    return entries.sort((a, b) => b.score - a.score);
  }
  return entries.sort((a, b) => b.percentage - a.percentage);
}

export function getWeakChaptersForRevision(limit: number = 10): string[] {
  const data = getSharedLearningData();
  const counts: Record<string, number> = {};
  for (const ch of data.weakAreas) {
    counts[ch] = (counts[ch] || 0) + 1;
  }
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([ch]) => ch);
}

// ─── FORCE SYNC ──────────────────────────────────────────────────

export async function forceSyncToSupabase(): Promise<void> {
  if (!_currentUserId) return;
  const data = getSharedLearningData();
  await pushToSupabase(_currentUserId, data);
}

export async function forceSyncFromSupabase(): Promise<SharedLearningData | null> {
  if (!_currentUserId) return null;
  const remote = await pullFromSupabase(_currentUserId);
  if (remote) {
    _cachedData = { ...DEFAULT_SHARED_DATA, ...remote };
    writeLocalCache(_cachedData);
    return { ..._cachedData };
  }
  return null;
}

// ─── CROSS-MODULE READ API ───────────────────────────────────────
// Other modules (AI Tutor, Quizzes, Practice Papers) call these

export async function getLearningProfileForAITutor(): Promise<{
  weakAreas: string[];
  strongAreas: string[];
  completedChapters: string[];
  preferredDifficulty: Difficulty;
  recentPerformance: PerformanceSummary[];
}> {
  const data = await getSharedLearningDataAsync();
  return {
    weakAreas: data.weakAreas,
    strongAreas: data.strongAreas,
    completedChapters: data.completedChapters,
    preferredDifficulty: data.preferredDifficulty,
    recentPerformance: data.mockTestPerformance.slice(-5),
  };
}

export async function getRevisionRecommendations(): Promise<string[]> {
  const data = await getSharedLearningDataAsync();
  return data.recommendedRevisionTopics;
}

export async function getCrossModuleStats(): Promise<{
  totalMockTests: number;
  totalQuizzes: number;
  totalPracticePapers: number;
  avgMockScore: number;
  avgQuizScore: number;
  avgPracticeScore: number;
  topicsCoveredByAITutor: number;
  studyRoomSessions: number;
}> {
  const data = await getSharedLearningDataAsync();
  const mockScores = data.mockTestPerformance.map((p) => p.percentage);
  const quizScores = data.quizPerformance.map((p) => p.percentage);
  const practiceScores = data.practicePerformance.map((p) => p.percentage);

  return {
    totalMockTests: data.mockTestPerformance.length,
    totalQuizzes: data.quizPerformance.length,
    totalPracticePapers: data.practicePerformance.length,
    avgMockScore: mockScores.length ? mockScores.reduce((a, b) => a + b, 0) / mockScores.length : 0,
    avgQuizScore: quizScores.length ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length : 0,
    avgPracticeScore: practiceScores.length ? practiceScores.reduce((a, b) => a + b, 0) / practiceScores.length : 0,
    topicsCoveredByAITutor: data.aiTutorProgress.topicsCovered,
    studyRoomSessions: data.studyRoomActivity.sessionsJoined,
  };
}
