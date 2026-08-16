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
  spinningVinyl = false,
  style,
  gridSize = 10,
}: {
  photo?: string
  palette: BurstPalette
  className?: string
  delay?: number
  spinningVinyl?: boolean
  style?: React.CSSProperties
  gridSize?: number
}) {
  const springConfig = { type: "spring" as const, stiffness: 120, damping: 14 }
  const squareSize = 100 / gridSize
  const centerIndex = (gridSize - 1) / 2
  
  return (
    <motion.div
      className={`relative aspect-square ${className ?? ""}`}
      style={style}
    >
      {/* Layer 1: Checkerboard Grid — squares spawn from center outward */}
      <div className="absolute inset-0">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {Array.from({ length: gridSize * gridSize }).map((_, i) => {
            const row = Math.floor(i / gridSize)
            const col = i % gridSize
            const isBlack = (row + col) % 2 === 0
            const distFromCenter = Math.sqrt(Math.pow(row - centerIndex, 2) + Math.pow(col - centerIndex, 2))
            const staggerDelay = distFromCenter * 0.06
            return (
              <motion.rect
                key={i}
                x={col * squareSize}
                y={row * squareSize}
                width={squareSize}
                height={squareSize}
                fill={isBlack ? palette.cloud : "transparent"}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: isBlack ? 1 : 0, scale: 1 }}
                transition={{
                  ...springConfig,
                  delay: delay + 0.1 + staggerDelay,
                }}
                style={{ transformOrigin: `${col * squareSize + squareSize / 2}px ${row * squareSize + squareSize / 2}px` }}
              />
            )
          })}
        </svg>
      </div>

      {/* Layer 2: Green Flower — 8-lobed cloud shape */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...springConfig, delay: delay + 0.6 }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, ease: "linear", duration: 15 }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <circle cx="50" cy="50" r="22" fill="var(--wr-green)" />
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2
              const cx = 50 + Math.cos(angle) * 28
              const cy = 50 + Math.sin(angle) * 28
              return <circle key={i} cx={cx} cy={cy} r="16" fill="var(--wr-green)" />
            })}
          </svg>
        </motion.div>
      </motion.div>

      {/* Layer 3: Lime Green Spiky Ring — outer accent (moved back) */}
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
            outer={44}
            inner={32}
            duration={0}
            className="inset-0 h-full w-full"
          />
        </motion.div>
      </motion.div>

      {/* Layer 4: Blue/Purple Starburst — 4-pointed star (moved forward) */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ ...springConfig, delay: delay + 0.8 }}
      >
        <SpikyLayer
          color={palette.star1}
          spikes={4}
          outer={48}
          inner={25}
          duration={0}
          className="inset-0 h-full w-full overflow-visible"
        />
      </motion.div>

      {/* Layer 5: Center Artwork — photo with square mask */}
      <motion.div
        className="absolute inset-[22%] h-[56%] w-[56%] overflow-hidden"
        initial={{ opacity: 0, scale: 0.3, y: -40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ...springConfig, delay: delay + 1.0 }}
      >
        {spinningVinyl ? (
          <motion.div
            className="relative h-full w-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo || "/wrapped-portrait-1.png"}
              alt=""
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
            <span
              className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
              style={{ backgroundColor: "var(--wr-ink)", borderColor: palette.cloud }}
            />
          </motion.div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photo || "/wrapped-portrait-1.png"}
            alt=""
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        )}
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

/** Wrapped-style footer: Wrapsy logo + hashtag. */
export function WrapFooter({ ink, hashtag, align = "center" }: { ink: string; hashtag: string; align?: "center" | "left" | "right" }) {
  const alignClass = align === "left" ? "items-start" : align === "right" ? "items-end" : "items-center justify-center"
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.8, type: "spring", stiffness: 260, damping: 24 }}
      className={`flex flex-col gap-1 ${alignClass}`}
      style={{ color: ink }}
    >
      {/* Wrapsy-style logo */}
      <span className="flex items-center gap-1.5 md:gap-2">
        <img
          src="/logo/logo-solid.jpeg"
          alt="Logo"
          className="size-5 md:size-7 object-contain rounded-[6px]"
          style={{ borderRadius: '6px' }}
        />
        <span className="font-display text-sm font-black lowercase tracking-tight md:text-lg">wrapsy</span>
      </span>
      <span className="font-display text-[10px] font-black uppercase tracking-widest opacity-80 md:text-sm mt-0.5">{hashtag}</span>
    </motion.div>
  )
}
