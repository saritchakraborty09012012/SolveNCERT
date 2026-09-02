import React from 'react'

/** Derives a friendly banner label from the destination URL. */
export function deriveLabel(url: string): string {
  const path = url.split('?')[0]
  const segs = path.split('/').filter(Boolean)
  const ch = segs.find((s) => /ch\d+$/.test(s))
  if (ch) {
    const n = ch.match(/ch(\d+)$/)?.[1]
    return `CHAPTER ${(n || '').padStart(2, '0')}`
  }
  const last = segs[segs.length - 1]
  if (last) {
    return last
      .split('-')
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(' ')
      .toUpperCase()
  }
  return 'SOLVENCERT'
}

interface Props {
  state: 'hidden' | 'loading' | 'finish'
  label: string
}

export default function TunnelLoader({ state, label }: Props) {
  if (state === 'hidden') return null
  const finishing = state === 'finish'

  return (
    <div className={`tunnel-loader${finishing ? ' finishing' : ''}`} role="status" aria-label="Loading next page" aria-live="polite">
      <div className="solar-stars" aria-hidden="true" />
      <div className="solar-streaks" aria-hidden="true" />
      {!finishing && <div className="solar-planets" aria-hidden="true">
        <span className="solar-sun" />
        <span className="solar-planet solar-planet--earth" />
        <span className="solar-planet solar-planet--jupiter" />
        <span className="solar-planet solar-planet--saturn" />
      </div>}
      <div className="solar-arrival" aria-hidden="true">
        <span className="solar-arrival__halo" />
        <span className="solar-arrival__word">SOLVENCERT</span>
      </div>
      {!finishing && <div className="solar-dots" aria-label="Loading"><span /><span /><span /></div>}
      <span className="sr-only">Loading {label}</span>
    </div>
  )
}
