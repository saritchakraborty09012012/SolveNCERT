import { useState } from 'react'
import { Workflow, ChevronDown } from 'lucide-react'
import { HUDPanel } from './hud-panel'
import { useAvatarSystem } from './avatar-state-controller'

const STEPS = ['CONNECT', 'AUDIO', 'REASON', 'OUTPUT']

export function AutomationHUD({ flat = false }: { flat?: boolean }) {
  const { status } = useAvatarSystem()
  const [expanded, setExpanded] = useState(false)

  const active = {
    idle: -1,
    listening: 1,
    thinking: 2,
    generating: 2,
    speaking: 3,
  }[status]

  return (
    <HUDPanel flat={flat} title="Automation" icon={<Workflow className="h-[1.25em] w-[1.25em]" />} side="left">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono fs-label tracking-[0.2em] text-cyan-100/85">
          {expanded ? 'AUTOMATION PIPELINE' : status === 'idle' ? 'STANDBY' : 'ENGAGED'}
        </span>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="flex shrink-0 items-center gap-1 rounded border border-cyan-400/25 px-1.5 py-0.5 font-mono fs-micro tracking-[0.2em] text-cyan-200/80 transition-colors hover:border-cyan-300/50 hover:text-cyan-100"
        >
          {expanded ? 'COLLAPSE' : 'EXPAND'}
          <ChevronDown className={`h-[0.9em] w-[0.9em] transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {expanded && (
        <div className="mt-1.5 space-y-1">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2 font-mono fs-micro tracking-[0.2em]">
              <span
                className={`h-[0.9em] w-[0.9em] shrink-0 rounded-full ${
                  active === i
                    ? 'animate-pulse bg-cyan-300 shadow-[0_0_6px_rgba(34,211,238,0.9)]'
                    : active > i
                      ? 'bg-sky-400/80'
                      : 'bg-cyan-400/20'
                }`}
              />
              <span className={active === i ? 'text-cyan-100' : 'text-cyan-300/50'}>{step}</span>
              {active === i && <span className="ml-auto animate-pulse text-cyan-300/70">▸ RUNNING</span>}
              {active > i && <span className="ml-auto text-sky-300/70">COMPLETE</span>}
            </div>
          ))}
        </div>
      )}
    </HUDPanel>
  )
}
