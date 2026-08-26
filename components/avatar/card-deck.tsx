import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'

type CardDeckProps = {
  items: ReactNode[]
  frontIndex: number
  onFrontChange: (next: number) => void
  dir?: 1 | -1
  autoAdvanceMs?: number
  className?: string
  cardClassName?: string
}

const FLY_MS = 480

export function CardDeck({
  items,
  frontIndex,
  onFrontChange,
  dir = 1,
  autoAdvanceMs = 0,
  className = '',
  cardClassName = '',
}: CardDeckProps) {
  const n = items.length
  const [order, setOrder] = useState<number[]>(() => items.map((_, i) => i))
  const [flyingIndex, setFlyingIndex] = useState<number | null>(null)
  const [frozenIndex, setFrozenIndex] = useState<number | null>(null)
  const downRef = useRef<{ x: number; active: boolean }>({ x: 0, active: false })
  const prevFrontRef = useRef(frontIndex)

  useEffect(() => {
    const prev = prevFrontRef.current
    prevFrontRef.current = frontIndex
    if (prev === frontIndex || n < 2) return

    setFlyingIndex(prev)
    setFrozenIndex(null)
    const fly = setTimeout(() => {
      setOrder((old) => {
        const rest = old.filter((i) => i !== prev && i !== frontIndex)
        return [frontIndex, ...rest, prev]
      })
      setFlyingIndex(null)
      setFrozenIndex(prev)
    }, FLY_MS)
    const thaw = setTimeout(() => setFrozenIndex(null), FLY_MS + 90)
    return () => {
      clearTimeout(fly)
      clearTimeout(thaw)
    }
  }, [frontIndex, n])

  useEffect(() => {
    if (!autoAdvanceMs || n < 2) return
    const id = setInterval(() => onFrontChange((frontIndex + 1) % n), autoAdvanceMs)
    return () => clearInterval(id)
  }, [autoAdvanceMs, frontIndex, n, onFrontChange])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    downRef.current = { x: e.clientX, active: true }
  }
  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    if (!downRef.current.active) return
    const dx = e.clientX - downRef.current.x
    downRef.current = { x: 0, active: false }
    if (Math.abs(dx) > 36 && n > 1) {
      onFrontChange(((dx > 0 ? frontIndex - 1 : frontIndex + 1) + n) % n)
    }
  }

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ touchAction: 'pan-y' }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      {items.map((card, i) => {
        const p = order.indexOf(i)

        let tx = 0
        let ty = 0
        let rot = 0
        let sc = 1
        let z = n + 1 - p
        let opacity = 1

        if (p > 0) {
          tx = p * 4 * dir
          ty = -(p * 7)
          rot = p * 2.4 * (dir === 1 ? -1 : 1)
          sc = Math.max(0.92, 1 - p * 0.018)
          opacity = Math.max(0.8, 1 - p * 0.05)
        }

        if (flyingIndex === i) {
          tx = dir * 210
          ty = -18
          rot = 6 * dir
          sc = 0.9
          z = n + 5
          opacity = 0.15
        }

        const transition =
          frozenIndex === i
            ? 'none'
            : flyingIndex === null
              ? 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 350ms ease'
              : 'transform 440ms cubic-bezier(0.4, 0, 0.6, 1), opacity 350ms ease'

        return (
          <div
            key={i}
            className={`absolute inset-0 ${cardClassName}`}
            style={{
              zIndex: z,
              opacity,
              transform: `perspective(1000px) translateX(${tx}px) translateY(${ty}px) scale(${sc}) rotate(${rot}deg)`,
              transition,
              pointerEvents: p === 0 && flyingIndex === null ? 'auto' : 'none',
            }}
          >
            {card}
          </div>
        )
      })}
    </div>
  )
}
