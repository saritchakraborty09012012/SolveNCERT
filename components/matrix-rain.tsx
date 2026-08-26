import { useEffect, useRef } from 'react'

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const glyphs = 'アイウエオカキクケコサシスセソ01<>/\\{}[]#$%01ヲン0123456789ABCDEF'
    const fontSize = 16
    let columns = 0
    let drops: number[] = []
    let dpr = 1

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      columns = Math.ceil(window.innerWidth / fontSize)
      drops = Array.from({ length: columns }, () => Math.random() * -50)
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    const render = () => {
      ctx.fillStyle = 'rgba(5, 10, 24, 0.12)'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      ctx.font = `${fontSize}px "Rajdhani", monospace`
      for (let i = 0; i < columns; i++) {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        if (Math.random() > 0.975) {
          ctx.fillStyle = 'rgba(186, 245, 255, 0.9)'
        } else {
          ctx.fillStyle = 'rgba(45, 160, 210, 0.35)'
        }
        ctx.fillText(char, x, y)

        if (y > window.innerHeight && Math.random() > 0.975) {
          drops[i] = Math.random() * -20
        }
        drops[i] += 0.5
      }
      raf = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
    />
  )
}
