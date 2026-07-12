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
      className={`absolute ${className ?? ""}`}
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
      className={`absolute ${className ?? ""}`}
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
/* composed burst with portrait — elite animation matching reference   */
/* ------------------------------------------------------------------ */

export function Burst({
  photo,
  palette,
  className,
  delay = 0,
}: {
  photo?: string
  palette: BurstPalette
  className?: string
  delay?: number
}) {
  const springConfig = { type: "spring" as const, stiffness: 120, damping: 14 }
  
  return (
    <motion.div
      className={`relative aspect-square ${className ?? ""}`}
    >
      {/* Layer 1: Checkerboard Grid — squares spawn from center outward */}
      <div className="absolute inset-0">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {Array.from({ length: 100 }).map((_, i) => {
            const row = Math.floor(i / 10)
            const col = i % 10
            const isBlack = (row + col) % 2 === 0
            const distFromCenter = Math.sqrt(Math.pow(row - 4.5, 2) + Math.pow(col - 4.5, 2))
            const staggerDelay = distFromCenter * 0.06
            return (
              <motion.rect
                key={i}
                x={col * 10}
                y={row * 10}
                width="10"
                height="10"
                fill={isBlack ? palette.cloud : "transparent"}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: isBlack ? 1 : 0, scale: 1 }}
                transition={{
                  ...springConfig,
                  delay: delay + 0.1 + staggerDelay,
                }}
                style={{ transformOrigin: `${col * 10 + 5}px ${row * 10 + 5}px` }}
              />
            )
          })}
        </svg>
      </div>

      {/* Layer 2: Yellow Flower — 8-lobed cloud shape */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...springConfig, delay: delay + 0.6 }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle cx="50" cy="50" r="22" fill="#CCFF00" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const cx = 50 + Math.cos(angle) * 28
            const cy = 50 + Math.sin(angle) * 28
            return <circle key={i} cx={cx} cy={cy} r="16" fill="#CCFF00" />
          })}
        </svg>
      </motion.div>

      {/* Layer 3: Purple Starburst — spiky star inside the flower */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ ...springConfig, delay: delay + 0.8 }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, ease: "linear", duration: 30 }}
        >
          <SpikyLayer
            color={palette.star1}
            spikes={16}
            outer={44}
            inner={20}
            duration={0}
            className="inset-0 h-full w-full"
          />
        </motion.div>
      </motion.div>

      {/* Layer 4: Lime Green Spiky Ring — outer accent */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...springConfig, delay: delay + 0.9 }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: -360 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, ease: "linear", duration: 25 }}
        >
          <SpikyLayer
            color="#CCFF00"
            spikes={24}
            outer={48}
            inner={34}
            duration={0}
            className="inset-0 h-full w-full"
          />
        </motion.div>
      </motion.div>

      {/* Layer 5: Center Artwork — photo with circular mask */}
      <motion.div
        className="absolute inset-[22%] h-[56%] w-[56%] overflow-hidden rounded-full border-3"
        style={{ borderColor: palette.cloud }}
        initial={{ opacity: 0, scale: 0.3, y: -40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ...springConfig, delay: delay + 1.0 }}
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

/** Wrapped-style footer: Spotify logo + hashtag. */
export function WrapFooter({ ink, hashtag }: { ink: string; hashtag: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.8, type: "spring", stiffness: 260, damping: 24 }}
      className="flex items-center justify-center gap-2 md:justify-start md:gap-4"
      style={{ color: ink }}
    >
      {/* Spotify-style logo */}
      <span className="flex items-center gap-1.5 md:gap-2">
        <svg viewBox="0 0 24 24" className="size-5 md:size-7" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill={ink} />
          <path
            d="M7 9.5c2.5-1 5.5-.8 7.5.5"
            stroke="var(--wr-cream)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M6 12c3-1.2 6.5-.9 9 .5"
            stroke="var(--wr-cream)"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M5.5 14.5c3.5-1.2 7.5-.8 10.5.5"
            stroke="var(--wr-cream)"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <span className="font-display text-sm font-black lowercase tracking-tight md:text-lg">spotify</span>
      </span>
      <span className="font-display text-[10px] font-black uppercase tracking-widest opacity-80 md:text-sm">{hashtag}</span>
    </motion.div>
  )
}
