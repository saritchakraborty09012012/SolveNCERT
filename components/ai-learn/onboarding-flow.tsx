'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { saveProfile, type LearningProfile } from '@/lib/ai-learn/profile'
import { GraduationCap, Target, BookOpen, Globe, Trophy, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'

type Props = { onComplete: () => void }

const CLASSES = ['6', '7', '8', '9', '10', '11', '12', 'Custom / No Class']
const BOARDS = ['CBSE', 'ICSE', 'State Board', 'Other']
const LANGUAGES = ['English', 'Hindi', 'Hinglish']
const GOALS = ['Board Exam Preparation', 'Competitive Exam Prep', 'Concept Clarity', 'Homework Help', 'General Learning']
const TARGETS = ['90%+', '75-90%', '60-75%', 'Below 60%', 'No Specific Target']

const SITE_SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Hindi',
  'Sanskrit',
  'Social Science',
  'Information Technology',
  'Arts',
]

const STYLES = ['Visual + Diagrams', 'Step-by-step', 'Real-life Examples', 'Story Mode', 'Quick Revision', 'Adaptive (AI chooses)']
const EXAMS = ['None', 'JEE Main', 'JEE Advanced', 'NEET UG', 'CUET', 'CLAT', 'NSEJS', 'IOQM-IMO', 'NTSE', 'KVPY', 'Olympiad', 'Other']

const STEPS = [
  { icon: GraduationCap, title: 'Your Class', subtitle: 'Help us personalize your experience' },
  { icon: BookOpen, title: 'Board & Language', subtitle: 'Tailored to your curriculum' },
  { icon: Target, title: 'Learning Goals', subtitle: 'What do you want to achieve?' },
  { icon: Trophy, title: 'Strengths & Style', subtitle: 'So we can teach better' },
]

