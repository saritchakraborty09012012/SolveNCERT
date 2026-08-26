import { BookMarked, Clock, Layers, ShieldCheck, Users } from 'lucide-react'

const STATS = [
  { icon: BookMarked, value: '10+', label: 'Subjects Covered' },
  { icon: Layers, value: '80+', label: 'Chapters & Units' },
  { icon: Users, value: '1M+', label: 'Students Trust Us' },
  { icon: ShieldCheck, value: '100%', label: 'NCERT Based' },
  { icon: Clock, value: '24/7', label: 'AI Support' },
]

export function StatsStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card/50 p-6 sm:grid-cols-3 lg:grid-cols-5">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="size-5 shrink-0 text-primary" />
            <span className="leading-tight">
              <span className="block text-lg font-extrabold sm:text-xl">{value}</span>
              <span className="block text-[11px] text-muted-foreground">{label}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
