import { useState, useMemo } from 'react'
import { useMockTestStore } from '@/store/mockTestStore'
import { CLASS_9_KNOWLEDGE } from '@/lib/mock-tests/question-bank'
import { saveTestConfig } from '@/lib/mock-tests/storage'
import { canGenerateMockTest, recordMockTestUsage, getMockTestGuestRemaining } from '@/lib/mock-tests/rate-limiter'
import { useAuthStore } from '@/store/authStore'
import type { TestConfig } from '@/lib/mock-tests/types'
import {
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Loader2,
  Zap,
} from 'lucide-react'

const SUBJECTS = [
  { id: 'maths', label: 'Mathematics', book: 'Ganita Manjari Part I' },
  { id: 'science', label: 'Science', book: 'Exploration' },
  { id: 'english', label: 'English', book: 'Kaveri' },
  { id: 'sst', label: 'Social Science', book: 'Understanding Society: India and Beyond' },
  { id: 'it-part-a', label: 'IT Part A', book: 'Employability Skills' },
  { id: 'it-part-b', label: 'IT Part B', book: 'Code 402' },
  { id: 'advanced-maths', label: 'Advanced Mathematics', book: 'Advanced Mathematics' },
  { id: 'advanced-science', label: 'Advanced Science', book: 'Advanced Science' },
] as const

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'hard', label: 'Hard' },
  { value: 'mixed', label: 'Mixed' },
]

const QUESTION_PRESETS = [5, 10, 15, 20, 25, 50]

const STEPS = ['Subject', 'Chapters', 'Difficulty', 'Questions']

const optionBtn = (active: boolean) => ({
  background: active ? 'var(--brand-primary)' : 'var(--surface-2)',
  color: active ? '#fff' : 'var(--text-primary)',
  borderColor: active ? 'var(--brand-primary)' : 'var(--border)',
})

