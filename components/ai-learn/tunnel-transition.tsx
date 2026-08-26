"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

type TunnelTransitionProps = {
  onComplete: () => void
  durationMs?: number
}

/**
 * Full-screen canvas "warp tunnel" — concentric rings rushing toward the
 * viewer, evoking passing through the AI Learn core.
 */
export function TunnelTransition({ onComplete, durationMs = 2600 }: TunnelTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    const dpr = window.devicePixelRatio || 1

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      ctx!.scale(dpr, dpr)
    }
    resize()

    const rings = Array.from({ length: 26 }, (_, i) => ({
      z: i * 40,
      rot: Math.random() * Math.PI * 2,
    }))

    let raf = 0
    const start = performance.now()

    function draw() {
      const now = performance.now()
      const elapsed = now - start
      const speedRamp = Math.min(1, elapsed / 500) * 14 + 4

      ctx!.fillStyle = "rgba(4, 8, 12, 1)"
      ctx!.fillRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2
      const maxDim = Math.max(width, height)

      for (const ring of rings) {
        ring.z -= speedRamp
        if (ring.z < 1) ring.z = 26 * 40
        const scale = 260 / ring.z
        const radius = scale * maxDim * 0.5
        const alpha = Math.min(0.55, scale * 0.5)

        ctx!.beginPath()
        ctx!.strokeStyle = `rgba(100, 220, 255, ${alpha})`
        ctx!.lineWidth = Math.max(1, 3 * scale)
        ctx!.save()
        ctx!.translate(cx, cy)
        ctx!.rotate(ring.rot)
        ctx!.scale(1, 0.55)
        ctx!.arc(0, 0, radius, 0, Math.PI * 2)
        ctx!.stroke()
        ctx!.restore()
      }

      // radial streak lines
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2
        const len = 40 + (Math.sin(elapsed / 90 + i) * 0.5 + 0.5) * 220
        const x1 = cx + Math.cos(angle) * 30
        const y1 = cy + Math.sin(angle) * 30
        const x2 = cx + Math.cos(angle) * len
        const y2 = cy + Math.sin(angle) * len
        ctx!.beginPath()
        ctx!.strokeStyle = `rgba(140, 230, 255, ${0.08 + Math.random() * 0.08})`
        ctx!.lineWidth = 1
        ctx!.moveTo(x1, y1)
        ctx!.lineTo(x2, y2)
        ctx!.stroke()
      }

      // vignette
      const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, maxDim * 0.6)
      grad.addColorStop(0, "rgba(4,8,12,0)")
      grad.addColorStop(1, "rgba(2,4,6,0.9)")
      ctx!.fillStyle = grad
      ctx!.fillRect(0, 0, width, height)

      raf = requestAnimationFrame(draw)
    }
    draw()

    const handleResize = () => resize()
    window.addEventListener("resize", handleResize)

    const timeout = setTimeout(onComplete, durationMs)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: [0.6, 1.15, 1] }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative font-sans text-2xl font-bold uppercase tracking-[0.4em] text-primary drop-shadow-[0_0_25px_rgba(110,220,255,0.9)] sm:text-4xl"
      >
        AI LEARN
      </motion.div>
    </div>
  )
}
