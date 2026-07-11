"use client"

import { motion } from "framer-motion"
import type { SlideDesignProfile } from "@/lib/design-tokens"

/* ------------------------------------------------------------------ */
/* BackgroundWarp — GPU-accelerated deepest visual layer               */
/*                                                                     */
/* Three composable sub-layers:                                        */
/*   1. Conic gradient rotation (transform: rotate only)               */
/*   2. Radial glow pulse (transform: scale + opacity)                 */
/*   3. Noise grain (static — zero animation cost)                     */
/*                                                                     */
/* All animations use composite-safe properties only.                  */
/* ------------------------------------------------------------------ */

export function BackgroundWarp({
  profile,
  className,
}: {
  profile: SlideDesignProfile
  className?: string
}) {
  const { bg, accent, glow } = profile

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden gpu-layer ${className ?? ""}`}
    >
      {/* Sub-layer 1: Conic gradient rotation */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[200%] w-[200%] gpu-layer backface-hidden"
        style={{
          x: "-50%",
          y: "-50%",
          background: `conic-gradient(from 0deg, ${bg}, ${accent}44, ${bg})`,
          opacity: 0.35,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Sub-layer 2: Radial glow pulse */}
      <motion.div
        className="absolute left-1/2 top-1/2 gpu-layer"
        style={{
          x: "-50%",
          y: "-50%",
          width: "80vw",
          height: "80vw",
          maxWidth: 600,
          maxHeight: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Sub-layer 3: Noise grain (static SVG texture — no animation cost) */}
      <div className="noise-grain absolute inset-0" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Standalone sub-components for à la carte usage                      */
/* ------------------------------------------------------------------ */

/** A counter-rotating segmented overlay for extra depth. */
export function SegmentedOverlay({
  color,
  segments = 24,
  duration = 34,
}: {
  color?: string
  segments?: number
  duration?: number
}) {
  const deg = 360 / segments / 2
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[160%] w-[160%] gpu-layer backface-hidden mix-blend-overlay"
      style={{
        x: "-50%",
        y: "-50%",
        background: `repeating-conic-gradient(from 0deg, transparent 0deg ${deg}deg, ${color ?? "rgba(0,0,0,0.22)"} ${deg}deg ${deg * 2}deg)`,
      }}
      animate={{ rotate: -360 }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
  )
}

/** Radial glow — usable standalone outside BackgroundWarp. */
export function RadialGlow({
  color,
  size = "60vw",
}: {
  color: string
  size?: string
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 gpu-layer"
      style={{
        x: "-50%",
        y: "-50%",
        width: size,
        height: size,
        maxWidth: 500,
        maxHeight: 500,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  )
}
