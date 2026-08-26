'use client'

import {
  ArrowRight,
  CircleHelp,
  ClipboardCheck,
  ClipboardList,
  Layers,
  MessageSquareText,
  MessageCircle,
  Sparkles,
  StickyNote,
  Timer,
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Modal } from './Modal'

type Tool = {
  name: string
  sub: string
  cta: string
  icon: React.ComponentType<{ className?: string }>
  kind: 'quiz' | 'list' | 'ai' | 'notes' | 'flashcards' | 'checker' | 'ask'
}

const TOOLS: Tool[] = [
  {
    name: 'Ask Anything',
    sub: 'Type any question, get an instant AI answer',
    cta: 'Ask Now',
    icon: MessageSquareText,
    kind: 'ask',
  },
  { name: 'AI Learn', sub: 'AI tutor that explains topics step by step', cta: 'Ask Anything', icon: Sparkles, kind: 'ai' },
  {
    name: 'Doubt Solver',
    sub: 'Instant solutions for subject doubts',
    cta: 'Solve Doubts',
    icon: MessageCircle,
    kind: 'ai',
  },
  {
    name: 'Answer Checker',
    sub: 'Checks your written answers like a board examiner',
    cta: 'Check My Copy',
    icon: ClipboardCheck,
    kind: 'checker',
  },
  { name: 'Flash Cards', sub: 'Flip Q&A cards for quick revision', cta: 'Start', icon: Layers, kind: 'flashcards' },
  { name: 'Notes', sub: 'Chapter notes & key concepts in one click', cta: 'Open', icon: StickyNote, kind: 'notes' },
  { name: 'Quizzes', sub: 'MCQ questions to test every chapter', cta: 'Start Quiz', icon: CircleHelp, kind: 'quiz' },
  {
    name: 'Practice Papers',
    sub: 'Subjective questions for board-pattern practice',
    cta: 'Try Now',
    icon: ClipboardList,
    kind: 'list',
  },
  { name: 'Mock Tests', sub: 'Full-length timed test with mixed MCQ + subjective questions', cta: 'Attempt', icon: Timer, kind: 'list' },
]

const QUIZ = {
  question: 'Which of the following is an irrational number?',
  options: ['0.75', '√2', '22/7', '−4'],
  answer: 1,
}

