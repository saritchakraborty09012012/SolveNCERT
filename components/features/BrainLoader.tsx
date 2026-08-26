import React from 'react'

const WORDS = ['MATHEMATICS', 'CONCEPTS', 'QUESTIONS', 'EXAMPLES', 'SOLUTIONS']
const WORD_LEFT = ['50%', '36%', '63%', '43%', '57%']
const RING_COUNT = 12

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
    <div className={`tunnel-loader${finishing ? ' finishing' : ''}`} role="status" aria-live="polite">
      {/* central light */}
      <div className="tunnel-core" aria-hidden="true" />

      {/* zooming tunnel rings */}
      <div className="tunnel-rings" aria-hidden="true">
        {Array.from({ length: RING_COUNT }, (_, i) => (
          <span key={i} className="tunnel-ring" style={{ animationDelay: `${i * 0.22}s` }} />
        ))}
      </div>

      {/* floating words flying past the camera */}
      {!finishing && (
        <div className="tunnel-words" aria-hidden="true">
          {WORDS.map((w, i) => (
            <span key={w} className="tunnel-word" style={{ left: WORD_LEFT[i], animationDelay: `${i * 0.42}s` }}>
              {w}
            </span>
          ))}
        </div>
      )}

      {/* welcome banner + boom on arrival */}
      <div className="tunnel-welcome">
        <p className="tunnel-welcome-kicker">WELCOME TO</p>
        <p className="tunnel-welcome-title">{label}</p>
      </div>

      <div className="tunnel-boom" aria-hidden="true" />
    </div>
  )
}