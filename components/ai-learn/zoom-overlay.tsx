"use client"

import { motion } from "framer-motion"

export function ZoomOverlay({ x, y }: { x: number; y: number }) {
  const maxDim = typeof window !== "undefined" ? Math.hypot(window.innerWidth, window.innerHeight) : 2400

  return (
    <motion.div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden bg-transparent">
      <motion.div
        className="absolute rounded-full bg-primary"
        style={{ left: x, top: y, translateX: "-50%", translateY: "-50%" }}
        initial={{ width: 30, height: 30, opacity: 0.85 }}
        animate={{ width: maxDim * 2.4, height: maxDim * 2.4, opacity: 1 }}
        transition={{ duration: 0.75, ease: "easeIn" }}
      />
    </motion.div>
  )
}