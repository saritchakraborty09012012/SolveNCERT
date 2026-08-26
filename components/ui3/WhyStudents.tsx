import { Bot, FileStack, ListChecks, Star, Users2, Workflow } from 'lucide-react'

const ITEMS = [
  { icon: ListChecks, title: 'Chapterwise Solutions', sub: 'Board pattern answers' },
  { icon: Workflow, title: 'Step-by-Step Explanation', sub: 'Easy to understand' },
  { icon: Star, title: 'Important Questions', sub: 'Exam focused' },
  { icon: FileStack, title: 'Practice Papers', sub: 'With solutions' },
  { icon: Bot, title: 'Smart AI Tools', sub: 'Learn 10x faster' },
  { icon: Users2, title: 'Study Room', sub: 'Study together free' },
]

export function WhyStudents() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 lg:px-8">
      <h2 className="gold-text text-base font-bold tracking-tight sm:text-lg">
        Why Students Love SolveNCERT?
      </h2>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
        {ITEMS.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-start gap-2.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-md border border-primary/25 bg-primary/10 text-primary">
              <Icon className="size-3.5" />
            </span>
            <span className="leading-tight">
              <span className="block text-[12px] font-semibold text-balance">{title}</span>
              <span className="block text-[11px] text-muted-foreground">{sub}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
