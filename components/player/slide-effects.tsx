"use client"

import { motion } from "framer-motion"
import { Halftone } from "@/components/player/burst"
import type { BgPattern, DecorationStyle } from "@/lib/ai-types"

/* ================================================================== */
/* CINEMATIC BACKGROUND LAYER                                         */
/* Renders a slowly zooming, heavily blurred photo as a backdrop      */
/* ================================================================== */
export function CinematicBg({ photo, ink }: { photo?: string; ink?: string }) {
  if (!photo) return null
  return (
    <motion.div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.8 }}
      transition={{ duration: 1.5 }}
    >
      <motion.img 
        src={photo} 
        className="absolute inset-0 w-full h-full object-cover blur-[60px] opacity-60 mix-blend-luminosity"
        animate={{ scale: [1.1, 1.25, 1.1], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      {ink && <div className="absolute inset-0 opacity-30 mix-blend-color" style={{ backgroundColor: ink }} />}
      <div className="absolute inset-0 bg-black/10" />
    </motion.div>
  )
}

/* ================================================================== */
/* BACKGROUND PATTERN LAYER                                           */
/* Renders a full-bleed background pattern based on the AI token.     */
/* ================================================================== */

export function BgPatternLayer({
  pattern,
  ink,
  dark,
}: {
  pattern: BgPattern
  ink: string
  dark?: boolean
}) {
  switch (pattern) {
    case "halftone":
      return <Halftone dark={dark} />

    case "grid":
      return (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${ink}22 1px, transparent 1px), linear-gradient(90deg, ${ink}22 1px, transparent 1px)`,
            backgroundSize: "44px 44px",
          }}
          animate={{ backgroundPosition: ["0px 0px", "44px 44px"] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      )

    case "dots":
      return (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, ${ink}25 2.5px, transparent 2.5px)`,
            backgroundSize: "28px 28px",
          }}
          animate={{ backgroundPosition: ["0px 0px", "14px 14px"] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      )

    case "gradient":
      return (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 25% 15%, ${ink}18 0%, transparent 55%), radial-gradient(ellipse at 75% 85%, ${ink}14 0%, transparent 50%)`,
          }}
        />
      )

    case "noise":
      return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <svg className="absolute" width="0" height="0">
            <filter id="wrap-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </svg>
          <div
            className="h-full w-full opacity-[0.06]"
            style={{ filter: "url(#wrap-noise)" }}
          />
        </div>
      )

    case "clean":
    default:
      return null
  }
}

/* ================================================================== */
/* DECORATION LAYER                                                   */
/* Renders floating decorative elements based on the AI token.        */
/* ================================================================== */

const SPRING = { type: "spring", stiffness: 120, damping: 14 } as const

/** Floating geometric cube */
function FloatingCube({
  size, x, y, color, ink, delay,
}: {
  size: number; x: string; y: string; color: string; ink: string; delay: number
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 0.9, scale: 1, y: [0, -12, 0], rotate: [0, 8, 0] }}
      transition={{
        opacity: { ...SPRING, delay },
        scale: { ...SPRING, delay },
        y: { duration: 4.5 + delay, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        rotate: { duration: 6 + delay, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      }}
    >
      <div style={{ width: size, height: size, background: color, boxShadow: `${size * 0.14}px ${size * 0.14}px 0 ${ink}` }} />
    </motion.div>
  )
}

/** Floating circle/orb */
function FloatingCircle({
  size, x, y, color, delay,
}: {
  size: number; x: string; y: string; color: string; delay: number
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 0.65, scale: 1, y: [0, -18, 0] }}
      transition={{
        opacity: { ...SPRING, delay },
        scale: { ...SPRING, delay },
        y: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay },
      }}
    >
      <div
        className="rounded-full"
        style={{ width: size, height: size, backgroundColor: color, filter: "blur(0.5px)" }}
      />
    </motion.div>
  )
}

/** Spinning star */
function FloatingStar({
  size, x, y, color, delay,
}: {
  size: number; x: string; y: string; color: string; delay: number
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{ opacity: 0.75, scale: 1, rotate: 360 }}
      transition={{
        opacity: { ...SPRING, delay },
        scale: { ...SPRING, delay },
        rotate: { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay },
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8 5.6 21.2 8 14 2 9.2h7.6z" />
      </svg>
    </motion.div>
  )
}

/** Animated diagonal lines */
function DiagonalLines({ color }: { color: string }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.12 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="absolute -inset-10 h-[120%] w-[120%]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, ${color} 20px, ${color} 22px)`,
        }}
      />
    </motion.div>
  )
}

/* ── positions for decorative elements ── */
const DECO_POSITIONS = [
  { x: "10%", y: "15%", size: 48, delay: 0.2 },
  { x: "82%", y: "20%", size: 32, delay: 0.5 },
  { x: "78%", y: "68%", size: 44, delay: 0.3 },
  { x: "14%", y: "72%", size: 26, delay: 0.7 },
]

export function DecorationLayer({
  style,
  colors,
  ink,
}: {
  style: DecorationStyle
  colors: [string, string]
  ink: string
}) {
  switch (style) {
    case "cubes":
      return (
        <>
          {DECO_POSITIONS.map((p, i) => (
            <FloatingCube key={i} size={p.size} x={p.x} y={p.y} color={colors[i % 2]} ink={ink} delay={p.delay} />
          ))}
        </>
      )

    case "circles":
      return (
        <>
          {DECO_POSITIONS.map((p, i) => (
            <FloatingCircle key={i} size={p.size} x={p.x} y={p.y} color={colors[i % 2]} delay={p.delay} />
          ))}
        </>
      )

    case "stars":
      return (
        <>
          {DECO_POSITIONS.map((p, i) => (
            <FloatingStar key={i} size={p.size} x={p.x} y={p.y} color={colors[i % 2]} delay={p.delay} />
          ))}
        </>
      )

    case "lines":
      return <DiagonalLines color={colors[0]} />

    case "none":
    default:
      return null
  }
}
