"use client"

import { type ReactNode } from "react"
import { motion } from "framer-motion"

/* ================================================================== */
/* SharedAvatar                                                        */
/*                                                                     */
/* Wraps user photo / Burst with layoutId="wrap-avatar".               */
/* Between slides, Framer Motion auto-animates position + scale morph. */
/* Uses only GPU-safe properties (transform, opacity, border-radius).  */
/* ================================================================== */

export function SharedAvatar({
  children,
  className,
  variant = "hero",
}: {
  children: ReactNode
  className?: string
  /** Controls size hint for layout animation */
  variant?: "hero" | "vinyl" | "ticket" | "finale"
}) {
  return (
    <motion.div
      layoutId="wrap-avatar"
      className={`gpu-layer backface-hidden ${className ?? ""}`}
      layout="position"
      transition={{
        layout: {
          type: "spring",
          stiffness: 200,
          damping: 28,
          mass: 0.9,
        },
      }}
      style={{ willChange: "transform" }}
      data-variant={variant}
    >
      {children}
    </motion.div>
  )
}

/* ================================================================== */
/* SharedMetric                                                        */
/*                                                                     */
/* Wraps the big count-up number with layoutId="wrap-metric".          */
/* Shared between DataHighlight (large center) and Dashboard (stat).   */
/* ================================================================== */

export function SharedMetric({
  children,
  className,
  variant = "large",
}: {
  children: ReactNode
  className?: string
  variant?: "large" | "compact"
}) {
  return (
    <motion.div
      layoutId="wrap-metric"
      className={`gpu-layer backface-hidden ${className ?? ""}`}
      layout="position"
      transition={{
        layout: {
          type: "spring",
          stiffness: 180,
          damping: 26,
          mass: 1,
        },
      }}
      data-variant={variant}
    >
      {children}
    </motion.div>
  )
}

/* ================================================================== */
/* SharedHeading                                                       */
/*                                                                     */
/* Wraps primary headings with layoutId="wrap-heading".                */
/* Shared between IntroUniverse and TopTrack for fluid text morphing.  */
/* ================================================================== */

export function SharedHeading({
  children,
  className,
  variant = "intro",
}: {
  children: ReactNode
  className?: string
  variant?: "intro" | "track"
}) {
  return (
    <motion.div
      layoutId="wrap-heading"
      className={`gpu-layer backface-hidden ${className ?? ""}`}
      layout="position"
      transition={{
        layout: {
          type: "spring",
          stiffness: 220,
          damping: 28,
          mass: 0.85,
        },
      }}
      data-variant={variant}
    >
      {children}
    </motion.div>
  )
}
