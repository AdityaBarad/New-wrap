"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useInView } from "framer-motion"
import { RotateCcw, Share2 } from "lucide-react"
import { Burst, Halftone, WrapFooter, type BurstPalette } from "@/components/player/burst"
import { SpiralRibbon } from "@/components/player/spiral-ribbon"
import { ArtistStatsCard } from "@/components/player/artist-stats"
import { WorldCitizen } from "@/components/player/world-citizen"
import { useWrap, type WrapData } from "@/context/wrap-context"
import { PURPOSES } from "@/context/wrap-context"
import { buildStats, fmt, type WrapStats } from "@/lib/wrap-stats"
import type { AiWrapContent } from "@/lib/ai-types"


export type WrapPage = { key: string; bg: string; node: ReactNode }

/* fluid spring physics used across every slide */
const SPRING = { type: "spring", stiffness: 120, damping: 14 } as const
const HASHTAG = "#YOURLIFEWRAPPED"

/* palette presets keyed by the card background (for the Burst monogram) */
const PALETTES: Record<string, BurstPalette> = {
  "var(--wr-green)": { cloud: "var(--wr-ink)", star1: "var(--wr-yellow)", star2: "var(--wr-pink)" },
  "var(--wr-yellow)": { cloud: "var(--wr-ink)", star1: "var(--wr-pink)", star2: "var(--wr-green)" },
  "var(--wr-pink)": { cloud: "var(--wr-ink)", star1: "var(--wr-yellow)", star2: "var(--wr-green)" },
  "var(--wr-orange)": { cloud: "var(--wr-ink)", star1: "var(--wr-purple)", star2: "var(--wr-yellow)" },
  "var(--wr-purple)": { cloud: "var(--wr-ink)", star1: "var(--wr-green)", star2: "var(--wr-yellow)" },
  "var(--wr-ink)": { cloud: "var(--wr-green)", star1: "var(--wr-pink)", star2: "var(--wr-yellow)" },
}

function daysSince(dateStr: string) {
  if (!dateStr) return 0
  const then = new Date(dateStr).getTime()
  if (Number.isNaN(then)) return 0
  return Math.max(0, Math.floor((Date.now() - then) / 86400000))
}

/** Live-counting number that ticks up from 0 whenever the slide mounts. */
function useCountUp(target: number, duration = 1500) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
}

/* ---------- shared primitives ---------- */

export function Shell({ children }: { children: ReactNode }) {
  return <div className="relative h-full w-full overflow-hidden">{children}</div>
}

/** Heading revealed line-by-line through clipping masks (translateY out of a clip). */
function ClipHeading({
  lines,
  ink,
  className,
  delay = 0.15,
}: {
  lines: string[]
  ink: string
  className?: string
  delay?: number
}) {
  return (
    <h2
      className={
        className ??
        "font-display text-[2.7rem] font-black leading-[0.92] tracking-tight text-balance md:text-6xl xl:text-7xl"
      }
      style={{ color: ink }}
    >
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="block"
            initial={{ y: "110%", rotate: 4 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{ ...SPRING, delay: delay + i * 0.11 }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </h2>
  )
}

function Kicker({ children, ink, delay = 0.1 }: { children: ReactNode; ink: string; delay?: number }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 0.7, y: 0 }}
      transition={{ ...SPRING, delay }}
      className="font-display text-xs font-black uppercase tracking-[0.32em] md:text-sm"
      style={{ color: ink }}
    >
      {children}
    </motion.p>
  )
}

/* ================================================================== */
/* SLIDE 1 — THE UNIVERSE (cover / intro)                             */
/* ================================================================== */

function IntroUniverse({
  bg,
  ink,
  kicker,
  lines,
  sub,
  photo,
  songTitle,
  songArtist,
  songStat,
}: {
  bg: string
  ink: string
  kicker: string
  lines: string[]
  sub: string
  photo?: string
  songTitle?: string
  songArtist?: string
  songStat?: string
}) {
  const palette = PALETTES[bg] ?? PALETTES["var(--wr-green)"]
  return (
    <Shell>
      <Halftone dark={bg !== "var(--wr-ink)"} />

      {/* Mobile: vertical stack — text top, Burst center-bottom, footer bottom */}
      <div className="flex h-full w-full flex-col items-center md:hidden">
        {/* Text at top — centered */}
        <motion.div
          className="flex w-full flex-col items-center gap-1.5 px-6 pt-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 2.0 }}
        >
          <h2
            className="font-display text-[1.75rem] font-black leading-[1.0] tracking-tight"
            style={{ color: ink }}
          >
            {lines.map((l, i) => (
              <span key={i} className="block overflow-hidden pb-[0.01em]">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ ...SPRING, delay: 2.1 + i * 0.1 }}
                >
                  {l}
                </motion.span>
              </span>
            ))}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 2.6 }}
            className="mt-2 font-display text-sm font-bold"
            style={{ color: ink }}
          >
            {songTitle} <span className="font-semibold not-uppercase">by</span> {songArtist}
          </motion.p>
          {songStat && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 2.8 }}
              className="font-sans text-xs font-semibold"
              style={{ color: ink, opacity: 0.85 }}
            >
              {songStat}
            </motion.p>
          )}
        </motion.div>

        {/* Burst — large, centered */}
        <div className="relative flex flex-1 items-center justify-center">
          <motion.div
            initial={{ y: "-12vh", scale: 0.4, opacity: 0 }}
            animate={{ y: "0%", scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 55, damping: 16, delay: 0.3 }}
          >
            <Burst photo={photo} palette={palette} delay={0.2} className="w-[72vw] max-w-[22rem]" />
          </motion.div>
        </div>

        {/* Footer at bottom — centered */}
        <div className="w-full pb-6 pt-2 text-center">
          <WrapFooter ink={ink} hashtag={HASHTAG} />
        </div>
      </div>

      {/* Desktop: side-by-side — Burst slides right, text on left */}
      <div className="hidden h-full w-full md:block">
        {/* Burst slides right */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          initial={{ x: "0%" }}
          animate={{ x: "30%" }}
          transition={{ type: "spring", stiffness: 60, damping: 18, delay: 1.6 }}
        >
          <Burst photo={photo} palette={palette} delay={0.2} className="w-[28vw] max-w-[24rem]" />
        </motion.div>

        {/* Left text */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col justify-center px-14 pl-[6%]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 2.0 }}
        >
          <div className="flex max-w-lg flex-col gap-5">
            <Kicker ink={ink} delay={2.2}>{kicker}</Kicker>
            <h2
              className="font-display text-6xl font-black leading-[0.92] tracking-tight text-balance xl:text-7xl"
              style={{ color: ink }}
            >
              {lines.map((l, i) => (
                <span key={i} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ ...SPRING, delay: 2.3 + i * 0.12 }}
                  >
                    {l}
                  </motion.span>
                </span>
              ))}
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 2.9 }}
              className="max-w-md font-sans text-base font-semibold leading-relaxed lg:text-lg"
              style={{ color: ink }}
            >
              {sub}
            </motion.p>
            {(songTitle || songArtist) && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 3.2 }}
                className="mt-2"
              >
                <p className="font-display text-lg font-black uppercase" style={{ color: ink }}>
                  {songTitle} <span className="font-semibold not-uppercase">by</span> {songArtist}
                </p>
                {songStat && (
                  <p className="font-sans text-sm font-semibold" style={{ color: ink, opacity: 0.8 }}>
                    {songStat}
                  </p>
                )}
              </motion.div>
            )}
            <div className="mt-2">
              <WrapFooter ink={ink} hashtag={HASHTAG} />
            </div>
          </div>
        </motion.div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* SLIDE 2 — SHARE YOUR WRAPPED (animated campaign card)               */
