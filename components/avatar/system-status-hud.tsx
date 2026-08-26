import { Activity } from 'lucide-react'
import { HUDPanel } from './hud-panel'
import { useAvatarSystem } from './avatar-state-controller'

const STATES = ['LISTENING', 'THINKING', 'GENERATING', 'SPEAKING', 'IDLE'] as const

export function SystemStatusHUD({ flat = false }: { flat?: boolean }) {
  const { status } = useAvatarSystem()

  return (
    <HUDPanel
      flat={flat}
      title="System Status"
      icon={<Activity className="h-[1.25em] w-[1.25em]" />}
      side="right"
    >
      <div className="space-y-1">
        {STATES.map((s) => {
          const active = status.toUpperCase() === s
          return (
            <div key={s} className="flex items-center gap-1.5 font-mono fs-micro tracking-[0.22em]">
              <span
                className={`relative flex h-[0.9em] w-[0.9em] shrink-0 ${
                  active ? 'opacity-100' : 'opacity-30'
                }`}
              >
                {active && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-60" />
                )}
                <span
                  className={`relative inline-flex h-[0.9em] w-[0.9em] rounded-full ${
                    active ? 'bg-cyan-200 shadow-[0_0_6px_rgba(34,211,238,0.9)]' : 'bg-cyan-400/60'
                  }`}
                />
              </span>
              <span className={`truncate flex-1 ${active ? 'text-cyan-100 text-glow' : 'text-cyan-300/50'}`}>
                {s}
              </span>
              <div className="hidden h-[0.5em] w-[4.5em] shrink-0 overflow-hidden rounded-full bg-cyan-400/10 sm:block">
                {active && (
                  <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-cyan-300/40 to-sky-400/90" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </HUDPanel>
  )
}
