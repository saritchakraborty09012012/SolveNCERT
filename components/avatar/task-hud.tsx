import { useEffect, useState } from 'react'
import { ListChecks, Check } from 'lucide-react'
import { HUDPanel } from './hud-panel'
import { useAvatarSystem } from './avatar-state-controller'

const TASKS = ['PLANNING', 'SCHEDULING', 'AUTOMATING']

export function TaskHUD({ flat = false }: { flat?: boolean }) {
  const { response, status } = useAvatarSystem()
  const [doneCount, setDoneCount] = useState(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (response) {
      setDoneCount((d) => (d + 1) % (TASKS.length + 1))
      setActive((prev) => (prev + 1) % TASKS.length)
    }
  }, [response?.title])

  return (
    <HUDPanel flat={flat} title="Task Management" icon={<ListChecks className="h-[1.25em] w-[1.25em]" />} side="right">
      <div className="space-y-1">
        {TASKS.map((task, i) => {
          const isDone = doneCount > i
          const isActive = !isDone && (status === 'thinking' || status === 'generating') && active === i
          return (
            <div key={task} className="flex min-w-0 items-center gap-2 font-mono fs-micro tracking-[0.22em]">
              <span
                className={`flex h-[1.1em] w-[1.1em] shrink-0 items-center justify-center rounded-sm border ${
                  isDone
                    ? 'border-emerald-300/70 bg-emerald-400/25 text-emerald-100'
                    : isActive
                      ? 'border-cyan-300/70 bg-cyan-400/15 text-cyan-100'
                      : 'border-cyan-400/25 text-transparent'
                }`}
              >
                {isDone && <Check className="h-[0.65em] w-[0.65em]" strokeWidth={3.5} />}
                {isActive && <span className="h-[0.6em] w-[0.6em] animate-ping rounded-full bg-cyan-200" />}
              </span>
              <span className={`truncate ${isDone ? 'text-emerald-200/80' : isActive ? 'text-cyan-100' : 'text-cyan-300/50'}`}>
                {task}
              </span>
              {isDone && <span className="ml-auto fs-micro text-emerald-300/70">DONE</span>}
            </div>
          )
        })}
      </div>
    </HUDPanel>
  )
}
