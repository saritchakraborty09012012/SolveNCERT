import { BadgeCheck, BrainCircuit, ClipboardCheck, RefreshCw, ShieldOff, Users } from 'lucide-react'

const ITEMS = [
  { icon: BadgeCheck, title: 'Human Verified', sub: '100% Accurate' },
  { icon: BrainCircuit, title: 'AI-Powered', sub: 'Smart Learning' },
  { icon: ClipboardCheck, title: 'Board Pattern', sub: 'Questions' },
  { icon: RefreshCw, title: 'Always Updated', sub: 'For 2026 Syllabus' },
  { icon: ShieldOff, title: 'Ads & Browse', sub: 'Ad-free Platform' },
  { icon: Users, title: 'Trusted by', sub: '1M+ Students' },
]

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-5 px-4 py-5 sm:grid-cols-3 lg:grid-cols-6 lg:px-8">
        {ITEMS.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-2.5">
            <Icon className="size-5 shrink-0 text-primary" />
            <span className="leading-tight">
              <span className="block text-[12px] font-semibold">{title}</span>
              <span className="block text-[11px] text-muted-foreground">{sub}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
