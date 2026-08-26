export type LearningProfile = {
  classLevel: string
  board: string
  language: string
  learningGoals: string[]
  targetMarks: string
  weakSubjects: string[]
  teachingStyles: string[]
  competitiveExams: string[]
  otherExam: string
  completedOnboarding: boolean
}

export type LearningMemory = {
  completedTopics: { topic: string; chapter: string; subject: string; ts: number }[]
  weakChapters: { chapter: string; subject: string; ts: number }[]
  revisionHistory: { topic: string; ts: number; score?: number }[]
  mistakes: { question: string; correctAnswer: string; topic: string; ts: number }[]
  totalXP: number
  level: number
  streak: number
  lastActiveDate: string
  badges: string[]
  dailyGoalMinutes: number
  totalMinutesStudied: number
}

const PROFILE_KEY = 'sn_ai_learning_profile'
const MEMORY_KEY = 'sn_ai_learning_memory'

const defaultProfile: LearningProfile = {
  classLevel: '',
  board: 'CBSE',
  language: 'English',
  learningGoals: [],
  targetMarks: '',
  weakSubjects: [],
  teachingStyles: [],
  competitiveExams: [],
  otherExam: '',
  completedOnboarding: false,
}

const defaultMemory: LearningMemory = {
  completedTopics: [],
  weakChapters: [],
  revisionHistory: [],
  mistakes: [],
  totalXP: 0,
  level: 1,
  streak: 0,
  lastActiveDate: '',
  badges: [],
  dailyGoalMinutes: 60,
  totalMinutesStudied: 0,
}

export function getProfile(): LearningProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return { ...defaultProfile }
    return { ...defaultProfile, ...JSON.parse(raw) }
  } catch {
    return { ...defaultProfile }
  }
}

export function saveProfile(profile: Partial<LearningProfile>): LearningProfile {
  const current = getProfile()
  const updated = { ...current, ...profile }
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated))
  } catch {}
  return updated
}

export function getMemory(): LearningMemory {
  try {
    const raw = localStorage.getItem(MEMORY_KEY)
    if (!raw) return { ...defaultMemory }
    return { ...defaultMemory, ...JSON.parse(raw) }
  } catch {
    return { ...defaultMemory }
  }
}

export function saveMemory(memory: Partial<LearningMemory>): LearningMemory {
  const current = getMemory()
  const updated = { ...current, ...memory }
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(updated))
  } catch {}
  return updated
}

export function addCompletedTopic(topic: string, chapter: string, subject: string): LearningMemory {
  const mem = getMemory()
  const exists = mem.completedTopics.some(
    (t) => t.topic === topic && t.chapter === chapter
  )
  if (exists) return mem
  return saveMemory({
    completedTopics: [...mem.completedTopics, { topic, chapter, subject, ts: Date.now() }],
  })
}

export function addWeakChapter(chapter: string, subject: string): LearningMemory {
  const mem = getMemory()
  const exists = mem.weakChapters.some((c) => c.chapter === chapter && c.subject === subject)
  if (exists) return mem
  return saveMemory({
    weakChapters: [...mem.weakChapters, { chapter, subject, ts: Date.now() }],
  })
}

export function removeWeakChapter(chapter: string): LearningMemory {
  const mem = getMemory()
  return saveMemory({
    weakChapters: mem.weakChapters.filter((c) => c.chapter !== chapter),
  })
}

export function addRevision(topic: string, score?: number): LearningMemory {
  const mem = getMemory()
  return saveMemory({
    revisionHistory: [...mem.revisionHistory, { topic, ts: Date.now(), score }].slice(-100),
  })
}

export function addMistake(question: string, correctAnswer: string, topic: string): LearningMemory {
  const mem = getMemory()
  return saveMemory({
    mistakes: [...mem.mistakes, { question, correctAnswer, topic, ts: Date.now() }].slice(-200),
  })
}

export function addXP(amount: number): LearningMemory {
  const mem = getMemory()
  const newXP = mem.totalXP + amount
  const newLevel = Math.floor(newXP / 100) + 1
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const newStreak = mem.lastActiveDate === yesterday ? mem.streak + 1 : mem.lastActiveDate === today ? mem.streak : 1
  return saveMemory({
    totalXP: newXP,
    level: newLevel,
    streak: newStreak,
    lastActiveDate: today,
  })
}

export function updateStreak(): LearningMemory {
  const mem = getMemory()
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  if (mem.lastActiveDate === today) return mem
  const newStreak = mem.lastActiveDate === yesterday ? mem.streak + 1 : 1
  return saveMemory({
    streak: newStreak,
    lastActiveDate: today,
  })
}

export function addMinutesStudied(minutes: number): LearningMemory {
  const mem = getMemory()
  return saveMemory({
    totalMinutesStudied: mem.totalMinutesStudied + minutes,
  })
}

export function awardBadge(badge: string): LearningMemory {
  const mem = getMemory()
  if (mem.badges.includes(badge)) return mem
  return saveMemory({ badges: [...mem.badges, badge] })
}

export function hasCompletedOnboarding(): boolean {
  return getProfile().completedOnboarding
}