/* ================================================================== */

const SHARE_BLOCKS = [
  { left: "5%", top: "0%", delay: 0 },
  { left: "10%", top: "17%", delay: 0.15 },
  { left: "1%", top: "34%", delay: 0.28 },
  { left: "9%", top: "52%", delay: 0.08 },
  { left: "4%", top: "72%", delay: 0.22 },
  { right: "6%", top: "0%", delay: 0.12 },
  { right: "1%", top: "18%", delay: 0.3 },
  { right: "8%", top: "36%", delay: 0.04 },
  { right: "2%", top: "55%", delay: 0.18 },
  { right: "7%", top: "74%", delay: 0.34 },
]

const SHARE_ORBS = [
  { left: "-3%", top: "-9%", delay: 0 },
  { right: "-3%", top: "-9%", delay: 0.3 },
  { left: "-4%", top: "40%", delay: 0.55 },
  { right: "-4%", top: "40%", delay: 0.15 },
  { left: "-3%", bottom: "-11%", delay: 0.4 },
  { right: "-3%", bottom: "-11%", delay: 0.7 },
]

function ShareSpotifyLogo() {
  return (
    <div className="flex items-center gap-[1.2cqw] text-[#101010]">
      <svg viewBox="0 0 64 64" aria-hidden="true" className="size-[clamp(2.5rem,6cqw,4rem)]">
        <circle cx="32" cy="32" r="30" fill="currentColor" />
        <path d="M17 25c10-3 22-2 31 2.5" fill="none" stroke="#ff861b" strokeLinecap="round" strokeWidth="5" />
        <path d="M20 33c8-2 17-1.3 25 2" fill="none" stroke="#ff861b" strokeLinecap="round" strokeWidth="4.2" />
        <path d="M22 41c6-1.5 13-.8 19 1.7" fill="none" stroke="#ff861b" strokeLinecap="round" strokeWidth="3.6" />
      </svg>
      <span className="font-display text-[clamp(1.7rem,4.2cqw,3rem)] font-black tracking-tight">Spotify</span>
    </div>
  )
}

function ShareWrappedSlide() {
  return (
    <Shell>
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#101010] [container-type:size]">
        {SHARE_BLOCKS.map((block, index) => (
          <motion.div
            key={index}
            aria-hidden="true"
            className="absolute aspect-square w-[clamp(3rem,9cqw,7rem)] bg-[#7200c9]"
            style={block}
            initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
            animate={{ opacity: 1, scale: [1, 1.08, 1], rotate: [0, 5, -4, 0], y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.3, delay: block.delay },
              scale: { duration: 4.5, repeat: Number.POSITIVE_INFINITY, delay: block.delay },
              rotate: { duration: 6, repeat: Number.POSITIVE_INFINITY, delay: block.delay },
              y: { duration: 3.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: block.delay },
            }}
          />
        ))}

        {SHARE_ORBS.map((orb, index) => (
          <motion.div
            key={index}
            aria-hidden="true"
            className="absolute z-[2] aspect-square w-[clamp(4.5rem,12cqw,8rem)] rounded-full bg-[#efff38]"
            style={orb}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: [1, 1.08, 0.96, 1], x: [0, index % 2 === 0 ? 8 : -8, 0] }}
            transition={{
              opacity: { duration: 0.3, delay: 0.15 + orb.delay },
              scale: { duration: 4.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: orb.delay },
              x: { duration: 5.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: orb.delay },
            }}
          />
        ))}

        <motion.div
          aria-hidden="true"
          className="absolute inset-[1.5%_4%] z-[3] bg-[#ff861b] [clip-path:polygon(7%_0,25%_7%,22%_0,78%_0,75%_8%,93%_0,88%_14%,100%_10%,91%_27%,100%_32%,91%_43%,100%_50%,91%_57%,100%_69%,90%_73%,96%_91%,77%_94%,75%_100%,24%_100%,22%_94%,4%_100%,10%_82%,0_76%,9%_63%,0_57%,10%_50%,0_42%,10%_35%,0_23%,11%_18%)]"
          initial={{ scale: 0.25, rotate: -8 }}
          animate={{ scale: [1, 1.018, 1], rotate: [0, 0.6, -0.5, 0] }}
          transition={{
            scale: {
              duration: 4.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              delay: 0.12,
            },
            rotate: { duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.9 },
          }}
        />

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-[12%] text-center text-[#080808]">
          <motion.h2
            initial={{ opacity: 0, y: "8cqh", scale: 0.72 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 125, damping: 16, delay: 0.42 }}
            className="font-display text-[clamp(2rem,6.3cqw,5.5rem)] font-black leading-[0.98] tracking-tight text-balance"
          >
            Share your
            <span className="block">Spotify Wrapped</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.8em" }}
            animate={{ opacity: 1, letterSpacing: "0.16em" }}
            transition={{ duration: 0.65, delay: 0.72, ease: "easeOut" }}
            className="mt-[2.2cqh] font-display text-[clamp(0.52rem,1.15cqw,0.8rem)] font-black uppercase"
          >
            #SpotifyWrapped
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: "5cqh", scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.92 }}
            className="absolute bottom-[15%]"
          >
            <ShareSpotifyLogo />
          </motion.div>
        </div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* SLIDE 3 — DATA HIGHLIGHT (Wrapped 2024 pixel frame + count up)     */
/* ================================================================== */

const PIXEL_ROWS = [
  "clamp(9rem, 46vw, 42rem)",
  "clamp(7rem, 35vw, 31rem)",
  "clamp(5.5rem, 25vw, 22rem)",
  "clamp(4rem, 16vw, 14rem)",
  "clamp(2.75rem, 9vw, 8rem)",
]

const OUTER_PIXEL_ROWS = [
  "clamp(6rem, 30vw, 30rem)",
  "clamp(4.5rem, 22vw, 22rem)",
  "clamp(3.25rem, 15vw, 15rem)",
  "clamp(2rem, 8vw, 8rem)",
  "clamp(1rem, 4vw, 4rem)",
]
const PIXEL_ROW_HEIGHT = "clamp(2.1375rem, 3.8vw, 3.42rem)"

