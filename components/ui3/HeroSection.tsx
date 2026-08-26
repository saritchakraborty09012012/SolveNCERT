'use client'

import {
  ArrowRight,
  Atom,
  BookOpen,
  Code2,
  Cpu,
  Globe2,
  Languages,
  Sigma,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Modal } from './Modal'
import { getSubject, CLASS_9_SUBJECTS } from '@/lib/content'

type OrbitItem = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  pos: string
  subjectSlug: string
  bookSlug?: string
}

const ORBIT: OrbitItem[] = [
  { label: 'Science', icon: Atom, pos: 'left-1/2 top-[2%] -translate-x-1/2', subjectSlug: 'science', bookSlug: 'exploration' },
  { label: 'Mathematics', icon: Sigma, pos: 'left-[8%] top-[20%]', subjectSlug: 'maths', bookSlug: 'ganita-manjari' },
  { label: 'Social Science', icon: Globe2, pos: 'right-[8%] top-[20%]', subjectSlug: 'sst', bookSlug: 'understanding-society-india-and-beyond' },
  { label: 'English', icon: BookOpen, pos: 'left-[1%] top-[50%]', subjectSlug: 'english', bookSlug: 'kaveri' },
  { label: 'IT Part A', icon: Cpu, pos: 'right-[1%] top-[50%]', subjectSlug: 'it', bookSlug: 'employability-skills' },
  { label: 'IT Part B', icon: Code2, pos: 'right-[6%] top-[74%]', subjectSlug: 'it', bookSlug: 'information-technology' },
  { label: 'Hindi', icon: Languages, pos: 'left-[6%] top-[74%]', subjectSlug: 'hindi', bookSlug: 'ganga' },
]

function resolveHref(subjectSlug: string, bookSlug?: string): string {
  if (subjectSlug === 'it') return '/class-9/it'
  return `/class-9/${subjectSlug}/${bookSlug}`
}

export function HeroSection() {
  const [active, setActive] = useState<OrbitItem | null>(null)
  const [slide, setSlide] = useState(0)

  const activeSubject = active ? getSubject(active.subjectSlug, active.bookSlug) : undefined
  const chapters = activeSubject?.chapters ?? []

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[31.25rem] bg-[radial-gradient(60%_60%_at_70%_10%,color-mix(in_oklch,var(--gold)_18%,transparent),transparent_70%)]"
      />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-10 pb-14 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:px-8 lg:pt-12 lg:pb-14">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            <Sparkles className="size-3.5" />
            NCERT 2026 Revised Syllabus
          </div>

          <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Learn Smarter.
            <br />
            Think Deeper.
            <br />
            <span className="gold-text">Score Higher.</span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            100% NCERT based solutions, expertly crafted for CBSE Class 9. All subjects, all
            chapters. All in one place.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/answers"
              className="gold-btn group inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-transform hover:scale-[1.03] active:scale-95"
            >
              Explore Solutions
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-card px-6 py-3.5 text-sm font-semibold transition-colors hover:border-primary/60 hover:text-primary"
            >
              View Books
              <BookOpen className="size-4" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-[520px]">
            <div className="absolute inset-[9%] overflow-hidden rounded-full">
              <Image
                src="/ui3-images/hero-knowledge.png"
                alt="Two students gazing at a glowing book of knowledge inside a golden cosmic portal"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 620px"
                className="object-cover"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-[7%] rounded-full ring-1 ring-primary/20"
            />

            {ORBIT.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActive(item)}
                  className={`absolute ${item.pos} flex -translate-y-1/2 flex-col items-center gap-1.5 transition-transform hover:scale-110`}
                >
                  <span className="grid size-10 place-items-center rounded-xl border border-primary/30 bg-card/85 text-primary shadow-lg backdrop-blur-sm sm:size-12">
                    <Icon className="size-5" />
                  </span>
                  <span className="rounded-md bg-background/70 px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-foreground/85 backdrop-blur-sm sm:text-[11px]">
                    {item.label}
                  </span>
                </button>
              )
            })}

            <Link
              href="/answers"
              className="absolute bottom-[6%] left-1/2 -translate-x-1/2 rounded-full border border-primary/30 bg-card/85 px-3 py-1.5 text-[11px] font-semibold text-primary backdrop-blur-sm transition-colors hover:border-primary/70"
            >
              +{CLASS_9_SUBJECTS.length - ORBIT.length} More Subjects
            </Link>
          </div>

          <div className="absolute top-1/2 right-0 hidden -translate-y-1/2 flex-col gap-2.5 lg:flex">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to highlight ${i + 1}`}
                onClick={() => setSlide(i)}
                className={`size-2.5 rounded-full border transition-all ${
                  slide === i
                    ? 'scale-125 border-primary bg-primary'
                    : 'border-primary/40 bg-transparent hover:bg-primary/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        title={active?.label ?? ''}
        subtitle="Chapter-wise NCERT solutions, verified by teachers and updated for the 2026 syllabus."
      >
        <ul className="flex flex-col gap-2">
          {chapters.slice(0, 6).map((c) => (
            <li key={c.id}>
              <Link
                href={`/class-9/${active!.subjectSlug}/${active!.bookSlug}/${c.code}/${c.slug}`}
                onClick={() => setActive(null)}
                className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:border-primary/50 hover:text-primary"
              >
                Chapter {c.number} — {c.title}
                <ArrowRight className="size-4" />
              </Link>
            </li>
          ))}
          {chapters.length === 0 ? (
            <li>
              <Link
                href={active ? resolveHref(active.subjectSlug, active.bookSlug) : '/answers'}
                onClick={() => setActive(null)}
                className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:border-primary/50 hover:text-primary"
              >
                View all chapters
                <ArrowRight className="size-4" />
              </Link>
            </li>
          ) : null}
        </ul>
        <Link
          href="/answers"
          onClick={() => setActive(null)}
          className="mt-4 block text-center text-xs font-semibold text-primary hover:text-primary/80"
        >
          Browse all subjects →
        </Link>
      </Modal>
    </section>
  )
}