function QuizDemo() {
  const [picked, setPicked] = useState<number | null>(null)

  return (
    <div>
      <p className="text-sm font-medium text-balance">{QUIZ.question}</p>
      <div className="mt-4 flex flex-col gap-2">
        {QUIZ.options.map((opt, i) => {
          const isPicked = picked === i
          const correct = i === QUIZ.answer
          const state =
            picked === null
              ? 'border-border hover:border-primary/50'
              : correct
                ? 'border-primary bg-primary/10 text-primary'
                : isPicked
                  ? 'border-destructive/60 bg-destructive/10 text-destructive'
                  : 'border-border opacity-60'
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setPicked(i)}
              className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${state}`}
            >
              <span className="mr-2 font-mono text-xs opacity-70">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          )
        })}
      </div>
      {picked !== null ? (
        <div className="mt-4 rounded-lg border border-primary/25 bg-primary/10 p-3 text-xs leading-relaxed text-muted-foreground">
          {picked === QUIZ.answer ? 'Correct! ' : 'Not quite. '}
          {'√2 is irrational because it cannot be written as p/q where p and q are integers.'}
          <button
            type="button"
            onClick={() => setPicked(null)}
            className="mt-2 block font-semibold text-primary"
          >
            Try again
          </button>
        </div>
      ) : null}
    </div>
  )
}

function AiDemo() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hi! Ask me anything from your Class 9 NCERT syllabus.' },
  ])
  const [input, setInput] = useState('')

  const send = () => {
    const q = input.trim()
    if (!q) return
    setMessages((m) => [
      ...m,
      { role: 'user', text: q },
      {
        role: 'ai',
        text: `Here is a step-by-step approach to "${q}" — start by identifying what is given, then apply the relevant NCERT concept, and finally verify your answer.`,
      },
    ])
    setInput('')
  }

  return (
    <div>
      <div className="flex max-h-56 flex-col gap-2 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
              m.role === 'user'
                ? 'gold-btn self-end font-medium'
                : 'self-start border border-border bg-card text-muted-foreground'
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) send()
          }}
          placeholder="Ask a doubt…"
          className="flex-1 rounded-lg border border-input bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary/60"
        />
        <button type="button" onClick={send} className="gold-btn rounded-lg px-4 text-sm font-semibold">
          Ask
        </button>
      </div>
    </div>
  )
}

function ListDemo({ name }: { name: string }) {
  return (
    <ul className="flex flex-col gap-2">
      {[`${name} — Set 1`, `${name} — Set 2`, `${name} — Set 3`, `${name} — Set 4`].map((s) => (
        <li key={s}>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:border-primary/50 hover:text-primary"
          >
            {s}
            <ArrowRight className="size-4" />
          </button>
        </li>
      ))}
    </ul>
  )
}

export function StudyTools() {
  const router = useRouter()
  const [active, setActive] = useState<Tool | null>(null)
  const [allOpen, setAllOpen] = useState(false)

  return (
    <section id="tools" className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="rounded-2xl border border-primary/45 bg-[linear-gradient(150deg,color-mix(in_oklch,var(--gold)_10%,var(--background)),var(--background))] p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="gold-text text-xl font-bold tracking-tight sm:text-2xl">
            Powerful AI Tools
          </h2>
          <button
            type="button"
            onClick={() => setAllOpen(true)}
            className="group inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:text-sm"
          >
            View All Tools
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {TOOLS.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.name}
                type="button"
                onClick={() => {
                  if (tool.kind === 'ask') {
                    router.push('/ask-anything')
                    return
                  }
                  if (tool.kind === 'ai') {
                    router.push('/ai-learn')
                    return
                  }
                  if (tool.kind === 'checker') {
                    router.push('/answer-checker')
                    return
                  }
                  if (tool.kind === 'quiz') {
                    router.push('/quizzes')
                    return
                  }
                  if (tool.kind === 'notes') {
                    router.push('/notes')
                    return
                  }
                  if (tool.kind === 'flashcards') {
                    router.push('/flash-cards')
                    return
                  }
                  setActive(tool)
                }}
                className="group flex flex-col items-center gap-2 rounded-xl border border-primary/40 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--gold)_16%,var(--background)),var(--background))] px-3 py-5 text-center transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[0_14px_34px_-14px_var(--gold)]"
              >
                <span className="grid size-11 place-items-center rounded-xl border border-primary/45 bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="text-[13px] font-bold">{tool.name}</span>
                <span className="text-[11px] leading-tight text-muted-foreground">{tool.sub}</span>
                <span className="mt-2 rounded-lg border border-primary/50 px-3 py-1.5 text-[11px] font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {tool.cta}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        title={active?.name ?? ''}
        subtitle={active?.sub}
      >
        {active?.kind === 'quiz' ? <QuizDemo /> : null}
        {active?.kind === 'ai' ? <AiDemo /> : null}
        {active?.kind === 'list' ? <ListDemo name={active.name} /> : null}
      </Modal>

      <Modal
        open={allOpen}
        onClose={() => setAllOpen(false)}
        title="All study tools"
        subtitle="Everything you need to prepare, practise and revise."
      >
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Ask Anything', href: '/ask-anything', desc: 'Type any question, get an instant AI answer' },
            { label: 'AI Learn', href: '/ai-learn', desc: 'AI tutor that explains topics step by step' },
            { label: 'Answer Checker', href: '/answer-checker', desc: 'Checks your written answers like a board examiner' },
            { label: 'Flash Cards', href: '/flash-cards', desc: 'Flip Q&A cards for quick revision' },
            { label: 'Notes', href: '/notes', desc: 'Chapter notes & key concepts in one click' },
            { label: 'Quizzes', href: '/quizzes', desc: 'MCQ questions to test every chapter' },
            { label: 'Practice Papers', href: '/practice', desc: 'Subjective questions for board-pattern practice' },
            { label: 'Mock Tests', href: '/mock-tests', desc: 'Full-length timed test with mixed MCQ + subjective questions' },
            { label: 'Doubt Solver', href: '/ai-learn', desc: 'Instant solutions for subject doubts' },
            { label: 'Study Room', href: '/study-room', desc: 'Focus study sessions with a timer' },
          ].map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => { setAllOpen(false); router.push(t.href); }}
              className="flex flex-col rounded-lg border border-border px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/50 hover:text-primary"
            >
              {t.label}
              <span className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{t.desc}</span>
            </button>
          ))}
        </div>
      </Modal>
    </section>
  )
}
