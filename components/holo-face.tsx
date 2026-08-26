'use client'

import { useEffect, useRef } from 'react'
import type { Expression, SpeechState } from '@/lib/avatar-types'

type ExpressionParams = {
  mouthCurve: number // + = smile, - = frown
  mouthOpen: number // resting openness (fraction of head size)
  browY: number // vertical brow offset (- = raised)
  browTilt: number // + = inner-down (angry), - = inner-up (sad)
  browPull: number // 0..1, how much the inner brow tips draw toward the nose (furrow)
  eyeOpen: number // eyelid aperture multiplier
}

const EXPRESSIONS: Record<Expression, ExpressionParams> = {
  neutral: { mouthCurve: 0, mouthOpen: 0.002, browY: 0, browTilt: 0, browPull: 0, eyeOpen: 1 },
  happy: { mouthCurve: 0.6, mouthOpen: 0.006, browY: -0.008, browTilt: -0.004, browPull: 0, eyeOpen: 0.85 },
  sad: { mouthCurve: -0.45, mouthOpen: 0.002, browY: 0.004, browTilt: -0.02, browPull: 0, eyeOpen: 0.9 },
  angry: { mouthCurve: -0.3, mouthOpen: 0.004, browY: 0.008, browTilt: 0.024, browPull: 0.15, eyeOpen: 0.75 },
  surprised: { mouthCurve: 0.05, mouthOpen: 0.045, browY: -0.03, browTilt: 0, browPull: 0, eyeOpen: 1.35 },
  thinking: { mouthCurve: -0.06, mouthOpen: 0.002, browY: 0.006, browTilt: 0.015, browPull: 0.4, eyeOpen: 0.86 },
  focused: { mouthCurve: 0.02, mouthOpen: 0.002, browY: -0.007, browTilt: 0.006, browPull: 0.12, eyeOpen: 0.78 },
  concerned: { mouthCurve: -0.16, mouthOpen: 0.003, browY: 0.005, browTilt: -0.012, browPull: 0.12, eyeOpen: 0.92 },
  excited: { mouthCurve: 0.5, mouthOpen: 0.02, browY: -0.018, browTilt: 0, browPull: 0, eyeOpen: 1.1 },
  joy: { mouthCurve: 0.75, mouthOpen: 0.034, browY: -0.012, browTilt: -0.005, browPull: 0, eyeOpen: 0.8 },
  sympathy: { mouthCurve: 0.12, mouthOpen: 0.002, browY: 0.004, browTilt: -0.018, browPull: 0.12, eyeOpen: 0.95 },
}

