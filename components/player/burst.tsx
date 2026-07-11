"use client"

import { motion } from "framer-motion"

/* ------------------------------------------------------------------ */
/* geometry helpers                                                    */
/* ------------------------------------------------------------------ */

/** Sharp spiky-star polygon (like the pink / green Wrapped bursts). */
function starPoints(spikes: number, outer: number, inner: number, cx = 50, cy = 50) {
  const pts: string[] = []
  const step = Math.PI / spikes
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = i * step - Math.PI / 2
    pts.push(`${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`)
  }
  return pts.join(" ")
}

/** Diamond clip for the portrait that sits in the centre of the burst. */
export const DIAMOND_CLIP = "polygon(50% 3%, 97% 50%, 50% 97%, 3% 50%)"

/* ------------------------------------------------------------------ */
/* individual animated layers                                          */
/* ------------------------------------------------------------------ */

function SpikyLayer({
  color,
  spikes,
  outer,
  inner,
  duration,
  reverse,
  className,
}: {
  color: string
  spikes: number
  outer: number
  inner: number
  duration: number
  reverse?: boolean
  className?: string
}) {
  return (
    <motion.div
      className={`absolute gpu-layer backface-hidden ${className ?? ""}`}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ repeat: Number.POSITIVE_INFINITY, ease: "linear", duration }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <polygon points={starPoints(spikes, outer, inner)} fill={color} />
      </svg>
    </motion.div>
  )
}

/** Bumpy cloud / flower made from overlapping circles (the black base blob). */
function CloudLayer({
  color,
  bumps,
  duration,
  reverse,
  className,
}: {
  color: string
  bumps: number
  duration: number
  reverse?: boolean
  className?: string
}) {
  const ring = Array.from({ length: bumps }, (_, i) => {
    const a = (i / bumps) * Math.PI * 2
    return { cx: 50 + Math.cos(a) * 30, cy: 50 + Math.sin(a) * 30 }
  })
  return (
    <motion.div
      className={`absolute gpu-layer backface-hidden ${className ?? ""}`}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ repeat: Number.POSITIVE_INFINITY, ease: "linear", duration }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <circle cx="50" cy="50" r="30" fill={color} />
        {ring.map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} r="20" fill={color} />
        ))}
      </svg>
    </motion.div>
  )
}

export type BurstPalette = {
  cloud: string
  star1: string
  star2: string
}

/* ------------------------------------------------------------------ */
/* composed burst with portrait                                        */
/* ------------------------------------------------------------------ */

export function Burst({
  photo,
  palette,
  className,
  delay = 0,
  layoutId,
}: {
  photo?: string
  palette: BurstPalette
  className?: string
  delay?: number
  layoutId?: string
}) {
  const springConfig = { type: "spring" as const, stiffness: 120, damping: 14 }
  
  return (
    <motion.div
      layoutId={layoutId}
      className={`relative aspect-square gpu-layer ${className ?? ""}`}
    >
      {/* Layer 1: Background Checkerboard Grid */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...springConfig, delay: delay + 0 }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {Array.from({ length: 100 }).map((_, i) => {
            const row = Math.floor(i / 10)
            const col = i % 10
            const isBlack = (row + col) % 2 === 0
            return (
              <rect
                key={i}
                x={col * 10}
                y={row * 10}
                width="10"
                height="10"
                fill={isBlack ? palette.cloud : "transparent"}
                opacity={isBlack ? 1 : 0}
              />
            )
          })}
        </svg>
      </motion.div>

      {/* Layer 2: Base Flower (8-lobed) */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...springConfig, delay: delay + 0.1 }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {/* Center circle */}
          <circle cx="50" cy="50" r="25" fill={palette.cloud} />
          {/* 8 lobes */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const cx = 50 + Math.cos(angle) * 30
            const cy = 50 + Math.sin(angle) * 30
            return <circle key={i} cx={cx} cy={cy} r="18" fill={palette.cloud} />
          })}
        </svg>
      </motion.div>

      {/* Layer 3: Sharp Starburst */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...springConfig, delay: delay + 0.2 }}
      >
        <SpikyLayer
          color={palette.cloud}
          spikes={16}
          outer={42}
          inner={18}
          duration={0}
          className="inset-0 h-full w-full"
        />
      </motion.div>

      {/* Layer 4: Spiky Outer Ring (Lime Green) with rotation */}
      <motion.div
        className="absolute inset-0 gpu-layer backface-hidden"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...springConfig, delay: delay + 0.3 }}
      >
        <motion.div
          className="absolute inset-0 gpu-layer backface-hidden"
          animate={{ rotate: 360 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, ease: "linear", duration: 20 }}
        >
          <SpikyLayer
            color="#CCFF00"
            spikes={24}
            outer={48}
            inner={32}
            duration={0}
            className="inset-0 h-full w-full"
          />
        </motion.div>
      </motion.div>

      {/* Layer 5: Center Artwork (circular mask) */}
      <motion.div
        className="absolute inset-[25%] h-[50%] w-[50%] overflow-hidden rounded-full border-2"
        style={{ borderColor: palette.cloud }}
        initial={{ opacity: 0, scale: 0.5, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ...springConfig, delay: delay + 0.4 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo || "/wrapped-portrait-1.png"}
          alt=""
          className="h-full w-full object-cover"
          crossOrigin="anonymous"
        />
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* halftone dot texture overlay                                        */
/* ------------------------------------------------------------------ */

export function Halftone({ dark = true, className }: { dark?: boolean; className?: string }) {
  const dot = dark ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.16)"
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
      style={{
        backgroundImage: `radial-gradient(${dot} 1.3px, transparent 1.6px)`,
        backgroundSize: "8px 8px",
      }}
    />
  )
}

/** Wrapped-style footer: badge + wordmark + faded hashtag. */
export function WrapFooter({ ink, hashtag }: { ink: string; hashtag: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 24 }}
      className="flex items-center gap-3"
      style={{ color: ink }}
    >
      <span className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill={ink} />
          <path
            d="M12 5v14M5 12h14M7 7l10 10M17 7L7 17"
            stroke="var(--wr-cream)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-display text-lg font-black lowercase tracking-tight">wrapped</span>
      </span>
      <span className="font-display text-sm font-black uppercase tracking-widest opacity-70">{hashtag}</span>
    </motion.div>
  )
}