function PixelStair({
  corner,
  delay = 0,
  accent,
  shutterPhase,
  outward = false,
}: {
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  delay?: number
  accent: string
  shutterPhase?: "closing" | "opening"
  outward?: boolean
}) {
  const isTop = corner.startsWith("top")
  const isRight = corner.endsWith("right")
  const enterX = isRight ? 70 : -70
  const enterY = isTop ? -28 : 28
  const isShutter = Boolean(shutterPhase)
  const isClosing = shutterPhase === "closing"
  const frameRows = outward ? OUTER_PIXEL_ROWS : PIXEL_ROWS
  const rows = isTop ? frameRows : [...frameRows].reverse()
  const columnDirection = isRight ? "flex-row-reverse" : "flex-row"
  const outerColumn = isRight
    ? "linear-gradient(90deg, #174ee8 0%, #0789f5 58%, #20e7ed 100%)"
    : "linear-gradient(90deg, #20e7ed 0%, #0789f5 42%, #174ee8 100%)"
  const innerColumn = isRight
    ? "linear-gradient(90deg, #174ee8 0%, #5424ed 52%, #10093f 100%)"
    : "linear-gradient(90deg, #10093f 0%, #5424ed 48%, #174ee8 100%)"

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${isTop ? "top-0" : "bottom-0"} ${
        isRight ? "right-0 items-end" : "left-0 items-start"
      } z-0 flex flex-col ${isShutter ? "w-full overflow-visible" : "w-[58vw] max-w-[46rem] overflow-hidden"}`} 
    >
      {rows.map((width, i) => (
        <motion.div
          key={`${corner}-${i}`}
          initial={isShutter ? { opacity: 1, x: 0, y: 0, width, height: PIXEL_ROW_HEIGHT } : { opacity: 0, x: enterX, y: enterY }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
            width: isClosing ? `${isTop ? 42 + i * 4.8 : 61.2 - i * 4.8}vw` : width,
            height: PIXEL_ROW_HEIGHT,
          }}
          transition={
            isShutter
              ? {
                  width: {
                    duration: isClosing ? 1.2 : 1.3,
                    delay: isClosing ? i * 0.035 : (rows.length - 1 - i) * 0.025,
                    ease: [0.76, 0, 0.24, 1],
                  },

                }
              : {
                  opacity: { ...SPRING, delay: delay + i * 0.08 },
                  x: { ...SPRING, delay: delay + i * 0.08 },
                  y: { ...SPRING, delay: delay + i * 0.08 },
                }
          }
          className={`flex ${columnDirection}`}
          style={{
            width,
            height: PIXEL_ROW_HEIGHT,
          }}
        >
          <motion.div
            className="h-full w-[60%] shrink-0"
            animate={{ filter: ["saturate(1)", "saturate(1.18)", "saturate(1)"] }}
            transition={{
              duration: 5.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: delay + i * 0.08,
            }}
            style={{
              backgroundImage: outerColumn,
            }}
          />
          <motion.div
            className="h-full flex-1"
            animate={{ filter: ["saturate(1.08)", "saturate(1)", "saturate(1.08)"] }}
            transition={{
              duration: 6.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: delay + i * 0.08,
            }}
            style={{
              backgroundImage: innerColumn,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

function CenterClosingStrips({ phase }: { phase: "closing" | "opening" }) {
  const isClosing = phase === "closing"
  const responsiveGroups = [
    { count: 14, className: "flex sm:hidden" },
    { count: 10, className: "hidden sm:flex lg:hidden" },
    { count: 6, className: "hidden lg:flex xl:hidden" },
    { count: 4, className: "hidden xl:flex" },
  ]

  return (
    <>
      {responsiveGroups.map(({ count, className }) => {
        const rows = Array.from({ length: count })
        const maxDistance = (count - 1) / 2
        const widthSpan = Math.max(1, maxDistance - 0.5)

        return (
          <div
            key={count}
            className={`absolute inset-x-0 top-1/2 -translate-y-1/2 flex-col overflow-hidden ${className}`}
            style={{ height: `calc(${count} * ${PIXEL_ROW_HEIGHT})` }}
          >
            {rows.map((_, i) => {
              const distanceFromCenter = Math.abs(i - maxDistance)
              const centerProgress = (maxDistance - distanceFromCenter) / widthSpan
              const width = 61.2 + centerProgress * 8.8
              const delay = Math.min(i, count - 1 - i) * 0.035

              return (
                <motion.div key={i} className="relative shrink-0" style={{ height: PIXEL_ROW_HEIGHT }}>
                  <motion.div
                    className="absolute inset-y-0 left-0 flex"
                    initial={{ x: "-100%" }}
                    animate={{ x: isClosing ? "0%" : "-100%" }}
                    transition={{ duration: isClosing ? 1.2 : 1.3, delay, ease: [0.76, 0, 0.24, 1] }}
                    style={{ width: `${width}vw` }}
                  >
                    <div
                      className="h-full w-[60%] shrink-0"
                      style={{ backgroundImage: "linear-gradient(90deg, #20e7ed 0%, #0789f5 42%, #174ee8 100%)" }}
                    />
                    <div
                      className="h-full flex-1"
                      style={{ backgroundImage: "linear-gradient(90deg, #10093f 0%, #5424ed 48%, #174ee8 100%)" }}
                    />
                  </motion.div>
                  <motion.div
                    className="absolute inset-y-0 right-0 flex flex-row-reverse"
                    initial={{ x: "100%" }}
                    animate={{ x: isClosing ? "0%" : "100%" }}
                    transition={{ duration: isClosing ? 1.2 : 1.3, delay, ease: [0.76, 0, 0.24, 1] }}
                    style={{ width: `${width}vw` }}
                  >
                    <div
                      className="h-full w-[60%] shrink-0"
                      style={{ backgroundImage: "linear-gradient(90deg, #174ee8 0%, #0789f5 58%, #20e7ed 100%)" }}
                    />
                    <div
                      className="h-full flex-1"
                      style={{ backgroundImage: "linear-gradient(90deg, #174ee8 0%, #5424ed 52%, #10093f 100%)" }}
                    />
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}

export function PixelTransitionShutter({ phase }: { phase: "closing" | "opening" }) {
  const isClosing = phase === "closing"

  return (
    <div aria-hidden="true" className="pointer-events-auto absolute inset-0 z-[25] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 1 : 0 }}
        transition={{ duration: isClosing ? 0.45 : 0.75, delay: isClosing ? 0.72 : 0.12 }}
        style={{
          backgroundImage:
            "linear-gradient(90deg, #20e7ed 0%, #0789f5 23%, #174ee8 34%, #5424ed 44%, #10093f 49%, #10093f 51%, #5424ed 56%, #174ee8 66%, #0789f5 77%, #20e7ed 100%)",
        }}
      />
      <CenterClosingStrips phase={phase} />
      <PixelStair corner="top-left" accent="#18ddec" shutterPhase={phase} outward={phase === "opening"} />
      <PixelStair corner="top-right" accent="#18ddec" shutterPhase={phase} outward={phase === "opening"} />
      <PixelStair corner="bottom-left" accent="#18ddec" shutterPhase={phase} outward={phase === "opening"} />
      <PixelStair corner="bottom-right" accent="#18ddec" shutterPhase={phase} outward={phase === "opening"} />
    </div>
  )
}

function PixelFrame({ accent, bg, outward = false }: { accent: string; bg: string; outward?: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={{ backgroundColor: bg }}>
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.16) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          maskImage: "radial-gradient(circle at center, transparent 0 34%, black 66%)",
        }}
        animate={{ backgroundPosition: ["0px 0px", "20px 20px"] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <PixelStair corner="top-left" accent={accent} delay={0.04} outward={outward} />
      <PixelStair corner="top-right" accent={accent} delay={0.1} outward={outward} />
      <PixelStair corner="bottom-left" accent={accent} delay={0.16} outward={outward} />
      <PixelStair corner="bottom-right" accent={accent} delay={0.22} outward={outward} />
    </div>
  )
}

function DataHighlight({
  bg,
  ink,
  accent,
  kicker,
  value,
  label,
  note,
}: {
  bg: string
  ink: string
  accent: string
  kicker: string
  value: number
  label: string
  note: string
}) {
  const count = useCountUp(value, 1500)
  return (
    <Shell>
      <PixelFrame accent={accent} bg={bg} />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-5 py-14 text-center md:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.72, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 16, delay: 0.18 }}
          className="relative flex w-full max-w-[42rem] flex-col items-center justify-center px-7 py-9 md:px-10"
        >
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 0.92, y: 0 }}
            transition={{ ...SPRING, delay: 0.52 }}
            className="relative z-10 font-display text-[clamp(1rem,4.7vw,1.72rem)] font-black leading-none tracking-normal md:text-[1.9rem]"
            style={{ color: ink }}
          >
            {kicker}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 28, scale: 0.82 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...SPRING, delay: 0.68 }}
            className="relative z-10 my-1 font-display text-[clamp(4.2rem,21vw,8rem)] font-black leading-[0.78] tracking-normal tabular-nums md:text-[9rem]"
            style={{ color: ink }}
          >
            {fmt(count)}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...SPRING, delay: 0.9 }}
            className="relative z-10 font-display text-[clamp(1.15rem,5vw,2rem)] font-black uppercase leading-[0.95] tracking-normal md:text-[2.35rem]"
            style={{ color: ink }}
          >
            {label}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 0.82, y: 0 }}
            transition={{ ...SPRING, delay: 1.12 }}
            className="relative z-10 mt-4 max-w-[20rem] font-sans text-[clamp(0.78rem,3.1vw,1rem)] font-bold leading-snug md:text-base"
            style={{ color: ink }}
          >
            {note}
          </motion.p>
        </motion.div>

        <div className="absolute bottom-7 left-6 md:left-14">
          <WrapFooter ink={ink} hashtag={HASHTAG} />
        </div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* SLIDE 3 — TOP SONG REVEAL (pixel frame + portrait)                  */
/* ================================================================== */

function TopSongReveal({
  photo,
  title,
  artist,
  topPercent,
}: {
  photo?: string
  title: string
  artist: string
  topPercent: number
}) {
  const ink = "var(--wr-ink)"

  return (
    <Shell>
      <PixelFrame accent="#18ddec" bg="var(--wr-yellow)" outward />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 pb-16 pt-20 text-center sm:px-10 md:pb-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.86 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 125, damping: 17, delay: 0.18 }}
          className="relative aspect-square w-[clamp(11.5rem,42vw,20rem)] overflow-hidden shadow-[0_1.25rem_2.5rem_rgba(11,11,11,0.18)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo || "/wrapped-portrait-1.png"}
            alt={`${title} cover`}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-tr from-cyan-400/25 via-transparent to-yellow-200/20 mix-blend-screen"
            animate={{ opacity: [0.25, 0.6, 0.25] }}
            transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.5 }}
          className="mt-6 max-w-[34rem] font-display text-[clamp(1.15rem,4.4vw,2.25rem)] font-black leading-[1.02] tracking-tight text-balance"
          style={{ color: ink }}
        >
          Your top song was {title}
          <span className="block">by {artist}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 0.82, y: 0 }}
          transition={{ ...SPRING, delay: 0.72 }}
          className="mt-5 max-w-[21rem] font-sans text-[clamp(0.72rem,2.6vw,0.95rem)] font-semibold leading-snug"
          style={{ color: ink }}
        >
          You were in the top {topPercent}% of listeners globally.
        </motion.p>

        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 md:bottom-9">
          <WrapFooter ink={ink} hashtag={HASHTAG} />
        </div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* SLIDE 4 — SPOTIFY WRAPPED GLOBAL ARTISTS                           */
/* ================================================================== */

const GLOBAL_ARTISTS = ["Bad Bunny", "Taylor Swift", "BTS", "Drake", "Justin Bieber"]

function SpotifyMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-[7.7cqw] w-[7.7cqw] shrink-0">
      <circle cx="32" cy="32" r="30" fill="currentColor" />
      <path
        d="M18.5 25.2c9.2-2.6 21.5-1.4 29.1 3"
        fill="none"
        stroke="#f8cdd6"
        strokeLinecap="round"
        strokeWidth="5.2"
      />
      <path
        d="M20.6 33.2c7.8-2 17.5-1.1 24.2 2.4"
        fill="none"
        stroke="#f8cdd6"
        strokeLinecap="round"
        strokeWidth="4.4"
      />
      <path
        d="M22.2 40.8c6.2-1.5 13.6-.7 18.6 1.9"
        fill="none"
        stroke="#f8cdd6"
        strokeLinecap="round"
        strokeWidth="3.8"
      />
    </svg>
  )
}

function WrappedSparkleRibbon() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 392 392"
      preserveAspectRatio="none"
    >
      <defs>
        <mask id="global-artists-ribbon-mask">
          <rect width="392" height="392" fill="black" />
          <path
            d="M432 165C346 166 247 184 254 227c5 31 74 39 99 74 25 36-4 75-64 104"
            fill="none"
            stroke="white"
            strokeLinecap="round"
            strokeWidth="86"
          />
          <path
            d="M-54 322c59 7 128 21 176 39 48 17 81 38 118 57"
            fill="none"
            stroke="white"
            strokeLinecap="round"
            strokeWidth="83"
          />
        </mask>
        <path id="sparkle-shape" d="M0-33C7-9 9-7 33 0C9 7 7 9 0 33C-7 9-9 7-33 0C-9-7-7-9 0-33Z" />
      </defs>

      <g mask="url(#global-artists-ribbon-mask)">
        <rect width="392" height="392" fill="transparent" />
        <path
          d="M432 165C346 166 247 184 254 227c5 31 74 39 99 74 25 36-4 75-64 104"
          fill="none"
          stroke="#030303"
          strokeLinecap="round"
          strokeWidth="86"
        />
        <path
          d="M-54 322c59 7 128 21 176 39 48 17 81 38 118 57"
          fill="none"
          stroke="#030303"
          strokeLinecap="round"
          strokeWidth="83"
        />
        <g fill="#ff1234">
          <use href="#sparkle-shape" transform="translate(330 172) scale(1.05)" />
          <use href="#sparkle-shape" transform="translate(374 180) scale(1.3)" />
          <use href="#sparkle-shape" transform="translate(235 229) scale(.72)" />
          <use href="#sparkle-shape" transform="translate(339 211) scale(.4)" />
          <use href="#sparkle-shape" transform="translate(342 315) scale(.92)" />
          <use href="#sparkle-shape" transform="translate(296 355) scale(.64)" />
          <use href="#sparkle-shape" transform="translate(32 338) scale(.98)" />
          <use href="#sparkle-shape" transform="translate(90 350) scale(1.18)" />
          <use href="#sparkle-shape" transform="translate(137 356) scale(.55)" />
        </g>
      </g>
    </svg>
  )
}

function GlobalArtists() {
  return (
    <Shell>
      <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f8cdd6] text-[#050505]">
        <div className="relative aspect-square h-auto max-h-full w-[min(100vw,100dvh)] max-w-full overflow-hidden bg-[#f8cdd6] [container-type:size]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.28, delay: 0.12, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <WrappedSparkleRibbon />
          </motion.div>

          <motion.header
            initial={{ opacity: 0, y: "-3cqw" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.18 }}
            className="relative z-10 flex items-center justify-between px-[5.2cqw] pt-[5.2cqw] font-display"
          >
            <div className="flex items-center gap-[1.6cqw] text-[#050505]">
              <SpotifyMark />
              <span className="text-[5.1cqw] font-black leading-none tracking-normal">Spotify</span>
            </div>
            <span className="text-[3.55cqw] font-black uppercase leading-none tracking-normal">#SPOTIFYWRAPPED</span>
          </motion.header>

          <motion.main
            initial={{ opacity: 0, y: "4.6cqw" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.32 }}
            className="relative z-10 px-[5.2cqw] pt-[7.8cqw] font-display"
          >
            <h2 className="max-w-[72cqw] text-[7.55cqw] font-black leading-[1.01] tracking-normal text-[#050505]">
              Most Streamed
              <br />
              Artists Globally
            </h2>
            <ol className="mt-[4.2cqw] grid gap-[.3cqw] text-[4.05cqw] font-black leading-[1.08] tracking-normal">
              {GLOBAL_ARTISTS.map((artist, index) => (
                <li key={artist} className="grid grid-cols-[4.2cqw_1fr] items-baseline gap-[2cqw]">
                  <span>{index + 1}</span>
                  <span>{artist}</span>
                </li>
              ))}
            </ol>
          </motion.main>
        </div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* SLIDE 5 — MY TOP ARTISTS (portrait ranking card)                    */
/* ================================================================== */

function FlameStrip() {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 263 92"
      preserveAspectRatio="none"
      className="absolute inset-x-0 top-0 h-[clamp(4.75rem,20cqw,7rem)] w-full"
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 95, damping: 15, delay: 0.05 }}
    >
      <path d="M0 0H263V58c-18-3-30-14-38-31-7 22-24 36-45 38-20 2-38-8-49-27-11 19-29 29-49 27-21-2-38-16-45-38C49 44 35 57 0 62Z" fill="#ed62b9" />
      <g fill="#20206f">
        <path d="M-7 10C7-2 29 2 35 17c4 10-1 20-10 25 1-9-2-14-9-17 2 8-1 14-8 17-9-7-11-18-5-27-4 1-7 3-10 6Z" />
        <path d="M88-7c7 9 4 17-3 23 5 0 10-3 13-8 8 10 9 21 3 30-7 11-25 13-35 4-9-8-10-22-2-31 0 10 5 16 12 18-4-12 0-27 12-36Z" />
        <path d="M270 8c-13-10-33-5-38 10-4 11 2 21 12 25-2-9 2-15 9-18-2 8 1 14 8 17 9-7 11-18 5-27 4 1 7 3 10 6Z" />
        <path d="M244 51c-12 0-21-8-23-19-3 14 4 27 16 33 11 5 23 2 31-6-10 1-18-2-24-8Z" />
        <path d="M19 51c12 0 21-8 23-19 3 14-4 27-16 33-11 5-23 2-31-6 10 1 18-2 24-8Z" />
      </g>
    </motion.svg>
  )
}

function SmallSpotifyLogo() {
  return (
    <svg viewBox="0 0 42 42" aria-hidden="true" className="size-[7cqw] shrink-0">
      <circle cx="21" cy="21" r="20" fill="currentColor" />
      <path d="M10 17c8-2 17-1 23 2" fill="none" stroke="#95eab1" strokeLinecap="round" strokeWidth="3.3" />
      <path d="M12 23c6-1.5 13-.8 19 1.8" fill="none" stroke="#95eab1" strokeLinecap="round" strokeWidth="2.8" />
      <path d="M14 29c5-1 10-.5 15 1.5" fill="none" stroke="#95eab1" strokeLinecap="round" strokeWidth="2.3" />
    </svg>
  )
}

function TopArtistsList({ artists, photos }: { artists: string[]; photos: string[] }) {
  const navy = "#20206f"

  return (
    <Shell>
      <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#95eab1]">
        <div className="relative h-full min-h-0 w-full overflow-hidden bg-[#95eab1] [container-type:size] sm:aspect-[263/465] sm:w-auto sm:max-w-full">
          <FlameStrip />

          <motion.h2
            initial={{ opacity: 0, y: "4cqw" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.32 }}
            className="absolute inset-x-4 top-[19.5%] text-center font-display text-[clamp(1.25rem,7.2cqw,2.15rem)] font-black leading-none tracking-tight"
            style={{ color: navy }}
          >
            My Top Artists
          </motion.h2>

          <ol className="absolute inset-x-[8.5%] top-[28.5%] flex flex-col gap-[1.35cqw]">
            {artists.slice(0, 5).map((artist, index) => (
              <motion.li
                key={`${artist}-${index}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? "-13cqw" : "13cqw" }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 125, damping: 17, delay: 0.45 + index * 0.12 }}
                className="grid h-[18.1cqw] grid-cols-[11cqw_18.1cqw_1fr] items-center gap-[3cqw]"
              >
                <span className="text-right font-display text-[7.2cqw] font-black leading-none" style={{ color: navy }}>
                  #{index + 1}
                </span>
                <motion.div
                  initial={{ scale: 0.7, rotate: index % 2 === 0 ? -7 : 7 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 150, damping: 14, delay: 0.52 + index * 0.12 }}
                  className="size-[18.1cqw] overflow-hidden bg-[#20206f]/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photos[index] || `/wrapped-portrait-${(index % 3) + 1}.png`}
                    alt={artist}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </motion.div>
                <span className="min-w-0 overflow-hidden text-ellipsis font-display text-[clamp(0.72rem,4.15cqw,1.25rem)] font-black leading-[1.05] tracking-tight" style={{ color: "#07070d" }}>
                  {artist}
                </span>
              </motion.li>
            ))}
          </ol>

          <motion.footer
            initial={{ opacity: 0, y: "4cqw" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 1.16 }}
            className="absolute inset-x-[7.5%] bottom-[3.6%] flex items-center justify-between font-display font-black"
            style={{ color: navy }}
          >
            <div className="flex items-center gap-[1.5cqw]">
              <SmallSpotifyLogo />
              <span className="text-[4.2cqw]">Spotify</span>
            </div>
            <span className="text-[3.15cqw] uppercase">spotify.com/wrapped</span>
          </motion.footer>
        </div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* SLIDE 6 — TOP TRACK (typography wall + spinning vinyl)             */
