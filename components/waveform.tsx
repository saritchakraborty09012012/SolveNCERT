'use client'

import { useEffect, useRef } from 'react'
import type { SpeechState } from '@/lib/avatar-types'

export function Waveform({ speechRef }: { speechRef: React.MutableRefObject<SpeechState> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let dpr = 1
    let W = 0
    let H = 0
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      W = rect.width
      H = rect.height
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const bars = 64
    const heights = new Array(bars).fill(0)
    let raf = 0

    const render = (now: number) => {
      ctx.clearRect(0, 0, W, H)
      const speech = speechRef.current
      const mid = H / 2
      const barW = W / bars

      for (let i = 0; i < bars; i++) {
        // symmetric envelope: tallest in the centre
        const dist = Math.abs(i - (bars - 1) / 2) / (bars / 2)
        const envelope = 1 - dist * 0.85
        let target = 0.04
        if (speech.speaking) {
          const wobble =
            Math.sin(now * 0.006 + i * 0.5) * 0.5 +
            Math.sin(now * 0.013 + i * 0.9) * 0.5
          target = (0.15 + speech.amp * 0.85) * envelope * (0.5 + 0.5 * Math.abs(wobble))
        }
        heights[i] += (target - heights[i]) * 0.35
        const h = Math.max(1.5, heights[i] * H)

        const x = i * barW + barW * 0.2
        const w = barW * 0.6
        const alpha = 0.35 + heights[i] * 0.65
        ctx.fillStyle = `rgba(120, 225, 255, ${alpha})`
        ctx.fillRect(x, mid - h / 2, w, h)
      }
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [speechRef])

  return <canvas ref={canvasRef} aria-hidden="true" className="h-14 w-full" />
}
