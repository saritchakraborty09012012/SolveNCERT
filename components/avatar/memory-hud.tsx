import { useEffect, useState } from 'react'
import { BrainCircuit } from 'lucide-react'
import { HUDPanel } from './hud-panel'
import { useAvatarSystem } from './avatar-state-controller'

export function MemoryHUD({ flat = false }: { flat?: boolean }) {
  const { memoryTags, status } = useAvatarSystem()
  const [pulse, setPulse] = useState(-1)

  useEffect(() => {
    if (status === 'thinking' && memoryTags.length > 0) {
      setPulse(memoryTags.length - 1)
      const t = setTimeout(() => setPulse(-1), 2600)
      return () => clearTimeout(t)
    }
  }, [status, memoryTags.length])

  const visible = flat ? memoryTags.slice(-3).reverse() : memoryTags.slice(0, 4)

  return (
    <HUDPanel
      flat={flat}
      title="Memory System"
      icon={<BrainCircuit className="h-[1.25em] w-[1.25em]" />}
      side="left"
    >
      {visible.length === 0 ? (
        <p className="font-mono fs-label tracking-[0.2em] text-cyan-300/40">
          {status === 'thinking' ? 'INDEXING…' : 'NO MEMORY YET'}
        </p>
      ) : (
        <div className="flex flex-wrap gap-1">
          {visible.map((m, i) => {
            const indexFromEnd = memoryTags.indexOf(m)
            return (
              <span
                key={`${m.tag}-${m.ts}`}
                className={`truncate rounded-sm border px-1 py-0.5 font-mono fs-micro tracking-[0.15em] transition-colors duration-300 ${
                  indexFromEnd === pulse
                    ? 'border-cyan-300/90 bg-cyan-400/25 text-cyan-50 text-glow'
                    : 'border-cyan-400/25 bg-cyan-400/5 text-cyan-200/70'
                }`}
              >
                {m.tag}
              </span>
            )
          })}
        </div>
      )}
      <div className="mt-1.5 flex items-center gap-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`h-[0.8em] w-[0.8em] rounded-full ${
                memoryTags.length > i ? 'bg-cyan-300' : 'bg-cyan-400/15'
              }`}
            />
          ))}
        </div>
        <span className="font-mono fs-micro tracking-[0.2em] text-cyan-300/45">
          {memoryTags.length} TOPICS
        </span>
      </div>
    </HUDPanel>
  )
}