/* ================================================================== */

function MarqueeRow({
  text,
  ink,
  duration,
  reverse,
  outline,
}: {
  text: string
  ink: string
  duration: number
  reverse?: boolean
  outline?: boolean
}) {
  const content = Array.from({ length: 8 }).map((_, i) => (
    <span key={i} className="mx-4">
      {text}
    </span>
  ))
  return (
    <motion.div
      className="flex whitespace-nowrap font-display text-6xl font-black uppercase tracking-tight md:text-8xl"
      style={
        outline
          ? { color: "transparent", WebkitTextStroke: `2px ${ink}`, opacity: 0.35 }
          : { color: ink, opacity: 0.12 }
      }
      animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
      transition={{ duration, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      <div className="flex">{content}</div>
      <div className="flex">{content}</div>
    </motion.div>
  )
}

function TopTrack({
  bg,
  ink,
  accent,
  kicker,
  title,
  artist,
  photo,
}: {
  bg: string
  ink: string
  accent: string
  kicker: string
  title: string
  artist: string
  photo?: string
}) {
  return (
    <Shell>
      {/* moving typography wall */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-6">
        <MarqueeRow text={HASHTAG} ink={ink} duration={22} />
        <MarqueeRow text={HASHTAG} ink={ink} duration={16} reverse outline />
        <MarqueeRow text={HASHTAG} ink={ink} duration={28} />
        <MarqueeRow text={HASHTAG} ink={ink} duration={19} reverse outline />
      </div>

      <div className="relative grid h-full w-full grid-cols-1 items-center gap-8 px-6 py-10 md:grid-cols-[1.15fr_0.85fr] md:px-14">
        <div className="flex flex-col justify-center gap-3">
          <Kicker ink={ink}>{kicker}</Kicker>
          <motion.h2
            initial={{ opacity: 0, scale: 2.2, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
            transition={{ type: "spring", stiffness: 170, damping: 15, delay: 0.1 }}
            className="font-display text-6xl font-black uppercase leading-[0.85] tracking-tight text-balance md:text-8xl"
            style={{ color: ink }}
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.5 }}
            className="font-display text-lg font-black uppercase tracking-widest"
            style={{ color: accent }}
          >
            {artist}
          </motion.p>
        </div>

        {/* spinning vinyl card */}
        <motion.div
          initial={{ opacity: 0, x: 80, rotate: 8 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ ...SPRING, delay: 0.35 }}
          className="flex items-center justify-center"
        >
          <div
            className="relative w-[60vw] max-w-[18rem] border-4 p-4 md:w-full"
            style={{ borderColor: ink, backgroundColor: "var(--wr-ink)" }}
          >
            <motion.div
              className="relative mx-auto aspect-square w-full overflow-hidden rounded-full border-4"
              style={{ borderColor: accent }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo || "/wrapped-portrait-1.png"}
                alt="Now playing artwork"
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
              <span
                className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                style={{ backgroundColor: "var(--wr-ink)", borderColor: accent }}
              />
            </motion.div>
            <p className="mt-3 text-center font-display text-xs font-black uppercase tracking-widest text-cream/70">
              On Repeat
            </p>
          </div>
        </motion.div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* SLIDE 4 — THE RECEIPTS (staggered leaderboard)                     */
/* ================================================================== */

function Receipts({
  bg,
  ink,
  kicker,
  title,
  rows,
}: {
  bg: string
  ink: string
  kicker: string
  title: string
  rows: { label: string; value: string; pct: number }[]
}) {
  return (
    <Shell>
      <Halftone dark={bg !== "var(--wr-ink)"} />
      <div className="relative flex h-full w-full flex-col justify-center gap-5 px-6 md:px-14">
        <Kicker ink={ink}>{kicker}</Kicker>
        <ClipHeading
          lines={[title]}
          ink={ink}
          delay={0.15}
          className="font-display text-4xl font-black leading-[0.9] tracking-tight md:text-6xl"
        />
        <motion.div
          className="mt-2 flex w-full max-w-2xl flex-col gap-4"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } } }}
        >
          {rows.map((r, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, x: -40 },
                show: { opacity: 1, x: 0, transition: SPRING },
              }}
              whileHover={{ scale: 1.03 }}
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span
                  className="flex items-baseline gap-3 font-display text-lg font-black uppercase md:text-2xl"
                  style={{ color: ink }}
                >
                  <span className="opacity-40">{String(i + 1).padStart(2, "0")}</span>
                  {r.label}
                </span>
                <span className="font-display text-lg font-black tabular-nums md:text-2xl" style={{ color: ink }}>
                  {r.value}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: `${ink}22` }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: ink }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${r.pct}%` }}
                  transition={{ ...SPRING, delay: 0.5 + i * 0.14 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-3">
          <WrapFooter ink={ink} hashtag={HASHTAG} />
        </div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* SLIDE 5 — VERSUS LEAGUE (crashing headline + geometric window)     */
/* ================================================================== */

const SLANT_CLIP = "polygon(12% 0, 100% 0, 88% 100%, 0 100%)"

function VersusLeague({
  bg,
  ink,
  accent,
  kicker,
  left,
  right,
  leagueTitle,
  photo,
}: {
  bg: string
  ink: string
  accent: string
  kicker: string
  left: string
  right: string
  leagueTitle: string
  photo?: string
}) {
  return (
    <Shell>
      <Halftone dark={bg !== "var(--wr-ink)"} />
      <div className="relative flex h-full w-full flex-col justify-center gap-6 px-6 py-10 md:px-14">
        <Kicker ink={ink}>{kicker}</Kicker>

        {/* crashing team names */}
        <div className="relative flex items-center justify-center gap-3 md:gap-6">
          <motion.span
            initial={{ x: "-120%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.15 }}
            className="flex-1 text-right font-display text-4xl font-black uppercase leading-[0.85] tracking-tight md:text-6xl"
            style={{ color: ink }}
          >
            {left}
          </motion.span>
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.55 }}
            className="shrink-0 font-display text-3xl font-black uppercase md:text-5xl"
            style={{ color: accent }}
          >
            vs
          </motion.span>
          <motion.span
            initial={{ x: "120%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.15 }}
            className="flex-1 text-left font-display text-4xl font-black uppercase leading-[0.85] tracking-tight md:text-6xl"
            style={{ color: ink }}
          >
            {right}
          </motion.span>
        </div>

        {/* geometric media window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...SPRING, delay: 0.7 }}
          className="mx-auto aspect-[16/7] w-full max-w-2xl overflow-hidden"
          style={{ clipPath: SLANT_CLIP, backgroundColor: ink }}
        >
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <motion.img
              src={photo}
              alt="Most watched moment"
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ ...SPRING, delay: 0.7 }}
            />
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.95 }}
          className="text-center font-display text-lg font-black uppercase tracking-widest"
          style={{ color: ink, opacity: 0.75 }}
        >
          {leagueTitle}
        </motion.p>
        <div className="flex justify-center">
          <WrapFooter ink={ink} hashtag={HASHTAG} />
        </div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* SLIDE 6 — VERSUS BOARD (ranked matchups crashing in)               */
/* ================================================================== */

function VersusBoard({
  bg,
  ink,
  accent,
  kicker,
  title,
  games,
}: {
  bg: string
  ink: string
  accent: string
  kicker: string
  title: string
  games: { rank: number; team1: string; team2: string; competition: string }[]
}) {
  return (
    <Shell>
      <Halftone dark={bg !== "var(--wr-ink)"} />
      <div className="relative flex h-full w-full flex-col justify-center gap-4 px-6 py-10 md:px-14">
        <Kicker ink={ink}>{kicker}</Kicker>
        <ClipHeading
          lines={[title]}
          ink={ink}
          delay={0.15}
          className="font-display text-4xl font-black leading-[0.9] tracking-tight md:text-6xl"
        />
        <div className="mt-2 flex max-w-3xl flex-col gap-3.5">
          {games.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.25 + i * 0.12 }}
              whileHover={{ scale: 1.02 }}
              className="grid grid-cols-[auto_1fr] items-center gap-4 border-b-[3px] pb-3.5"
              style={{ borderColor: ink }}
            >
              <span className="font-display text-4xl font-black leading-none md:text-6xl" style={{ color: accent }}>
                {g.rank}
              </span>
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <motion.span
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ ...SPRING, delay: 0.35 + i * 0.12 }}
                    className="font-display text-xl font-black uppercase md:text-3xl"
                    style={{ color: ink }}
                  >
                    {g.team1}
                  </motion.span>
                  <span className="font-display text-sm font-black uppercase opacity-50" style={{ color: ink }}>
                    vs
                  </span>
                  <motion.span
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ ...SPRING, delay: 0.35 + i * 0.12 }}
                    className="font-display text-xl font-black uppercase md:text-3xl"
                    style={{ color: ink }}
                  >
                    {g.team2}
                  </motion.span>
                </div>
                <span
                  className="font-display text-[0.68rem] font-bold uppercase tracking-widest md:text-xs"
                  style={{ color: ink, opacity: 0.6 }}
                >
                  {g.competition}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* SLIDE 7 — DASHBOARD (festival ticket / receipt stub)               */
/* ================================================================== */

function DashboardTicket({
  bg,
  ink,
  photo,
  topArtists,
  topSongs,
  minutesListened,
  topGenre,
}: {
  bg: string
  ink: string
  year: string
  photo?: string
  topArtists: string[]
  topSongs: string[]
  minutesListened: string
  topGenre: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(cardRef, { once: true })
  const red = "#ff3f31"
  const cream = "var(--wr-cream)"

  const rankedLine = (item: string, i: number) => (
    <p key={`${item}-${i}`} className="flex min-w-0 items-baseline gap-2 font-display leading-[1.05]" style={{ color: ink }}>
      <span className="w-4 shrink-0 text-right text-lg font-black md:text-xl">{i + 1}</span>
      <span className="min-w-0 truncate text-lg font-black md:text-xl">{item}</span>
    </p>
  )

  return (
    <Shell>
      <div className="absolute inset-0" style={{ backgroundColor: bg }} />
      <motion.div
        aria-hidden="true"
        className="absolute inset-[-30%] opacity-25"
        style={{
          background:
            "repeating-radial-gradient(circle at 42% 48%, transparent 0 34px, rgba(238,238,228,0.72) 34px 48px, transparent 48px 82px)",
          transformOrigin: "42% 48%",
        }}
        animate={{ scale: [0.82, 1.2], opacity: [0.16, 0.28, 0.16] }}
        transition={{ duration: 5.8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      <div className="relative flex h-full w-full items-center justify-center px-4 py-6 md:px-8">
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          style={{ backgroundColor: cream }}
          className="relative w-full max-w-sm overflow-hidden shadow-2xl"
        >
          <div className="absolute -left-10 -top-7 z-20 select-none overflow-hidden font-display text-[9.5rem] font-black uppercase leading-[0.78] md:text-[10.5rem]" style={{ color: red }}>
            <span className="block [writing-mode:vertical-rl]">wrap</span>
          </div>

          <div className="relative h-[21.5rem] overflow-hidden md:h-[22.5rem]">
            <motion.div
              aria-hidden="true"
              className="absolute -inset-20"
              style={{
                background:
                  "repeating-radial-gradient(circle at 74% 50%, var(--wr-cream) 0 13px, var(--wr-cream) 13px 29px, var(--wr-ink) 29px 43px, var(--wr-ink) 43px 58px)",
                transformOrigin: "74% 50%",
              }}
              animate={{ scale: [0.88, 1.24], opacity: [1, 1, 0.88] }}
              transition={{ duration: 5.4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <div className="absolute left-1/2 top-9 z-30 aspect-square w-[72%] max-w-[18.5rem] -translate-x-1/2 overflow-hidden shadow-[0_8px_0_rgba(0,0,0,0.04)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo || "/wrapped-portrait-1.png"}
                alt="Wrapped headliner"
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
          </div>

          <motion.div
            className="relative z-30 px-7 pb-8 pt-8 md:px-8"
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.22 } } }}
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: SPRING } }}
              className="grid grid-cols-2 gap-5"
            >
              <div className="min-w-0">
                <p className="mb-3 font-display text-sm font-black leading-none" style={{ color: ink }}>
                  Top Artists
                </p>
                <div className="space-y-1">{topArtists.map(rankedLine)}</div>
              </div>
              <div className="min-w-0">
                <p className="mb-3 font-display text-sm font-black leading-none" style={{ color: ink }}>
                  Top Songs
                </p>
                <div className="space-y-1">{topSongs.map(rankedLine)}</div>
              </div>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: SPRING } }}
              className="mt-9 grid grid-cols-2 items-start gap-5"
            >
              <div className="min-w-0">
                <p className="mb-3 font-display text-sm font-black leading-none" style={{ color: ink }}>
                  Minutes Listened
                </p>
                <p className="font-display text-[2.45rem] font-black leading-none tracking-normal tabular-nums md:text-[2.85rem]" style={{ color: ink }}>
                  {minutesListened}
                </p>
              </div>
              <div className="min-w-0">
                <p className="mb-3 font-display text-sm font-black leading-none" style={{ color: ink }}>
                  Top Genre
                </p>
                <p className="truncate font-display text-[2.45rem] font-black leading-none md:text-[2.85rem]" style={{ color: ink }}>
                  {topGenre}
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: SPRING } }}
              className="mt-12 flex items-center justify-between gap-4"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: ink }}>
                <svg viewBox="0 0 64 64" aria-hidden="true" className="size-8" fill="none">
                  <path d="M17 25.5c10.5-3.2 21.5-2.4 31.7 2.5" stroke={cream} strokeWidth="5.2" strokeLinecap="round" />
                  <path d="M19.8 33.1c8.6-2.3 17.1-1.7 25.5 2" stroke={cream} strokeWidth="4.3" strokeLinecap="round" />
                  <path d="M22.3 40.2c6.4-1.5 12.5-1.1 18.9 1.6" stroke={cream} strokeWidth="3.7" strokeLinecap="round" />
                </svg>
              </div>
              <p className="font-display text-lg font-black uppercase tracking-normal md:text-xl" style={{ color: ink }}>
                spotify.com/wrapped
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* SLIDE 8 — GRAND FINALE (share card + kaleidoscope)                 */
/* ================================================================== */

function Kaleidoscope() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "conic-gradient(from 0deg, var(--wr-pink), var(--wr-purple), var(--wr-green), var(--wr-yellow), var(--wr-orange), var(--wr-pink))",
          filter: "blur(2px)",
        }}
        animate={{ rotate: 360, scale: [1, 1.12, 1] }}
        transition={{
          rotate: { duration: 26, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          scale: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 mix-blend-overlay"
        style={{
          background:
            "repeating-conic-gradient(from 0deg, transparent 0deg 12deg, rgba(0,0,0,0.28) 12deg 24deg)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 34, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(11,11,11,0.34)" }} />
    </div>
  )
}

function FinaleCard({ data, stats, bg, ai }: { data: WrapData; stats: WrapStats; bg: string; ai: AiWrapContent }) {
  const { reset } = useWrap()
  const meta = PURPOSES.find((p) => p.id === (data.purpose ?? "life"))!
  const palette = PALETTES[bg] ?? PALETTES["var(--wr-yellow)"]

  async function share() {
    const shareData = {
      title: "Your Life, Wrapped",
      text: ai.finale?.tagline ?? `Your year is officially wrapped. Your year. Unhinged.`,
      url: typeof window !== "undefined" ? window.location.origin : "",
    }
    try {
      if (typeof navigator !== "undefined" && navigator.share) await navigator.share(shareData)
      else if (typeof navigator !== "undefined") {
        await navigator.clipboard.writeText(shareData.url)
        alert("Link copied. Go post it.")
      }
    } catch {
      /* user dismissed */
    }
  }

  return (
    <Shell>
      <Kaleidoscope />
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50, rotate: 3, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5, scale: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          className="relative z-10 w-full max-w-xs border-4 border-ink bg-cream p-5 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <p className="font-display text-xs font-black uppercase tracking-widest" style={{ color: meta.color }}>
              {meta.label}
            </p>
            <span className="font-display text-2xl font-black text-ink">2025</span>
          </div>
          <p className="font-display text-4xl font-black uppercase leading-none text-ink">
            Your wrapped
          </p>
          <div className="relative mx-auto my-4 aspect-square w-full max-w-[14rem]">
            <Burst photo={data.photos[0]?.url} palette={palette} delay={0.2} className="h-full w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2 font-display uppercase">
            <div className="bg-ink p-3">
              <p className="text-2xl font-black text-green tabular-nums">{fmt(stats.minutesLived)}</p>
              <p className="text-[10px] font-bold tracking-widest text-cream/70">min lived</p>
            </div>
            <div className="bg-ink p-3">
              <p className="text-2xl font-black text-pink">Top {stats.topPercent}%</p>
              <p className="text-[10px] font-bold tracking-widest text-cream/70">main character</p>
            </div>
          </div>
          <p className="mt-4 text-center font-display text-sm font-black uppercase tracking-widest text-ink/50">
            {HASHTAG}
          </p>
        </motion.div>

        {/* pulsing action footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.5 }}
          className="z-10 flex items-center gap-3"
        >
          <motion.button
            type="button"
            onClick={share}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            whileHover={{ scale: 1.12, y: -6, rotate: -2 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 rounded-full bg-green px-6 py-3 font-display text-sm font-black uppercase tracking-wide text-ink shadow-xl"
          >
            <Share2 className="size-4" />
            Share
          </motion.button>
          <motion.button
            type="button"
            onClick={reset}
            whileHover={{ rotate: -180 }}
            whileTap={{ scale: 0.92 }}
            transition={SPRING}
            className="flex items-center justify-center rounded-full border-2 border-cream/60 bg-ink/40 p-3 text-cream backdrop-blur-md"
            aria-label="Start over"
          >
            <RotateCcw className="size-5" />
          </motion.button>
        </motion.div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* page builder — one elite 8-slide sequence for every purpose        */
/* ================================================================== */

function bigMetric(data: WrapData, stats: WrapStats, ai: AiWrapContent) {
  const purpose = data.purpose ?? "life"
  if (purpose === "couple") {
    const days = daysSince(data.anniversaryDate) || stats.int(200, 2400)
    return { value: days, label: ai.dataHighlight.label, note: ai.dataHighlight.note }
  }
  if (purpose === "travel") {
    const hours = Number(data.travelHours) || stats.int(60, 380)
    return { value: hours, label: ai.dataHighlight.label, note: ai.dataHighlight.note }
  }
  if (purpose === "birthday") {
    const age = data.birthYear ? Math.max(1, new Date().getFullYear() - Number(data.birthYear)) : stats.int(18, 60)
    return { value: age, label: ai.dataHighlight.label, note: ai.dataHighlight.note }
  }
  if (purpose === "group") {
    return { value: stats.streakDays, label: ai.dataHighlight.label, note: ai.dataHighlight.note }
  }
  return { value: stats.streakDays, label: ai.dataHighlight.label, note: ai.dataHighlight.note }
}

export function buildPages(data: WrapData, ai: AiWrapContent): WrapPage[] {
  const stats = buildStats(data)
  const purpose = data.purpose ?? "life"
  const photos = data.photos.map((p) => p.url)
  const photo0 = photos[0]

  // ─── SLIDE 1: INTRO ───
  const introKicker = ai.intro.kicker
  const introLines = ai.intro.lines
  const introSub = ai.intro.sub

  // ─── SLIDE 2: DATA HIGHLIGHT ───
  const big = bigMetric(data, stats, ai)
  const dataKicker = ai.dataHighlight.kicker
  const dataLabel = big.label
  const dataNote = big.note

  // ─── SLIDE 3: TOP TRACK ───
  const anthem = data.anthemTitle || "Your Anthem"
  const trackKicker = ai.topTrack.kicker
  const trackArtistLine = ai.topTrack.artistLine

  // ─── SLIDE 4: RECEIPTS ───
  const receiptTitle = ai.receipts.title
  const receiptRows = ai.receipts.rows.slice(0, 4).map((r, i) => ({
    label: r.label,
    value: r.value,
    pct: stats.int(50, 98 - i * 5),
  }))

  // ─── SLIDE 5: VERSUS ───
  const versusKicker = ai.versus.kicker
  const versusLeft = ai.versus.left
  const versusRight = ai.versus.right
  const versusLeagueTitle = ai.versus.leagueTitle

  // ─── SLIDE 6: VERSUS BOARD ───
  const vsBoardKicker = ai.versusBoard.kicker
  const vsBoardTitle = ai.versusBoard.title
  const vsBoardGames = ai.versusBoard.games.slice(0, 4).map((g, i) => ({
    rank: i + 1,
    team1: g.team1,
    team2: g.team2,
    competition: g.competition,
  }))

  // ─── SLIDE 7: DASHBOARD ───
  const dashboardArtists = ai.dashboard.topArtists.slice(0, 5)
  const topArtists = Array.from(
    { length: 5 },
    (_, i) => dashboardArtists[i] || ["The Beatles", "George Harrison", "Cigarettes After Sex", "Queen", "John Lennon"][i],
  )
  const dashboardSongs = ai.dashboard.topSongs.slice(0, 3)
  const dashboardGenre = ai.dashboard.topGenre

  return [
    {
      key: "s1",
      bg: "var(--wr-orange)",
      node: (
        <IntroUniverse
          bg="var(--wr-orange)"
          ink="var(--wr-ink)"
          kicker={introKicker}
          lines={introLines}
          sub={introSub}
          photo={photo0}
          songTitle={anthem}
          songArtist={trackArtistLine}
          songStat={`${fmt(stats.int(100000, 5000000))} streams in ${data.destinationCity || "NYC"}`}
        />
      ),
    },
    {
      key: "s2-share",
      bg: "#101010",
      node: <ShareWrappedSlide />,
    },
    {
      key: "s2",
      bg: "var(--wr-yellow)",
      node: (
        <DataHighlight
          bg="var(--wr-yellow)"
          ink="var(--wr-ink)"
          accent="#18ddec"
          kicker={dataKicker}
          value={big.value}
          label={dataLabel}
          note={dataNote}
        />
      ),
    },
    {
      key: "s3-top-song",
      bg: "var(--wr-yellow)",
      node: (
        <TopSongReveal
          photo={photo0}
          title={anthem}
          artist={trackArtistLine}
          topPercent={stats.topPercent}
        />
      ),
    },
    {
      key: "s4-global-artists",
      bg: "#f8cdd6",
      node: (
        <SpiralRibbon>
          <GlobalArtists />
        </SpiralRibbon>
      ),
    },
    {
      key: "s5-top-artists",
      bg: "#95eab1",
      node: <TopArtistsList artists={topArtists} photos={photos} />,
    },
    {
      key: "s3-artist-stats",
      bg: "#E9148C",
      node: (
        <ArtistStatsCard
          artistName={dashboardArtists[0] || "Top Artist"}
          photoUrl={photo0}
          streams={stats.int(50, 400) + stats.int(0, 9) / 10}
          hours={stats.int(5, 50) + stats.int(0, 9) / 10}
          listeners={stats.int(10, 100) + stats.int(0, 9) / 10}
          countries={stats.int(30, 100)}
        />
      ),
    },
    {
      key: "s-world-citizen",
      bg: "#2D8C7E",
      node: (
        <WorldCitizen
          countriesCount={stats.int(24, 58)}
        />
      ),
    },
    {
      key: "s3",
      bg: "var(--wr-purple)",
      node: (
        <TopTrack
          bg="var(--wr-purple)"
          ink="var(--wr-yellow)"
          accent="var(--wr-green)"
          kicker={trackKicker}
          title={anthem}
          artist={trackArtistLine}
          photo={photo0}
        />
      ),
    },
    {
      key: "s4",
      bg: "var(--wr-green)",
      node: (
        <Receipts bg="var(--wr-green)" ink="var(--wr-ink)" kicker="The receipts" title={receiptTitle} rows={receiptRows} />
      ),
    },
    {
      key: "s5",
      bg: "var(--wr-yellow)",
      node: (
        <VersusLeague
          bg="var(--wr-yellow)"
          ink="var(--wr-ink)"
          accent="var(--wr-pink)"
          kicker={versusKicker}
          left={versusLeft}
          right={versusRight}
          leagueTitle={versusLeagueTitle}
          photo={photo0}
        />
      ),
    },
    {
      key: "s6",
      bg: "var(--wr-orange)",
      node: (
        <VersusBoard
          bg="var(--wr-orange)"
          ink="var(--wr-ink)"
          accent="var(--wr-purple)"
          kicker={vsBoardKicker}
          title={vsBoardTitle}
          games={vsBoardGames}
        />
      ),
    },
    {
      key: "s7",
      bg: "var(--wr-ink)",
      node: (
        <DashboardTicket
          bg="var(--wr-ink)"
          ink="var(--wr-ink)"
          year="2025"
          photo={photo0}
          topArtists={dashboardArtists}
          topSongs={dashboardSongs}
          minutesListened={fmt(stats.int(40000, 90000))}
          topGenre={dashboardGenre}
        />
      ),
    },
    {
      key: "s8",
      bg: "var(--wr-ink)",
      node: <FinaleCard data={data} stats={stats} bg="var(--wr-ink)" ai={ai} />,
    },
  ]
}
