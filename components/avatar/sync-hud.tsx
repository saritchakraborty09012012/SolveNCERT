import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { HUDPanel } from './hud-panel'
import { useAvatarSystem } from './avatar-state-controller'

export function SyncHUD({ flat = false }: { flat?: boolean }) {
  const { status, messageCount } = useAvatarSystem()
  const syncing = status === 'thinking' || status === 'generating'
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!syncing) return
    const t = setInterval(() => setTick((k) => k + 1), 900)
    return () => clearInterval(t)
  }, [syncing])

  return (
    <HUDPanel
      flat={flat}
      title="Data Synchronization"
      icon={<RefreshCw className={`h-[1.25em] w-[1.25em] ${syncing ? 'animate-spin' : ''}`} />}
      side="right"
    >
      <div className="flex items-center gap-1">
        <span className="sync-node" />
        <span className={`sync-link ${syncing ? '' : '[animation-play-state:paused]'}`} />
        <span className="sync-node" />
        <span className={`sync-link ${syncing ? '' : '[animation-play-state:paused]'}`} />
        <span className="sync-node" />
      </div>
      <div className="mt-1.5 flex items-center justify-between font-mono fs-micro tracking-[0.2em]">
        <span className={syncing ? 'animate-pulse text-cyan-200 text-glow' : 'text-cyan-300/50'}>
          {syncing ? `SYNCING ${String(tick).padStart(2, '0')}%` : 'SYNCED'}
        </span>
        <span className="text-cyan-300/45">BLOB {messageCount}</span>
      </div>
    </HUDPanel>
  )
}
