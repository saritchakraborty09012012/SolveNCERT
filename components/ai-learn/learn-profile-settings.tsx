'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Settings, Check } from 'lucide-react'
import { getProfile, saveProfile, type LearningProfile } from '@/lib/ai-learn/profile'

type Props = { onClose: () => void }

const CLASSES = ['6', '7', '8', '9', '10', '11', '12', 'Custom / No Class']
const BOARDS = ['CBSE', 'ICSE', 'State Board', 'Other']
const LANGUAGES = ['English', 'Hindi', 'Hinglish']
const GOALS = ['Board Exam Preparation', 'Competitive Exam Prep', 'Concept Clarity', 'Homework Help', 'General Learning']
const TARGETS = ['90%+', '75-90%', '60-75%', 'Below 60%', 'No Specific Target']
const SITE_SUBJECTS = ['Mathematics', 'Science', 'English', 'Hindi', 'Sanskrit', 'Social Science', 'Information Technology', 'Arts']
const STYLES = ['Visual + Diagrams', 'Step-by-step', 'Real-life Examples', 'Story Mode', 'Quick Revision', 'Adaptive (AI chooses)']
const EXAMS = ['None', 'JEE Main', 'JEE Advanced', 'NEET UG', 'CUET', 'CLAT', 'NSEJS', 'IOQM-IMO', 'NTSE', 'KVPY', 'Olympiad', 'Other']

function PillGroup({ items, selected, onToggle, color }: { items: string[]; selected: string[]; onToggle: (v: string) => void; color?: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => {
        const active = selected.includes(item)
        return (
          <button key={item} onClick={() => onToggle(item)}
            className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-all ${
              active
                ? color === 'amber' ? 'border-amber-400 bg-amber-400/15 text-amber-300' : 'border-cyan-400 bg-cyan-400/15 text-cyan-300'
                : 'border-cyan-800/20 text-cyan-200/40 hover:border-cyan-600/20'
            }`}>
            {active && <Check className="inline size-3 mr-1" />}
            {item}
          </button>
        )
      })}
    </div>
  )
}

export function LearnProfileSettings({ onClose }: Props) {
  const [profile, setProfile] = useState<LearningProfile>(getProfile)
  const [otherInput, setOtherInput] = useState(profile.otherExam || '')
  const [saved, setSaved] = useState(false)

  const toggle = (key: 'learningGoals' | 'weakSubjects' | 'teachingStyles' | 'competitiveExams', item: string) => {
    setProfile((p) => {
      const arr = p[key] ?? []
      return { ...p, [key]: arr.includes(item) ? arr.filter((s) => s !== item) : [...arr, item] }
    })
  }

  const set = (key: keyof LearningProfile, value: string) => setProfile((p) => ({ ...p, [key]: value }))

  const handleSave = () => {
    const toSave = { ...profile }
    if (profile.competitiveExams.includes('Other')) toSave.otherExam = otherInput.trim()
    saveProfile(toSave)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#04080c]/90 backdrop-blur-xl" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg mx-4 max-h-[85vh] rounded-2xl border border-cyan-500/20 bg-[#0a1628]/95 shadow-2xl overflow-hidden flex flex-col">

        <div className="flex items-center justify-between p-4 border-b border-cyan-500/10">
          <div className="flex items-center gap-2">
            <Settings className="size-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Learning Profile Settings</h2>
          </div>
          <button onClick={onClose} className="text-cyan-400/40 hover:text-cyan-300 transition-colors"><X className="size-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-cyan-400/50 mb-1.5 block">Class</label>
            <div className="flex flex-wrap gap-1.5">
              {CLASSES.map((c) => (
                <button key={c} onClick={() => set('classLevel', c)}
                  className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition-all ${profile.classLevel === c ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300' : 'border-cyan-800/20 text-cyan-200/40 hover:border-cyan-600/20'}`}>
                  {c === 'Custom / No Class' ? 'Custom' : `Class ${c}`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-cyan-400/50 mb-1.5 block">Board</label>
            <div className="flex flex-wrap gap-1.5">
              {BOARDS.map((b) => (
                <button key={b} onClick={() => set('board', b)}
                  className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition-all ${profile.board === b ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300' : 'border-cyan-800/20 text-cyan-200/40 hover:border-cyan-600/20'}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-cyan-400/50 mb-1.5 block">Language</label>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGES.map((l) => (
                <button key={l} onClick={() => set('language', l)}
                  className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition-all ${profile.language === l ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300' : 'border-cyan-800/20 text-cyan-200/40 hover:border-cyan-600/20'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-cyan-400/50 mb-1.5 block">Learning Goals (multi-select)</label>
            <PillGroup items={GOALS} selected={profile.learningGoals} onToggle={(v) => toggle('learningGoals', v)} />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-cyan-400/50 mb-1.5 block">Target Marks</label>
            <div className="flex flex-wrap gap-1.5">
              {TARGETS.map((t) => (
                <button key={t} onClick={() => set('targetMarks', profile.targetMarks === t ? '' : t)}
                  className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition-all ${profile.targetMarks === t ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300' : 'border-cyan-800/20 text-cyan-200/40 hover:border-cyan-600/20'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-cyan-400/50 mb-1.5 block">Weak Subjects</label>
            <PillGroup items={SITE_SUBJECTS} selected={profile.weakSubjects} onToggle={(v) => toggle('weakSubjects', v)} color="amber" />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-cyan-400/50 mb-1.5 block">Teaching Style (multi-select)</label>
            <PillGroup items={STYLES} selected={profile.teachingStyles} onToggle={(v) => toggle('teachingStyles', v)} />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-cyan-400/50 mb-1.5 block">Competitive Exams (multi-select)</label>
            <PillGroup items={EXAMS} selected={profile.competitiveExams} onToggle={(v) => toggle('competitiveExams', v)} />
            {profile.competitiveExams.includes('Other') && (
              <input value={otherInput} onChange={(e) => setOtherInput(e.target.value)}
                placeholder="Type your exam name..."
                className="mt-2 w-full rounded-lg border border-cyan-700/30 bg-cyan-950/20 px-3 py-2 text-xs text-white placeholder:text-cyan-200/25 focus:outline-none focus:border-cyan-500/40" />
            )}
          </div>
        </div>

        <div className="p-4 border-t border-cyan-500/10 flex items-center justify-between">
          <button onClick={onClose} className="text-xs text-cyan-400/50 hover:text-cyan-300 transition-colors">Cancel</button>
          <button onClick={handleSave}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${saved ? 'bg-green-500/20 border border-green-400/40 text-green-300' : 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30'}`}>
            {saved ? <><Check className="size-3" /> Saved!</> : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
