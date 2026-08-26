import { GraduationCap, Cpu } from 'lucide-react'
import { HUDPanel } from './hud-panel'
import { useAvatarSystem } from './avatar-state-controller'

export function LearningHUD({ flat = false }: { flat?: boolean }) {
  const { currentTopic, conceptsProcessed, activity, status } = useAvatarSystem()
  const progress = Math.min(100, Math.max(4, (conceptsProcessed % 100) || 4))
  const processing = status === 'thinking' || status === 'generating'

  return (
    <HUDPanel
      flat={flat}
      title="AI Learning"
      icon={<GraduationCap className="h-[1.25em] w-[1.25em]" />}
      side="left"
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <Cpu className={`h-[1.1em] w-[1.1em] shrink-0 ${processing ? 'animate-spin text-cyan-200' : 'text-cyan-300/50'}`} />
        <span
          className="truncate font-mono fs-label uppercase tracking-[0.15em] text-cyan-100/90"
          title={currentTopic ?? undefined}
        >
          {currentTopic ?? 'AWAITING TOPIC'}
        </span>
      </div>

      <div className="mt-1.5">
        <div className="h-[0.55em] w-full overflow-hidden rounded-full bg-cyan-400/10">
          <div
            className={`h-full rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-700 ${
              processing ? 'animate-pulse' : ''
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between font-mono fs-micro tracking-[0.18em] text-cyan-300/50">
          <span>{activity}</span>
          <span>{conceptsProcessed} CONCEPTS</span>
        </div>
      </div>
    </HUDPanel>
  )
}
