"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export const ANIM_DURATION_MS = 2000

export function HypnoticRipple({ phase }: { phase: "closing" | "opening" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
    let cw = 0
    let ch = 0

    const resize = () => {
      const parent = canvas.parentElement
      cw = parent ? parent.clientWidth : window.innerWidth
      ch = parent ? parent.clientHeight : window.innerHeight
      canvas.width = cw * dpr
      canvas.height = ch * dpr
      ctx.scale(dpr, dpr)
    }

    window.addEventListener("resize", resize)
    resize()

    let startTime = performance.now()

    const render = (timestamp: number) => {
      const elapsed = timestamp - startTime
      // Constant outward flow speed (slowed down for smoothness)
      const flowProgress = (elapsed / 1000) * 0.9 

      ctx.clearRect(0, 0, cw, ch)

      const cx = cw / 2
      const cy = ch / 2 // Start from center or maybe top? Center is more standard for transitions.
      // Or maybe cy = ch * 0.2 to mimic the image a bit more if wanted. Let's do center.
      const maxRadius = Math.sqrt(cw * cw + ch * ch)
      
      const cols = 5
      const colWidth = cw / cols
      const ringSpacing = cw > 600 ? 80 : 50

      for (let c = 0; c < cols; c++) {
        ctx.save()
        ctx.beginPath()
        ctx.rect(c * colWidth, 0, colWidth, ch)
        ctx.clip()

        const isOdd = c % 2 !== 0
        const color1 = isOdd ? "#fdfbf7" : "#080808" // Cream / Ink
        const color2 = isOdd ? "#080808" : "#fdfbf7"

        // Draw rings from outside in so they overlap correctly
        const phaseOffset = (flowProgress * ringSpacing) % (ringSpacing * 2)
        const numRings = Math.ceil(maxRadius / ringSpacing) + 2

        for (let r = numRings; r >= 0; r--) {
          const radius = r * ringSpacing + phaseOffset
          if (radius <= 0) continue

          ctx.beginPath()
          ctx.arc(cx, cy, radius, 0, Math.PI * 2)
          // Alternate colors based on ring index
          ctx.fillStyle = r % 2 === 0 ? color1 : color2
          ctx.fill()
        }

        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const isClosing = phase === "closing"

  return (
    <div className="pointer-events-auto absolute inset-0 z-[25] overflow-hidden flex items-center justify-center">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{
          clipPath: isClosing ? "circle(0% at 50% 50%)" : "circle(150% at 50% 50%)",
        }}
        animate={{
          clipPath: isClosing ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)",
        }}
        transition={{
          duration: 1.8,
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
        />
      </motion.div>
    </div>
  )
}