export function OnboardingFlow({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<Partial<LearningProfile>>({
    board: 'CBSE',
    language: 'English',
    learningGoals: [],
    teachingStyles: [],
    competitiveExams: [],
    otherExam: '',
  })
  const [otherExamInput, setOtherExamInput] = useState('')

  const update = (key: string, value: string) => {
    setProfile((p) => ({ ...p, [key]: value }))
  }

  const toggleArrayItem = (key: 'learningGoals' | 'weakSubjects' | 'teachingStyles' | 'competitiveExams', item: string) => {
    setProfile((p) => {
      const current = (p[key] as string[]) ?? []
      const next = current.includes(item) ? current.filter((s) => s !== item) : [...current, item]
      return { ...p, [key]: next }
    })
  }

  const finish = () => {
    const finalProfile = { ...profile }
    if (profile.competitiveExams?.includes('Other') && otherExamInput.trim()) {
      finalProfile.otherExam = otherExamInput.trim()
    }
    saveProfile({ ...finalProfile, completedOnboarding: true } as Partial<LearningProfile> & { completedOnboarding: boolean })
    onComplete()
  }

  const canNext = () => {
    if (step === 0) return Boolean(profile.classLevel)
    if (step === 1) return Boolean(profile.board)
    if (step === 2) return Boolean(profile.learningGoals && profile.learningGoals.length > 0)
    return true
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#04080c]/95 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg mx-4 rounded-2xl border border-cyan-500/20 bg-[#0a1628]/90 p-6 sm:p-8 shadow-2xl shadow-cyan-500/10 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="size-4 text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400/70">NEXUS</span>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/40 mb-6">SETUP YOUR LEARNING PROFILE</p>

        <div className="flex gap-1.5 mb-6">
          {STEPS.map((s, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-cyan-400' : 'bg-cyan-900/40'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Which class are you in?</h2>
                <p className="text-sm text-cyan-200/50 mb-4">Choose &quot;Custom&quot; if you&apos;re learning beyond school.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CLASSES.map((c) => (
                    <button
                      key={c}
                      onClick={() => update('classLevel', c)}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                        profile.classLevel === c
                          ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300'
                          : 'border-cyan-800/30 bg-cyan-950/20 text-cyan-200/60 hover:border-cyan-600/40'
                      }`}
                    >
                      {c === 'Custom / No Class' ? 'Custom / No Class' : `Class ${c}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Board & Language</h2>
                <p className="text-sm text-cyan-200/50 mb-4">This helps us align explanations to your curriculum.</p>

                <p className="text-xs text-cyan-300/60 mb-2 font-medium uppercase tracking-wider">Board</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {BOARDS.map((b) => (
                    <button
                      key={b}
                      onClick={() => update('board', b)}
                      className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                        profile.board === b
                          ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300'
                          : 'border-cyan-800/30 bg-cyan-950/20 text-cyan-200/60 hover:border-cyan-600/40'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-cyan-300/60 mb-2 font-medium uppercase tracking-wider">Preferred Language</p>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l}
                      onClick={() => update('language', l)}
                      className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                        profile.language === l
                          ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300'
                          : 'border-cyan-800/30 bg-cyan-950/20 text-cyan-200/60 hover:border-cyan-600/40'
                      }`}
                    >
                      <Globe className="inline size-3.5 mr-1.5 opacity-60" />
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Learning Goals</h2>
                <p className="text-sm text-cyan-200/50 mb-4">Select all that apply to you.</p>
                <div className="grid grid-cols-1 gap-2">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      onClick={() => toggleArrayItem('learningGoals', g)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                        profile.learningGoals?.includes(g)
                          ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300'
                          : 'border-cyan-800/30 bg-cyan-950/20 text-cyan-200/60 hover:border-cyan-600/40'
                      }`}
                    >
                      <span className={`mr-2 inline-flex size-4 items-center justify-center rounded border text-[10px] ${
                        profile.learningGoals?.includes(g)
                          ? 'border-cyan-400 bg-cyan-400/30 text-cyan-200'
                          : 'border-cyan-700/40 text-transparent'
                      }`}>
                        {profile.learningGoals?.includes(g) ? '\u2713' : ''}
                      </span>
                      {g}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-cyan-300/60 mt-4 mb-2 font-medium uppercase tracking-wider">Target Marks (Optional)</p>
                <div className="flex flex-wrap gap-2">
                  {TARGETS.map((t) => (
                    <button
                      key={t}
                      onClick={() => update('targetMarks', profile.targetMarks === t ? '' : t)}
                      className={`rounded-lg border px-3 py-1.5 text-xs transition-all ${
                        profile.targetMarks === t
                          ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300'
                          : 'border-cyan-800/30 bg-cyan-950/20 text-cyan-200/60 hover:border-cyan-600/40'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Your Preferences</h2>
                <p className="text-sm text-cyan-200/50 mb-4">Almost done! Tell us a bit more.</p>

                <p className="text-xs text-cyan-300/60 mb-2 font-medium uppercase tracking-wider">Weak Subjects (Select all that apply)</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {SITE_SUBJECTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleArrayItem('weakSubjects', s)}
                      className={`rounded-lg border px-3 py-1.5 text-xs transition-all ${
                        profile.weakSubjects?.includes(s)
                          ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                          : 'border-cyan-800/30 bg-cyan-950/20 text-cyan-200/60 hover:border-cyan-600/40'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-cyan-300/60 mb-2 font-medium uppercase tracking-wider">Preferred Teaching Style (Select multiple)</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleArrayItem('teachingStyles', s)}
                      className={`rounded-lg border px-3 py-1.5 text-xs transition-all ${
                        profile.teachingStyles?.includes(s)
                          ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300'
                          : 'border-cyan-800/30 bg-cyan-950/20 text-cyan-200/60 hover:border-cyan-600/40'
                      }`}
                    >
                      <span className={`mr-1.5 inline-flex size-3.5 items-center justify-center rounded border text-[9px] ${
                        profile.teachingStyles?.includes(s)
                          ? 'border-cyan-400 bg-cyan-400/30 text-cyan-200'
                          : 'border-cyan-700/40 text-transparent'
                      }`}>
                        {profile.teachingStyles?.includes(s) ? '\u2713' : ''}
                      </span>
                      {s}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-cyan-300/60 mb-2 font-medium uppercase tracking-wider">Competitive Exam (Optional, select multiple)</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {EXAMS.map((e) => (
                    <button
                      key={e}
                      onClick={() => toggleArrayItem('competitiveExams', e)}
                      className={`rounded-lg border px-3 py-1.5 text-xs transition-all ${
                        profile.competitiveExams?.includes(e)
                          ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300'
                          : 'border-cyan-800/30 bg-cyan-950/20 text-cyan-200/60 hover:border-cyan-600/40'
                      }`}
                    >
                      <span className={`mr-1.5 inline-flex size-3.5 items-center justify-center rounded border text-[9px] ${
                        profile.competitiveExams?.includes(e)
                          ? 'border-cyan-400 bg-cyan-400/30 text-cyan-200'
                          : 'border-cyan-700/40 text-transparent'
                      }`}>
                        {profile.competitiveExams?.includes(e) ? '\u2713' : ''}
                      </span>
                      {e}
                    </button>
                  ))}
                </div>

                {profile.competitiveExams?.includes('Other') && (
                  <div className="mt-2">
                    <input
                      value={otherExamInput}
                      onChange={(e) => setOtherExamInput(e.target.value)}
                      placeholder="Type your exam name..."
                      className="w-full rounded-lg border border-cyan-700/30 bg-cyan-950/20 px-3 py-2 text-xs text-white placeholder:text-cyan-200/25 focus:outline-none focus:border-cyan-500/40"
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-cyan-800/20">
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-sm text-cyan-400/60 hover:text-cyan-300 transition-colors">
              <ChevronLeft className="size-4" /> Back
            </button>
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => canNext() && setStep(step + 1)}
              disabled={!canNext()}
              className="flex items-center gap-1 rounded-xl bg-cyan-500/20 border border-cyan-400/40 px-5 py-2.5 text-sm font-semibold text-cyan-300 transition-all hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="size-4" />
            </button>
          ) : (
            <button
              onClick={finish}
              className="flex items-center gap-1 rounded-xl bg-cyan-500/30 border border-cyan-400/50 px-5 py-2.5 text-sm font-bold text-cyan-200 transition-all hover:bg-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <Sparkles className="size-4" /> Start Learning
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
