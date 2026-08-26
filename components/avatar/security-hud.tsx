import { ShieldCheck } from 'lucide-react'
import { HUDPanel } from './hud-panel'
import { useAvatarSystem } from './avatar-state-controller'

const SECURITY_ROWS = ['SESSION SECURE', 'CONNECTION SECURE', 'INPUT PROTECTED'] as const

export function SecurityHUD({ flat = false }: { flat?: boolean }) {
  const { capabilities } = useAvatarSystem()

  return (
    <HUDPanel
      flat={flat}
      title="Security Protocol"
      icon={<ShieldCheck className="h-[1.25em] w-[1.25em]" />}
      side="right"
    >
      <div className="space-y-1">
        {SECURITY_ROWS.map((row, i) => {
          const degraded = i === 0 && !capabilities.apiKeyConfigured
          const ok = !degraded
          return (
            <div key={row} className="flex min-w-0 items-center gap-2 font-mono fs-micro tracking-[0.2em]">
              <span
                className={`h-[0.9em] w-[0.9em] shrink-0 rounded-full ${
                  ok
                    ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]'
                    : 'animate-pulse bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)]'
                }`}
              />
              <span className={`truncate ${ok ? 'text-emerald-200/80' : 'text-amber-200/80'}`}>{row}</span>
              <span className={`ml-auto shrink-0 ${ok ? 'text-emerald-300/60' : 'text-amber-300/70'}`}>
                {ok ? 'ACTIVE' : 'WARN'}
              </span>
            </div>
          )
        })}
      </div>
    </HUDPanel>
  )
}