export default function TestSetup() {
  const { isGuest } = useAuthStore()
  const setConfig = useMockTestStore((s) => s.setConfig)
  const startTest = useMockTestStore((s) => s.startTest)

  const [step, setStep] = useState(0)
  const [subject, setSubject] = useState('maths')
  const [chapterMode, setChapterMode] = useState<'entire-book' | 'multiple'>('entire-book')
  const [selectedChapters, setSelectedChapters] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState('mixed')
  const [questionCount, setQuestionCount] = useState(20)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guestRemaining, setGuestRemaining] = useState(5)

  const currentSubject = useMemo(() => SUBJECTS.find((s) => s.id === subject)!, [subject])
  const chapters = useMemo(() => {
    const knowledge = CLASS_9_KNOWLEDGE[subject as keyof typeof CLASS_9_KNOWLEDGE]
    return knowledge?.chapters ?? []
  }, [subject])

  const effectiveChapterCount = chapterMode === 'entire-book' ? chapters.length : selectedChapters.length

  const estimatedTime = useMemo(() => {
    const avgMinutes = difficulty === 'easy' ? 1 : difficulty === 'hard' ? 2 : 1.5
    return Math.ceil(questionCount * avgMinutes)
  }, [questionCount, difficulty])

  const canProceed = () => {
    if (step === 0) return true
    if (step === 1) return chapterMode === 'entire-book' || selectedChapters.length > 0
    return true
  }

  const handleChapterToggle = (chapterNum: string) => {
    setSelectedChapters((prev) =>
      prev.includes(chapterNum) ? prev.filter((c) => c !== chapterNum) : [...prev, chapterNum]
    )
  }

  const handleStart = async () => {
    setError(null)

    const { allowed, reason } = canGenerateMockTest()
    if (!allowed) {
      setError(reason || 'Rate limit reached')
      return
    }

    setLoading(true)
    try {
      const testConfig: TestConfig = {
        subject,
        book: currentSubject.book,
        classLevel: '9',
        chapterMode,
        chapters: chapterMode === 'entire-book' ? chapters.map((c) => String(c.chapterNumber)) : selectedChapters,
        difficulty: difficulty as TestConfig['difficulty'],
        questionCount,
      }

      saveTestConfig(testConfig)
      setConfig(testConfig)
      recordMockTestUsage()
      if (isGuest) setGuestRemaining(getMockTestGuestRemaining())

      const res = await fetch('/api/mock-test/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: testConfig }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to generate test' }))
        throw new Error(err.error || 'Failed to generate test')
      }

      const data = await res.json()

      const mockTest = {
        id: crypto.randomUUID(),
        config: testConfig,
        questions: data.questions,
        createdAt: new Date(),
        timeLimit: estimatedTime * 60,
      }

      startTest(mockTest, testConfig)
    } catch (err: any) {
      setError(err.message || 'Failed to generate test. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--surface-0)' }}>
      <div className="w-full max-w-xl rounded-2xl p-8 shadow-xl border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--brand-primary)' }}>
            <ClipboardCheck size={20} color="#fff" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Create Mock Test</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Step {step + 1} of {STEPS.length}</p>
          </div>
          {isGuest && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{
              background: guestRemaining > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: guestRemaining > 0 ? '#22c55e' : '#ef4444',
              border: `1px solid ${guestRemaining > 0 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}>
              <Zap size={12} /> {guestRemaining}/5 free today
            </div>
          )}
        </div>

        <div className="flex gap-1.5 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300" style={{ background: i <= step ? 'var(--brand-primary)' : 'var(--surface-2)' }} />
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{STEPS[step]}</h3>

        <div className="min-h-[200px]">
          {step === 0 && (
            <div className="space-y-3 animate-fadeIn">
              {SUBJECTS.map((s) => (
                <button key={s.id} onClick={() => { setSubject(s.id); setSelectedChapters([]) }} className="w-full px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 border" style={optionBtn(subject === s.id)}>
                  {s.label}
                  <span className="text-xs ml-2" style={{ color: subject === s.id ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>{s.book}</span>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex gap-2 mb-4">
                <button onClick={() => { setChapterMode('entire-book'); setSelectedChapters([]) }} className="flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border" style={optionBtn(chapterMode === 'entire-book')}>
                  Entire Book ({chapters.length} chapters)
                </button>
                <button onClick={() => setChapterMode('multiple')} className="flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border" style={optionBtn(chapterMode === 'multiple')}>
                  Select Chapters
                </button>
              </div>
              {chapterMode === 'multiple' && (
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {chapters.map((ch) => (
                    <button key={ch.chapterNumber} onClick={() => handleChapterToggle(String(ch.chapterNumber))} className="w-full px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 border text-sm" style={optionBtn(selectedChapters.includes(String(ch.chapterNumber)))}>
                      {ch.chapterNumber}. {ch.chapter}
                    </button>
                  ))}
                </div>
              )}
              {chapterMode === 'entire-book' && (
                <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
                  All <span className="font-bold" style={{ color: 'var(--brand-primary)' }}>{chapters.length}</span> chapters will be included
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 animate-fadeIn">
              {DIFFICULTIES.map((d) => (
                <button key={d.value} onClick={() => setDifficulty(d.value)} className="w-full px-4 py-4 rounded-xl text-left font-medium transition-all duration-200 border flex items-center gap-3"
                  style={{ background: difficulty === d.value ? 'var(--surface-2)' : 'transparent', borderColor: difficulty === d.value ? 'var(--brand-primary)' : 'var(--border)', borderWidth: difficulty === d.value ? '2px' : '1px' }}
                >
                  <span style={{ color: difficulty === d.value ? 'var(--brand-primary)' : 'var(--text-primary)' }}>{d.label}</span>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeIn">
              <div className="flex flex-wrap gap-3 justify-center mb-4">
                {QUESTION_PRESETS.map((count) => (
                  <button key={count} onClick={() => setQuestionCount(count)} className="w-20 h-12 rounded-xl flex items-center justify-center font-bold text-lg border transition-all duration-200 hover:scale-105 active:scale-95"
                    style={optionBtn(questionCount === count)}
                  >
                    {count}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => setQuestionCount(n => Math.max(1, n - 1))} className="w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-95" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  <ChevronDown size={22} />
                </button>
                <input type="number" min={1} value={questionCount} onChange={(e) => { const v = parseInt(e.target.value); if (!isNaN(v) && v >= 1) setQuestionCount(v) }}
                  className="w-28 h-14 rounded-xl text-center text-3xl font-bold outline-none border transition-all duration-200 focus:ring-2" style={{ background: 'var(--surface-1)', borderColor: 'var(--brand-primary)', color: 'var(--text-primary)' }} />
                <button onClick={() => setQuestionCount(n => n + 1)} className="w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-95" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  <ChevronUp size={22} />
                </button>
              </div>
              <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)' }}>~{estimatedTime} min · {effectiveChapterCount} chapter{effectiveChapterCount !== 1 ? 's' : ''}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border" style={{ background: 'transparent', color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
              <ChevronLeft size={16} /> Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()} className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200"
              style={{ background: canProceed() ? 'var(--brand-primary)' : 'var(--surface-2)', color: canProceed() ? '#fff' : 'var(--text-muted)' }}>
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleStart} disabled={loading || (isGuest && guestRemaining <= 0)} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-lg transition-all duration-200"
              style={{ background: loading || (isGuest && guestRemaining <= 0) ? 'var(--surface-2)' : 'var(--brand-primary)', color: loading || (isGuest && guestRemaining <= 0) ? 'var(--text-muted)' : '#fff' }}>
              {loading ? <><Loader2 size={20} className="animate-spin" /> Generating...</> : <><ClipboardCheck size={20} /> Start Test</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
