import type { ReactNode } from 'react'

type HUDPanelProps = {
  icon?: ReactNode
  title: string
  side?: 'left' | 'right'
  flat?: boolean
  className?: string
  titleClassName?: string
  children?: ReactNode
}

export function HUDPanel({
  icon,
  title,
  side = 'left',
  flat = false,
  className = '',
  titleClassName = '',
  children,
}: HUDPanelProps) {
  return (
    <div
      className={`hud-3d ${
        flat
          ? 'hud-3d--flat h-full w-full'
          : side === 'left'
            ? 'hud-3d--left'
            : 'hud-3d--right'
      }`}
    >
      {!flat && <span className="hud-3d__extrude" aria-hidden="true" />}

      <div className={`hud-3d__surface relative overflow-hidden px-3 py-2.5 ${flat ? 'h-full' : ''} ${className}`}>
        <span className="hud-scanline" aria-hidden="true" />
        <span className="hud-3d__corner hud-3d__corner--tl" aria-hidden="true" />
        <span className="hud-3d__corner hud-3d__corner--tr" aria-hidden="true" />
        <span className="hud-3d__corner hud-3d__corner--bl" aria-hidden="true" />
        <span className="hud-3d__corner hud-3d__corner--br" aria-hidden="true" />

        <div className="flex min-w-0 items-center gap-1.5">
          <span className="flex h-[1.35em] w-[1.35em] shrink-0 items-center justify-center text-cyan-300/90">
            {icon}
          </span>
          <h3
            className={`min-w-0 font-display fs-title font-bold uppercase leading-snug tracking-[0.12em] text-cyan-100/85 md:tracking-[0.28em] md:truncate ${titleClassName}`}
          >
            {title}
          </h3>
        </div>

        <div className="mt-1.5">{children}</div>
      </div>
    </div>
  )
}