// ---- feature anchors as fractions of the head image (1024x1024) ------------
const F = {
  eyeL: { x: 0.413, y: 0.392 },
  eyeR: { x: 0.592, y: 0.392 },
  eyeHalfW: 0.052, // half-width of one eye
  browDY: -0.036, // brow offset above eye center
  mouth: { x: 0.502, y: 0.594 },
  mouthHalfW: 0.062,
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// ---- viseme presets: mouth-shape variety while talking -----------------
// w = width multiplier (sideways stretch/pucker), o = openness multiplier,
// r = roundness (0 = wide/flat like "ee", 1 = round/pursed like "oo")
type Viseme = { w: number; o: number; r: number }
const VISEMES: Viseme[] = [
  { w: 1.0, o: 1.0, r: 0.15 }, // "ah" - wide open
  { w: 0.5, o: 0.8, r: 0.95 }, // "oh"/"oo" - round + pushed forward
  { w: 1.18, o: 0.3, r: 0.05 }, // "ee" - wide + flat
  { w: 0.68, o: 0.06, r: 0.35 }, // "m/b/p" - lips pressed together
  { w: 0.85, o: 0.26, r: 0.25 }, // "f/v" - slight parting
  { w: 0.95, o: 0.6, r: 0.4 }, // mid open
  { w: 0.42, o: 0.5, r: 1.0 }, // tight pucker
]

// deterministic pseudo-random 0..1 from an integer, used to pick a viseme
// per time-bucket without needing external randomness
function hash01(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

export function HoloFace({
  speechRef,
  expressionRef,
  gazeRef,
}: {
  speechRef: React.MutableRefObject<SpeechState>
  expressionRef: React.MutableRefObject<Expression>
  /** Normalized (-1..1) attention point the face should look toward. Defaults to forward. */
  gazeRef?: React.MutableRefObject<{ x: number; y: number }>
}) {
  const headRef = useRef<HTMLDivElement>(null)
  const featureRef = useRef<HTMLCanvasElement>(null)
  const rippleRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const head = headRef.current
    const feature = featureRef.current
    const ripple = rippleRef.current
    if (!head || !feature || !ripple) return
    const fctx = feature.getContext('2d')
    const rctx = ripple.getContext('2d')
    if (!fctx || !rctx) return

    let dpr = 1
    let W = 0
    let H = 0
    let S = 0 // head box size (square)
    let cx = 0
    let cy = 0 // head box center in viewport

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      // head width in image is ~38% of frame; size box so head reads like the reference
      S = Math.min(W * 0.5, H * 0.62) * 1.9
      cx = W / 2
      cy = H * 0.44

      head.style.width = `${S}px`
      head.style.height = `${S}px`
      head.style.left = `${cx - S / 2}px`
      head.style.top = `${cy - S / 2}px`

      feature.width = S * dpr
      feature.height = S * dpr
      feature.style.width = `${S}px`
      feature.style.height = `${S}px`
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      ripple.width = W * dpr
      ripple.height = H * dpr
      ripple.style.width = `${W}px`
      ripple.style.height = `${H}px`
      rctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // --- attention / gaze tracking ----------------------------------------
    // The face no longer chases the cursor. It reads a normalized attention
    // point (input box, panel, status area, or forward) supplied by the
    // AvatarStateController and eases toward it.
    const gaze = { x: 0, y: 0 }

    // --- morphing state ----------------------------------------------------
    const cur: ExpressionParams = { ...EXPRESSIONS.neutral }
    let mouthOpen = 0
    let mouthW = 1 // animated width multiplier (sideways lip movement)
    let mouthRound = 0.22 // animated roundness (flat "ee" <-> round "oo")
    let blink = 1
    let nextBlink = performance.now() + 2200 + Math.random() * 3000
    let blinkT = -1

    let raf = 0
    const render = (now: number) => {
      const t = now * 0.001

      const targetGaze = gazeRef?.current ?? { x: 0, y: 0 }
      gaze.x = lerp(gaze.x, Math.max(-1, Math.min(1, targetGaze.x)), 0.06)
      gaze.y = lerp(gaze.y, Math.max(-1, Math.min(1, targetGaze.y)), 0.06)

      // subtle idle micro-wander when gazing near-forward so the eyes never
      // feel locked on a single point
      const wandered = Math.abs(gaze.x) < 0.15 && Math.abs(gaze.y) < 0.15
      const gx = Math.max(-1, Math.min(1, gaze.x + (wandered ? Math.sin(t * 0.5) * 0.07 : 0)))
      const gy = Math.max(-1, Math.min(1, gaze.y + (wandered ? Math.cos(t * 0.4) * 0.06 : 0)))

      const target = EXPRESSIONS[expressionRef.current] ?? EXPRESSIONS.neutral
      cur.mouthCurve = lerp(cur.mouthCurve, target.mouthCurve, 0.12)
      cur.mouthOpen = lerp(cur.mouthOpen, target.mouthOpen, 0.12)
      cur.browY = lerp(cur.browY, target.browY, 0.12)
      cur.browTilt = lerp(cur.browTilt, target.browTilt, 0.12)
      cur.browPull = lerp(cur.browPull, target.browPull, 0.12)
      cur.eyeOpen = lerp(cur.eyeOpen, target.eyeOpen, 0.12)

      // lip sync: cycle through viseme shapes so the mouth contracts sideways,
      // rounds, and opens/closes like real speech instead of one flat gap
      const speech = speechRef.current
      let openTarget = cur.mouthOpen
      let widthTarget = 1
      let roundTarget = 0.22 + Math.max(0, cur.mouthOpen - 0.015) * 6
      if (speech.speaking) {
        const bucketMs = 115
        const bucket = Math.floor(now / bucketMs)
        const viseme = VISEMES[Math.floor(hash01(bucket) * VISEMES.length) % VISEMES.length]
        const loud = Math.max(speech.amp, 0.22)
        openTarget = cur.mouthOpen + viseme.o * 0.05 * loud
        widthTarget = lerp(1, viseme.w, Math.min(1, loud * 1.25))
        roundTarget = viseme.r
      }
      mouthOpen = lerp(mouthOpen, openTarget, 0.42)
      mouthW = lerp(mouthW, widthTarget, 0.32)
      mouthRound = lerp(mouthRound, roundTarget, 0.32)

      // blink
      if (blinkT < 0 && now > nextBlink) blinkT = 0
      if (blinkT >= 0) {
        blinkT += 0.12
        blink = Math.abs(Math.cos(blinkT * Math.PI))
        if (blinkT >= 1) {
          blink = 1
          blinkT = -1
          nextBlink = now + 2500 + Math.random() * 3500
        }
      }

      // ---------- 3D head turn (peeps toward the cursor) ----------
      const idleY = Math.sin(t * 0.9) * 3
      head.style.transform = [
        `perspective(1100px)`,
        `rotateY(${(gx * 10).toFixed(2)}deg)`,
        `rotateX(${(-gy * 8).toFixed(2)}deg)`,
        `translate3d(${(gx * S * 0.02).toFixed(1)}px, ${(gy * S * 0.016 + idleY).toFixed(1)}px, 0)`,
      ].join(' ')

      // ---------- feature overlay (head-local coordinates) ----------
      fctx.clearRect(0, 0, S, S)
      fctx.lineCap = 'round'
      fctx.lineJoin = 'round'

      const px = (f: number) => f * S

      // eyes: moving pupils, with a natural eyelid wipe instead of a flat fade.
      // squint (angry/sad/surprised) permanently scales eye size; blinking is a
      // separate top->bottom close / bottom->top open sweep on top of that.
      for (const eye of [F.eyeL, F.eyeR]) {
        const ex = px(eye.x)
        const ey = px(eye.y)
        const ew = px(F.eyeHalfW)
        const sizeMul = Math.max(0.6, Math.min(1.3, cur.eyeOpen))
        const halfH = ew * 0.82 * sizeMul

        // pupil glow following the cursor inside the socket (drawn full - the
        // eyelid sweep below covers whichever part should be closed)
        const ppx = ex + gx * ew * 0.55
        const ppy = ey + gy * ew * 0.4
        const g = fctx.createRadialGradient(ppx, ppy, 0, ppx, ppy, ew * 1.15 * sizeMul)
        g.addColorStop(0, 'rgba(220, 250, 255, 0.95)')
        g.addColorStop(0.35, 'rgba(120, 220, 255, 0.5)')
        g.addColorStop(1, 'rgba(40, 140, 240, 0)')
        fctx.fillStyle = g
        fctx.beginPath()
        fctx.arc(ppx, ppy, ew * 1.15 * sizeMul, 0, Math.PI * 2)
        fctx.fill()

        fctx.fillStyle = 'rgba(240, 253, 255, 1)'
        fctx.beginPath()
        fctx.ellipse(ppx, ppy, ew * 0.22, ew * 0.22, 0, 0, Math.PI * 2)
        fctx.fill()

        // closedAmt: 0 = fully open, 1 = fully closed. Blink drives the transient
        // sweep; a droopy expression (eyeOpen < 1, e.g. angry/sad) adds a resting
        // partial close so squints still read while idle - capped low and eased
        // so it stays a soft tint, never a solid block, at rest.
        const restingClosed = Math.max(0, Math.min(0.32, 1 - Math.min(1, cur.eyeOpen)))
        const closedAmt = Math.max(1 - blink, restingClosed)

        if (closedAmt > 0.02) {
          const eyeTop = ey - halfH
          const eyeBottom = ey + halfH
          const coverBottom = lerp(eyeTop, eyeBottom, closedAmt)

          // Instead of painting a dark lid over the eye, erase the drawn pupil /
          // glow in the closed region so the real head image shows through
          // during a blink (and stays a soft reveal for droopy expressions).
          fctx.save()
          fctx.globalCompositeOperation = 'destination-out'
          fctx.beginPath()
          fctx.rect(ex - ew * 1.6, eyeTop - 2, ew * 3.2, coverBottom - eyeTop + 2)
          fctx.clip()
          const cg = fctx.createLinearGradient(0, eyeTop - 2, 0, coverBottom)
          cg.addColorStop(0, 'rgba(0, 0, 0, 1)')
          cg.addColorStop(0.82, 'rgba(0, 0, 0, 1)')
          cg.addColorStop(1, 'rgba(0, 0, 0, 0)')
          fctx.fillStyle = cg
          fctx.fillRect(ex - ew * 1.6, eyeTop - 2, ew * 3.2, coverBottom - eyeTop + 2)
          fctx.restore()

          // faint eyelid edge glow so the sweep reads as a lid, not a wipe-cut
          fctx.strokeStyle = `rgba(140, 225, 255, ${0.4 * closedAmt})`
          fctx.lineWidth = Math.max(1, S * 0.003)
          fctx.beginPath()
          fctx.moveTo(ex - ew * 1.3, coverBottom)
          fctx.lineTo(ex + ew * 1.3, coverBottom)
          fctx.stroke()
        }
      }

      // brows: only visible when expression deviates from neutral
      const browIntensity = Math.min(
        1,
        (Math.abs(cur.browY) + Math.abs(cur.browTilt)) / 0.028,
      )
      if (browIntensity > 0.06) {
        fctx.strokeStyle = `rgba(150, 230, 255, ${0.85 * browIntensity})`
        fctx.lineWidth = Math.max(2, S * 0.006)
        fctx.shadowColor = 'rgba(80, 200, 255, 0.8)'
        fctx.shadowBlur = S * 0.012
        for (const side of [-1, 1] as const) {
          const eye = side === -1 ? F.eyeL : F.eyeR
          const byBase = px(eye.y + F.browDY + cur.browY)
          const innerX = px(eye.x) - side * px(F.eyeHalfW) * (0.9 - cur.browPull * 0.5)
          const outerX = px(eye.x) + side * px(F.eyeHalfW) * 1.15
          const innerY = byBase + px(cur.browTilt) + cur.browPull * S * 0.01
          const outerY = byBase - px(cur.browTilt) * 0.4
          const midX = px(eye.x)
          const midY = Math.min(innerY, outerY) - S * 0.008
          fctx.beginPath()
          fctx.moveTo(innerX, innerY)
          fctx.quadraticCurveTo(midX, midY, outerX, outerY)
          fctx.stroke()
        }
        fctx.shadowBlur = 0
      }

      // ---------- mouth (lip-sync + expression curve) ----------
      const mx = px(F.mouth.x)
      const my = px(F.mouth.y)
      const mwBase = px(F.mouthHalfW)
      const mw = mwBase * mouthW
      const curve = cur.mouthCurve
      const open = px(mouthOpen)

      // dim the baked-in lips when our mouth deviates from them (open, curved, or resized)
      const deviation = Math.min(
        1,
        Math.abs(curve) * 1.6 + mouthOpen / 0.02 + Math.abs(mouthW - 1) * 0.9,
      )
      if (deviation > 0.08) {
        const dg = fctx.createRadialGradient(mx, my, 0, mx, my, mwBase * 1.7)
        dg.addColorStop(0, `rgba(4, 12, 28, ${0.85 * deviation})`)
        dg.addColorStop(1, 'rgba(4, 12, 28, 0)')
        fctx.fillStyle = dg
        fctx.beginPath()
        fctx.ellipse(mx, my, mwBase * 1.7, mwBase * 1.1, 0, 0, Math.PI * 2)
        fctx.fill()
      }

      // taper exponent: flatter/wider visemes ("ee") hold open longer across the
      // width then pinch at the corners; round visemes ("oo") taper into a soft
      // oval throughout. Either way the opening always closes to a point at the
      // corners, like real lips - never a flat-sided rectangle.
      const taperN = lerp(2.6, 1.6, Math.max(0, Math.min(1, mouthRound)))

      const steps = 26
      const upper: { x: number; y: number }[] = []
      const lower: { x: number; y: number }[] = []
      for (let s = 0; s <= steps; s++) {
        const tt = s / steps
        const x = lerp(-mw, mw, tt)
        const nx = Math.abs(x) / mw
        const taper = Math.pow(Math.max(0, 1 - Math.pow(nx, taperN)), 1 / taperN)
        const cornerFactor = nx * nx
        const midY = my - curve * mw * 0.55 * cornerFactor
        const halfOpen = (open / 2) * taper
        upper.push({ x: mx + x, y: midY - halfOpen })
        lower.push({ x: mx + x, y: midY + halfOpen })
      }

      if (open > S * 0.006) {
        fctx.beginPath()
        fctx.moveTo(upper[0].x, upper[0].y)
        for (const p of upper) fctx.lineTo(p.x, p.y)
        for (let s = lower.length - 1; s >= 0; s--) fctx.lineTo(lower[s].x, lower[s].y)
        fctx.closePath()
        fctx.fillStyle = 'rgba(6, 18, 38, 0.9)'
        fctx.fill()

        // soft inner highlight for rounder shapes (oo/oh) so an open mouth
        // reads as a real cavity, not a flat-filled shape
        if (mouthRound > 0.45 && open > S * 0.012) {
          const ig = fctx.createRadialGradient(mx, my, 0, mx, my, mw * 0.7)
          ig.addColorStop(0, `rgba(30, 60, 100, ${0.35 * (mouthRound - 0.45)})`)
          ig.addColorStop(1, 'rgba(30, 60, 100, 0)')
          fctx.fillStyle = ig
          fctx.beginPath()
          fctx.ellipse(mx, my, mw * 0.7, open * 0.4, 0, 0, Math.PI * 2)
          fctx.fill()
        }
      }

      fctx.strokeStyle = 'rgba(160, 238, 255, 0.9)'
      fctx.lineWidth = Math.max(1.5, S * 0.004)
      fctx.shadowColor = 'rgba(80, 200, 255, 0.9)'
      fctx.shadowBlur = S * 0.01
      fctx.beginPath()
      fctx.moveTo(upper[0].x, upper[0].y)
      for (const p of upper) fctx.lineTo(p.x, p.y)
      fctx.stroke()
      fctx.beginPath()
      fctx.moveTo(lower[0].x, lower[0].y)
      for (const p of lower) fctx.lineTo(p.x, p.y)
      fctx.stroke()
      fctx.shadowBlur = 0

      // ---------- chest ripple rings (full-screen canvas) ----------
      rctx.clearRect(0, 0, W, H)
      const ripX = cx + gx * S * 0.02
      const ripY = cy + S * 0.36
      for (let k = 0; k < 4; k++) {
        const pr = (t * 0.35 + k / 4) % 1
        const rad = pr * S * 0.24
        rctx.beginPath()
        rctx.ellipse(ripX, ripY, rad, rad * 0.3, 0, 0, Math.PI * 2)
        rctx.strokeStyle = `rgba(90, 210, 255, ${0.4 * (1 - pr)})`
        rctx.lineWidth = 1.2
        rctx.stroke()
      }
      const coreGrad = rctx.createRadialGradient(ripX, ripY, 0, ripX, ripY, S * 0.05)
      coreGrad.addColorStop(0, 'rgba(190, 245, 255, 0.95)')
      coreGrad.addColorStop(1, 'rgba(60, 180, 255, 0)')
      rctx.fillStyle = coreGrad
      rctx.beginPath()
      rctx.arc(ripX, ripY, S * 0.05, 0, Math.PI * 2)
      rctx.fill()

      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [speechRef, expressionRef, gazeRef])

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* chest ripple rings behind the head */}
      <canvas ref={rippleRef} className="absolute inset-0 h-full w-full" />

      {/* the actual holographic head image + feature overlay, tilted in 3D */}
      <div ref={headRef} className="absolute will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/holo-head.png"
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full select-none"
          style={{ mixBlendMode: 'screen' }}
        />
        <canvas ref={featureRef} className="absolute inset-0" />
      </div>
    </div>
  )
}
