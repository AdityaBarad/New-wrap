"use client"

import { motion } from "framer-motion"

export const ANIM_DURATION_MS = 1400

const COLORS = ["#18ddec", "#E9148C", "#efff38", "#101010"] // Green, Pink, Yellow, Ink

export function SweepTransition({ phase, direction = 1 }: { phase: "closing" | "opening"; direction?: number }) {
  const isClosing = phase === "closing"
  
  return (
    <div aria-hidden="true" className="pointer-events-auto absolute inset-0 z-[25] overflow-hidden">
      {COLORS.map((color, i) => {
        const delay = isClosing ? i * 0.12 : (COLORS.length - 1 - i) * 0.12
        const dirSign = direction > 0 ? 1 : -1
        
        return (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{ 
              backgroundColor: color, 
              zIndex: i 
            }}
            initial={{ 
              x: isClosing ? `${-100 * dirSign}%` : "0%" 
            }}
            animate={{ 
              x: isClosing ? "0%" : `${100 * dirSign}%` 
            }}
            transition={{
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1],
              delay
            }}
          />
        )
      })}
    </div>
  )
}
