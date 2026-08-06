"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useInView } from "framer-motion"
import { RotateCcw, Share2 } from "lucide-react"
import { Burst, Halftone, WrapFooter, type BurstPalette } from "@/components/player/burst"
import { SpiralRibbon } from "@/components/player/spiral-ribbon"
import { ArtistStatsCard } from "@/components/player/artist-stats"
import { WorldCitizen } from "@/components/player/world-citizen"
import { Wrapped2023Slide } from "@/components/player/wrapped-2023-slide"
import { PersonalityCardSlide } from "@/components/player/personality-card"
import { useWrap, type WrapData } from "@/context/wrap-context"
import { PURPOSES } from "@/context/wrap-context"
import { buildStats, fmt, type WrapStats } from "@/lib/wrap-stats"
import type { AiWrapContent } from "@/lib/ai-types"
import { WrapCard } from "@/components/shared/wrap-card"
import { ShareModal } from "./share-modal"
import * as htmlToImage from "html-to-image"

export type WrapPage = { key: string; bg: string; node: ReactNode }

/* fluid spring physics used across every slide */
const SPRING = { type: "spring", stiffness: 120, damping: 14 } as const
const HASHTAG = "#YOURSTORYWRAPPED"

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
            <Burst photo={photo} palette={palette} delay={0.2} style={{ width: "82vw", maxWidth: "26rem" }} />
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
          <Burst photo={photo} palette={palette} delay={0.2} style={{ width: "32vw", maxWidth: "28rem" }} />
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

/* block width/height for the checkerboard corner pattern */
const BW = "clamp(2.5rem, 12vw, 5.5rem)"    /* block width */
const BH = "clamp(1.6rem, 7vw, 3.2rem)"      /* block height */

function cornerBlocks(
  hSide: "left" | "right",
  vSide: "top" | "bottom",
) {
  /* 3 rows × 3 cols staircase, alternating purple/dark */
  const cols = 3
  const rows = 3
  const blocks: { style: Record<string, string>; color: string; delay: number }[] = []

  for (let r = 0; r < rows; r++) {
    const colsInRow = cols - r          /* staircase: 3, 2, 1 */
    for (let c = 0; c < colsInRow; c++) {
      const isPurple = (r + c) % 2 === 0
      const hOff = `calc(${c} * ${BW})`
      const vOff = `calc(${r} * ${BH})`
      blocks.push({
        style: { [hSide]: hOff, [vSide]: vOff },
        color: isPurple ? "#7200c9" : "#1a1a2e",
        delay: (r * cols + c) * 0.04,
      })
    }
  }
  return blocks
}

const SHARE_BLOCKS = [
  ...cornerBlocks("left", "top"),
  ...cornerBlocks("right", "top"),
  ...cornerBlocks("left", "bottom"),
  ...cornerBlocks("right", "bottom"),
]

const SHARE_ORBS = [
  /* corners — large, partially off-screen */
  { left: "-6%", top: "14%", delay: 0 },
  { right: "-6%", top: "14%", delay: 0.25 },
  { left: "-6%", bottom: "14%", delay: 0.4 },
  { right: "-6%", bottom: "14%", delay: 0.55 },
]

function ShareWrapsyLogo() {
  return (
    <div className="flex items-center gap-2 text-[#101010] sm:gap-[1.2cqw]">
      <svg viewBox="0 0 64 64" aria-hidden="true" className="size-[clamp(1.8rem,7vw,3rem)] sm:size-[clamp(2.5rem,6cqw,4rem)]">
        <circle cx="32" cy="32" r="30" fill="currentColor" />
        <path d="M17 25c10-3 22-2 31 2.5" fill="none" stroke="#ff861b" strokeLinecap="round" strokeWidth="5" />
        <path d="M20 33c8-2 17-1.3 25 2" fill="none" stroke="#ff861b" strokeLinecap="round" strokeWidth="4.2" />
        <path d="M22 41c6-1.5 13-.8 19 1.7" fill="none" stroke="#ff861b" strokeLinecap="round" strokeWidth="3.6" />
      </svg>
      <span className="font-display text-[clamp(1.2rem,5vw,2.2rem)] font-black tracking-tight sm:text-[clamp(1.7rem,4.2cqw,3rem)]">Wrapsy</span>
    </div>
  )
}

function ShareWrappedSlide({ title = "Share your\nWrapsy Wrapped", hashtag = "#WrapsyWrapped" }: { title?: string, hashtag?: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="relative flex h-full w-full items-center justify-center bg-[#101010] overflow-visible [container-type:size]">
        {/* Checkerboard staircase blocks at corners */}
        {SHARE_BLOCKS.map((block, index) => (
          <motion.div
            key={index}
            aria-hidden="true"
            className="absolute"
            style={{
              ...block.style,
              width: BW,
              height: BH,
              backgroundColor: block.color,
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              opacity: { duration: 0.25, delay: block.delay },
              scale: { duration: 0.4, delay: block.delay, ease: "easeOut" },
            }}
          />
        ))}

        {/* Yellow orbs — large proper circles, bleeding off edges */}
        {SHARE_ORBS.map((orb, index) => {
          const { delay, ...pos } = orb
          return (
            <motion.div
              key={index}
              aria-hidden="true"
              className="absolute z-[2] rounded-full bg-[#efff38]"
              style={{
                ...pos,
                width: "clamp(5rem, 22vw, 12rem)",
                height: "clamp(5rem, 22vw, 12rem)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [1, 1.06, 0.97, 1], x: [0, index % 2 === 0 ? 6 : -6, 0] }}
              transition={{
                opacity: { duration: 0.3, delay: 0.15 + delay },
                scale: { duration: 4.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay },
                x: { duration: 5.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay },
              }}
            />
          )
        })}

        {/* Scale-carrying container for the shape and foreground content to prevent gaps/bleed */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center overflow-visible"
          initial={{ scale: 0, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 3.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        >
          {/* Jagged orange shape */}
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 z-[3] aspect-square w-[135vw] sm:w-[145vh] bg-[#ff861b]"
            style={{
              clipPath:
                "polygon(50.0% 0.0%,56.6% 8.5%,65.5% 2.4%,69.1% 12.6%,79.4% 9.5%,79.7% 20.3%,90.5% 20.6%,87.4% 30.9%,97.6% 34.5%,91.5% 43.4%,100.0% 50.0%,91.5% 56.6%,97.6% 65.5%,87.4% 69.1%,90.5% 79.4%,79.7% 79.7%,79.4% 90.5%,69.1% 87.4%,65.5% 97.6%,56.6% 91.5%,50.0% 100.0%,43.4% 91.5%,34.5% 97.6%,30.9% 87.4%,20.6% 90.5%,20.3% 79.7%,9.5% 79.4%,12.6% 69.1%,2.4% 65.5%,8.5% 56.6%,0.0% 50.0%,8.5% 43.4%,2.4% 34.5%,12.6% 30.9%,9.5% 20.6%,20.3% 20.3%,20.6% 9.5%,30.9% 12.6%,34.5% 2.4%,43.4% 8.5%)",
              x: "-50%",
              y: "-50%",
            }}
            animate={{ scale: [1.08, 1.1, 1.08], rotate: [0, 0.6, -0.5, 0] }}
            transition={{
              scale: {
                duration: 4.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                times: [0, 0.5, 1],
              },
              rotate: { duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-[8%] text-center text-[#080808] sm:px-[12%]">
            <motion.h2
              initial={{ opacity: 0, y: 32, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 45, damping: 20, delay: 1.6 }}
              className="font-display text-[clamp(2.5rem,12vw,4.5rem)] font-black leading-[0.95] tracking-tight text-balance sm:text-[clamp(2.25rem,6.3cqw,5.5rem)]"
            >
              {title.split('\n').map((line, i) => <span key={i} className="block">{line}</span>)}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.8em" }}
              animate={{ opacity: 1, letterSpacing: "0.16em" }}
              transition={{ duration: 1.1, delay: 2.2, ease: "easeOut" }}
              className="mt-3 font-display text-[clamp(0.6rem,2.6vw,0.85rem)] font-black uppercase sm:mt-[2.2cqh] sm:text-[clamp(0.55rem,1.15cqw,0.8rem)]"
            >
              {hashtag}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 45, damping: 18, delay: 2.7 }}
              className="absolute bottom-[12%] sm:bottom-[15%]"
            >
              <ShareWrapsyLogo />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ================================================================== */
/* SLIDE 3 — DATA HIGHLIGHT (Wrapped 2026 pixel frame + count up)     */
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
  slideInCorners = true,
}: {
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  delay?: number
  accent: string
  shutterPhase?: "closing" | "opening"
  outward?: boolean
  slideInCorners?: boolean
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
      className={`pointer-events-none absolute ${isTop ? "top-0" : "bottom-0"} ${isRight ? "right-0 items-end" : "left-0 items-start"
        } z-0 flex flex-col w-[50vw] overflow-hidden`}
    >
      {rows.map((width, i) => {
        const shutterDelay = isClosing ? i * 0.07 : (rows.length - 1 - i) * 0.05
        const shutterDuration = isClosing ? 2.6 - shutterDelay : 2.8 - shutterDelay

        return (
          <motion.div
            key={`${corner}-${i}`}
            initial={
              isShutter
                ? {
                  opacity: 1,
                  x: isClosing ? (slideInCorners ? (isRight ? "100%" : "-100%") : 0) : 0,
                  y: 0,
                  width: isClosing ? (slideInCorners ? 0 : width) : width,
                  height: PIXEL_ROW_HEIGHT,
                }
                : { opacity: 0, x: enterX, y: enterY }
            }
            animate={{
              opacity: 1,
              x: isShutter && !isClosing && slideInCorners ? (isRight ? "100%" : "-100%") : 0,
              y: 0,
              width: isShutter
                ? (isClosing ? `${isTop ? 42 + i * 4.8 : 61.2 - i * 4.8}vw` : (slideInCorners ? 0 : width))
                : width,
              height: PIXEL_ROW_HEIGHT,
            }}
            transition={
              isShutter
                ? {
                  x: {
                    duration: shutterDuration,
                    delay: shutterDelay,
                    ease: [0.76, 0, 0.24, 1],
                  },
                  width: {
                    duration: shutterDuration,
                    delay: shutterDelay,
                    ease: [0.76, 0, 0.24, 1],
                  },
                }
                : {
                  opacity: { ...SPRING, delay: delay + i * 0.08 },
                  x: { ...SPRING, delay: delay + i * 0.08 },
                  y: { ...SPRING, delay: delay + i * 0.08 },
                }
            }
            className={`relative overflow-hidden flex ${columnDirection}`}
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
            {/* 2024 Wrapped Style Glare/Sheen Overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none mix-blend-overlay z-[2]"
              style={{
                backgroundImage: "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.7) 50%, transparent 65%)",
                backgroundSize: "250% 100%",
              }}
              animate={{
                backgroundPosition: ["200% 0", "-150% 0"],
              }}
              transition={{
                duration: 2.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: delay + i * 0.12,
                repeatDelay: 2,
              }}
            />
          </motion.div>
        )
      })}
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
            className={`absolute inset-x-0 flex flex-col overflow-hidden ${className}`}
            style={{
              top: `calc(5 * ${PIXEL_ROW_HEIGHT})`,
              bottom: `calc(5 * ${PIXEL_ROW_HEIGHT})`
            }}
          >
            {rows.map((_, i) => {
              const distanceFromCenter = Math.abs(i - maxDistance)
              const centerProgress = (maxDistance - distanceFromCenter) / widthSpan
              const width = 61.2 + centerProgress * 8.8
              const delay = Math.min(i, count - 1 - i) * 0.07
              const duration = isClosing ? 2.6 - delay : 2.8 - delay

              return (
                <motion.div key={i} className="relative flex-1 shrink-0">
                  <div className="absolute inset-y-0 left-0 w-[50vw] overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 flex"
                      initial={{ x: "-100%" }}
                      animate={{ x: isClosing ? "0%" : "-100%" }}
                      transition={{ duration, delay, ease: [0.76, 0, 0.24, 1] }}
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
                  </div>
                  <div className="absolute inset-y-0 right-0 w-[50vw] overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 right-0 flex flex-row-reverse"
                      initial={{ x: "100%" }}
                      animate={{ x: isClosing ? "0%" : "100%" }}
                      transition={{ duration, delay, ease: [0.76, 0, 0.24, 1] }}
                      style={{ width: `${width}vw` }}
                    >
                      <div
                        className="h-full w-[60%] shrink-0"
                        style={{ backgroundImage: "linear-gradient(270deg, #20e7ed 0%, #0789f5 42%, #174ee8 100%)" }}
                      />
                      <div
                        className="h-full flex-1"
                        style={{ backgroundImage: "linear-gradient(270deg, #10093f 0%, #5424ed 48%, #174ee8 100%)" }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}

export function PixelTransitionShutter({
  phase,
  outward = false,
  slideInCorners = true,
}: {
  phase: "closing" | "opening"
  outward?: boolean
  slideInCorners?: boolean
}) {
  const isClosing = phase === "closing"

  return (
    <div aria-hidden="true" className="pointer-events-auto absolute inset-0 z-[25] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 1 : 0 }}
        transition={{ duration: isClosing ? 0.9 : 1.4, delay: isClosing ? 1.5 : 0.2 }}
        style={{
          backgroundImage:
            "linear-gradient(90deg, #20e7ed 0%, #0789f5 23%, #174ee8 34%, #5424ed 44%, #10093f 49%, #10093f 51%, #5424ed 56%, #174ee8 66%, #0789f5 77%, #20e7ed 100%)",
        }}
      />
      <CenterClosingStrips phase={phase} />
      <PixelStair corner="top-left" accent="#18ddec" shutterPhase={phase} outward={outward} slideInCorners={slideInCorners} />
      <PixelStair corner="top-right" accent="#18ddec" shutterPhase={phase} outward={outward} slideInCorners={slideInCorners} />
      <PixelStair corner="bottom-left" accent="#18ddec" shutterPhase={phase} outward={outward} slideInCorners={slideInCorners} />
      <PixelStair corner="bottom-right" accent="#18ddec" shutterPhase={phase} outward={outward} slideInCorners={slideInCorners} />
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

function RollingDigit({ digit, delay }: { digit: string; delay: number }) {
  const isNumber = !isNaN(Number(digit))
  if (!isNumber) {
    return <span>{digit}</span>
  }

  const num = Number(digit)
  const repetitions = 3 // Spin through 0-9 three times
  const digits = Array.from({ length: 10 * repetitions }, (_, i) => i % 10)
  const totalCount = digits.length
  const targetIndex = 10 * (repetitions - 1) + num // settle on the last repetition
  const targetY = -(targetIndex * (100 / totalCount))

  return (
    <span className="relative inline-block h-[1.1em] overflow-hidden leading-[1.1] align-bottom">
      <motion.span
        className="absolute left-0 top-0 flex flex-col w-full text-center"
        initial={{ y: 0 }}
        animate={{ y: `${targetY}%` }}
        transition={{
          type: "spring",
          stiffness: 45,
          damping: 14,
          mass: 1.1,
          delay: delay,
        }}
      >
        {digits.map((val, idx) => (
          <span key={idx} className="flex h-[1.1em] items-center justify-center">
            {val}
          </span>
        ))}
      </motion.span>
      {/* Invisible digit to preserve space */}
      <span style={{ visibility: "hidden" }} className="pointer-events-none select-none">{digit}</span>
    </span>
  )
}

function RollingDigits({ value, delay = 1.88 }: { value: string; delay?: number }) {
  return (
    <span className="inline-flex items-end justify-center">
      {value.split("").map((char, i) => (
        <RollingDigit key={i} digit={char} delay={delay + i * 0.08} />
      ))}
    </span>
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
  return (
    <Shell>
      <PixelFrame accent={accent} bg={bg} />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-5 py-14 text-center md:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.72, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 16, delay: 1.38 }}
          className="relative flex w-full max-w-[42rem] flex-col items-center justify-center px-7 py-9 md:px-10"
        >
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 0.92, y: 0 }}
            transition={{ ...SPRING, delay: 1.72 }}
            className="relative z-10 font-display text-[clamp(1rem,4.7vw,1.72rem)] font-black leading-none tracking-normal md:text-[1.9rem]"
            style={{ color: ink }}
          >
            {kicker}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.82 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...SPRING, delay: 1.88 }}
            className="relative z-10 my-1 font-display text-[clamp(4.2rem,21vw,8rem)] font-black leading-[0.78] tracking-normal tabular-nums md:text-[9rem]"
            style={{ color: ink }}
          >
            <RollingDigits value={fmt(value)} delay={1.88} />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...SPRING, delay: 2.1 }}
            className="relative z-10 font-display text-[clamp(1.15rem,5vw,2rem)] font-black uppercase leading-[0.95] tracking-normal md:text-[2.35rem]"
            style={{ color: ink }}
          >
            {label}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 0.82, y: 0 }}
            transition={{ ...SPRING, delay: 2.32 }}
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
  kicker,
  title,
  subtitle,
}: {
  photo?: string
  kicker: string
  title: string
  subtitle: string
}) {
  const ink = "var(--wr-ink)"

  return (
    <Shell>
      <PixelFrame accent="#18ddec" bg="var(--wr-yellow)" outward />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 pb-16 pt-20 text-center sm:px-10 md:pb-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.86 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 125, damping: 17, delay: 1.38 }}
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
          transition={{ ...SPRING, delay: 1.7 }}
          className="mt-6 max-w-[34rem] font-display text-[clamp(1.15rem,4.4vw,2.25rem)] font-black leading-[1.02] tracking-tight text-balance"
          style={{ color: ink }}
        >
          {kicker} <br /> {title}
          <span className="block mt-2 opacity-80 text-[clamp(1rem,3vw,1.5rem)]">{subtitle}</span>
        </motion.h2>

        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 md:bottom-9">
          <WrapFooter ink={ink} hashtag={HASHTAG} />
        </div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* SLIDE 4 — WRAPSY WRAPPED GLOBAL ARTISTS                           */
/* ================================================================== */

function WrapsyMark() {
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

function GlobalArtists({ title = "Most Streamed\nArtists Globally", items }: { title?: string; items: string[] }) {
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
              <WrapsyMark />
              <span className="text-[5.1cqw] font-black leading-none tracking-normal">Wrapsy</span>
            </div>
            <span className="text-[3.55cqw] font-black uppercase leading-none tracking-normal">#WRAPSYWRAPPED</span>
          </motion.header>

          <motion.main
            initial={{ opacity: 0, y: "4.6cqw" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.32 }}
            className="relative z-10 px-[5.2cqw] pt-[7.8cqw] font-display"
          >
            <h2 className="max-w-[72cqw] text-[7.55cqw] font-black leading-[1.01] tracking-normal text-[#050505]">
              {title.split('\n').map((line, i) => <span key={i} className="block">{line}</span>)}
            </h2>
            <ol className="mt-[4.2cqw] grid gap-[.3cqw] text-[4.05cqw] font-black leading-[1.08] tracking-normal">
              {items.map((item, index) => (
                <li key={item} className="grid grid-cols-[4.2cqw_1fr] items-baseline gap-[2cqw]">
                  <span>{index + 1}</span>
                  <span className="truncate max-w-[44cqw]">{item}</span>
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

function SmallWrapsyLogo() {
  return (
    <svg viewBox="0 0 42 42" aria-hidden="true" className="size-[7cqw] shrink-0">
      <circle cx="21" cy="21" r="20" fill="currentColor" />
      <path d="M10 17c8-2 17-1 23 2" fill="none" stroke="#95eab1" strokeLinecap="round" strokeWidth="3.3" />
      <path d="M12 23c6-1.5 13-.8 19 1.8" fill="none" stroke="#95eab1" strokeLinecap="round" strokeWidth="2.8" />
      <path d="M14 29c5-1 10-.5 15 1.5" fill="none" stroke="#95eab1" strokeLinecap="round" strokeWidth="2.3" />
    </svg>
  )
}

function TopArtistsList({
  title = "My Top Artists",
  items,
  photos,
  isExiting = false,
}: {
  title?: string
  items: string[]
  photos: string[]
  isExiting?: boolean
}) {
  const navy = "#20206f"

  return (
    <Shell>
      <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#95eab1]">
        <div className="relative h-full min-h-0 w-full overflow-hidden bg-[#95eab1] [container-type:size] sm:aspect-[263/465] sm:w-auto sm:max-w-full">
          <FlameStrip />

          <motion.h2
            initial={{ opacity: 0, y: "4cqw" }}
            animate={isExiting ? { opacity: 0, y: "-4cqw", transition: { duration: 0.3, delay: 0.35 } } : { opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.32 }}
            className="absolute inset-x-4 top-[19.5%] text-center font-display text-[clamp(1.25rem,7.2cqw,2.15rem)] font-black leading-none tracking-tight"
            style={{ color: navy }}
          >
            {title}
          </motion.h2>

          <ol className="absolute inset-x-[8.5%] top-[28.5%] flex flex-col gap-[1.35cqw]">
            {items.slice(0, 5).map((item, index) => (
              <motion.li
                key={`${item}-${index}`}
                animate={isExiting ? "exit" : "animate"}
                variants={{
                  initial: { opacity: 0, x: index % 2 === 0 ? "-13cqw" : "13cqw" },
                  animate: {
                    opacity: 1,
                    x: 0,
                    transition: { type: "spring", stiffness: 125, damping: 17, delay: 0.45 + index * 0.12 },
                  },
                  exit: {
                    opacity: 0,
                    x: index % 2 === 0 ? "-25cqw" : "25cqw",
                    transition: { duration: 0.25, ease: [0.32, 0, 0.67, 0], delay: (4 - index) * 0.08 },
                  },
                }}
                initial="initial"
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
                    alt={item}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </motion.div>
                <span className="min-w-0 overflow-hidden text-ellipsis font-display text-[clamp(0.72rem,4.15cqw,1.25rem)] font-black leading-[1.05] tracking-tight" style={{ color: "#07070d" }}>
                  {item}
                </span>
              </motion.li>
            ))}
          </ol>

          <motion.footer
            initial={{ opacity: 0, y: "4cqw" }}
            animate={isExiting ? { opacity: 0, y: "4cqw", transition: { duration: 0.25, delay: 0.1 } } : { opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 1.16 }}
            className="absolute inset-x-[7.5%] bottom-[3.6%] flex items-center justify-between font-display font-black"
            style={{ color: navy }}
          >
            <div className="flex items-center gap-[1.5cqw]">
              <SmallWrapsyLogo />
              <span className="text-[4.2cqw]">Wrapsy</span>
            </div>
            <span className="text-[3.15cqw] uppercase">wrapsy.com/wrapped</span>
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
  year,
  photo,
  list1Title,
  list1,
  list2Title,
  list2,
  bottomMetricLabel,
  bottomMetric,
  list3Title,
  list3,
}: {
  bg: string
  ink: string
  year: string
  photo?: string
  list1Title: string
  list1: string[]
  list2Title: string
  list2: string[]
  bottomMetricLabel: string
  bottomMetric: string
  list3Title: string
  list3: string[]
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(cardRef, { once: true })
  const red = "#ff3f31"
  const cream = "var(--wr-cream)"

  const rankedLine = (item: string, i: number) => (
    <p key={`${item}-${i}`} className="min-w-0 truncate font-sans text-[16px] font-bold leading-[1.3] tracking-tight" style={{ color: ink }}>
      {i + 1} {item}
    </p>
  )

  return (
    <Shell>
      <div className="absolute inset-0" style={{ backgroundColor: bg }} />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
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
          <div className="absolute -left-8 top-0 z-20 h-[21.5rem] select-none overflow-hidden font-display text-[9rem] font-black italic leading-[0.82] tracking-tighter md:h-[22.5rem] md:text-[10rem]" style={{ color: red }}>
            <span className="block [writing-mode:vertical-rl]">{year}</span>
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
            <div 
              className="absolute left-1/2 top-9 z-30 aspect-square w-[72%] max-w-[18.5rem] -translate-x-1/2 overflow-hidden shadow-[0_8px_0_rgba(0,0,0,0.04)] border-[3px]"
              style={{ borderColor: ink }}
            >
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
              className="grid grid-cols-2 gap-4"
            >
              <div className="min-w-0">
                <p className="mb-[0.2rem] font-sans text-[13px] opacity-80" style={{ color: ink }}>
                  {list1Title}
                </p>
                <div className="space-y-0">{list1.map(rankedLine)}</div>
              </div>
              <div className="min-w-0">
                <p className="mb-[0.2rem] font-sans text-[13px] opacity-80" style={{ color: ink }}>
                  {list2Title}
                </p>
                <div className="space-y-0">{list2.map(rankedLine)}</div>
              </div>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: SPRING } }}
              className="mt-6 grid grid-cols-2 items-start gap-4"
            >
              <div className="min-w-0">
                <p className="mb-[0.2rem] font-sans text-[13px] opacity-80" style={{ color: ink }}>
                  {bottomMetricLabel}
                </p>
                <p className="font-display text-[22px] font-black leading-[1.1] tracking-tight tabular-nums" style={{ color: ink }}>
                  {bottomMetric}
                </p>
              </div>
              <div className="min-w-0">
                <p className="mb-[0.2rem] font-sans text-[13px] opacity-80" style={{ color: ink }}>
                  {list3Title}
                </p>
                <div className="space-y-0">
                  {list3.slice(0, 2).map((item, i) => (
                    <p key={`${item}-${i}`} className="truncate font-display text-[22px] font-black leading-[1.1] tracking-tight" style={{ color: ink }}>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: SPRING } }}
              className="mt-8 flex items-center justify-between gap-4"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: ink }}>
                <svg viewBox="0 0 64 64" aria-hidden="true" className="size-5" fill="none">
                  <path d="M17 25.5c10.5-3.2 21.5-2.4 31.7 2.5" stroke={cream} strokeWidth="5.2" strokeLinecap="round" />
                  <path d="M19.8 33.1c8.6-2.3 17.1-1.7 25.5 2" stroke={cream} strokeWidth="4.3" strokeLinecap="round" />
                  <path d="M22.3 40.2c6.4-1.5 12.5-1.1 18.9 1.6" stroke={cream} strokeWidth="3.7" strokeLinecap="round" />
                </svg>
              </div>
              <p className="font-sans text-[12px] font-bold uppercase tracking-wide" style={{ color: ink }}>
                SPOTIFY.COM/WRAPPED
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* PENULTIMATE SLIDE — YOUR TOP GENRES                                */
/* ================================================================== */

const GENRE_WIDTHS = [68, 57, 77, 73, 68]

/* Decorative background grid of circles */
const GRID_CIRCLES = (() => {
  const circles = []
  let id = 0
  for (let r = 0; r < 5; r++) {
    const isShifted = r % 2 !== 0
    const cols = isShifted ? 3 : 4
    for (let c = 0; c < cols; c++) {
      const colFloat = isShifted ? c + 0.5 : c
      const isBlack = colFloat < 2
      circles.push({
        id: id++,
        right: `${4 + c * 15 + (isShifted ? 7.5 : 0)}cqmin`,
        bottom: `${18 + r * 11}cqmin`,
        color: isBlack ? "#202020" : "#f20d2f",
        isBlack,
        delay: 0.8 + (c + r) * 0.1,
      })
    }
  }
  return circles
})()

function GenreWrapsyMark() {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true" className="size-[8cqmin] text-[#202020]">
      <circle cx="22" cy="22" r="20" fill="currentColor" />
      <path d="M11 17c8-2.3 17-1.4 23 2" fill="none" stroke="#f2f4e7" strokeLinecap="round" strokeWidth="3.2" />
      <path d="M13 23c6.5-1.6 13.5-.9 19 1.7" fill="none" stroke="#f2f4e7" strokeLinecap="round" strokeWidth="2.7" />
      <path d="M15 29c5-1.1 10-.6 14 1.2" fill="none" stroke="#f2f4e7" strokeLinecap="round" strokeWidth="2.2" />
    </svg>
  )
}

function TopGenresSlide({
  title = "Your Top Genres",
  items,
  bg,
  ink,
}: {
  title?: string
  items: string[]
  bg: string
  ink: string
}) {
  return (
    <Shell>
      <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f2f4e7]">
        <div className="relative h-full min-h-0 w-full overflow-hidden border-x-[clamp(2px,.8cqmin,5px)] border-r-[#83f21c] border-l-[#202020] bg-[#f2f4e7] text-[#202020] [container-type:size]" style={{ perspective: "800px" }}>
          {/* Header — back arrow, wrapsy mark, speaker */}
          <motion.header
            initial={{ opacity: 0, y: "-8cqmin" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.08 }}
            className="absolute inset-x-[5%] top-[3.5%] z-20 flex items-center justify-between"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[6.5cqmin]" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m15 5-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <GenreWrapsyMark />
            <motion.svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-[7cqmin]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <path d="M5 10v4h3l4 4V6L8 10H5Z" strokeLinejoin="round" />
              <path d="M15 9c1.5 1.5 1.5 4.5 0 6M18 6c3 3 3 9 0 12" strokeLinecap="round" />
            </motion.svg>
          </motion.header>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: "4cqmin" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.24 }}
            className="absolute inset-x-0 top-[12%] text-center font-display text-[7.3cqmin] font-black tracking-tight"
          >
            {title}
          </motion.h2>

          {/* Background circles grid */}
          <div className="absolute inset-0 z-0">
            {GRID_CIRCLES.map((circle) => (
              <motion.div
                key={circle.id}
                className="absolute"
                style={{
                  right: circle.right,
                  bottom: circle.bottom,
                  width: "8cqmin",
                  height: "8cqmin",
                  transformStyle: "preserve-3d",
                }}
                initial={{ scale: 0, rotateY: -90 }}
                animate={{
                  scale: 1,
                  rotateY: circle.isBlack 
                    ? [0, 0, 180, 180, 360, 360] 
                    : [0, 180, 180, 360, 360],
                  y: [0, -4, 0],
                }}
                transition={{
                  scale: { type: "spring", stiffness: 180, damping: 12, delay: circle.delay },
                  rotateY: { 
                    duration: 6, 
                    repeat: Number.POSITIVE_INFINITY, 
                    ease: "easeInOut", 
                    times: circle.isBlack 
                      ? [0, 0.25, 0.35, 0.75, 0.85, 1] 
                      : [0, 0.1, 0.5, 0.6, 1],
                    delay: 1.5 + circle.delay * 0.2, // Small ripple
                  },
                  y: { duration: 2.6 + (circle.id % 4) * 0.35, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.0 },
                }}
              >
                {/* Front face (original color) */}
                <span 
                  className="absolute inset-0 rounded-full" 
                  style={{ backgroundColor: circle.color, backfaceVisibility: "hidden" }} 
                />
                {/* Back face (flipped color) */}
                <span 
                  className="absolute inset-0 rounded-full" 
                  style={{ backgroundColor: circle.isBlack ? "#f20d2f" : "#202020", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} 
                />
              </motion.div>
            ))}
          </div>

          {/* List — large text filling bars */}
          <ol className="absolute inset-x-[6%] top-[21%] bottom-[22%] z-10 flex flex-col justify-evenly">
            {items.slice(0, 5).map((item, index) => {
              // Dynamic font size: short names → huge, long names → smaller (like Wrapsy Wrapped)
              const len = item.length
              const fontSize = len <= 5 ? 14 : len <= 8 ? 11 : len <= 12 ? 9 : 7
              return (
                <motion.li
                  key={`${item}-${index}`}
                  initial={{ opacity: 0, x: "-24cqmin" }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 135, damping: 17, delay: 0.38 + index * 0.12 }}
                  className="relative flex items-center"
                >
                  <span className="w-[10cqmin] shrink-0 text-center font-display text-[5cqmin] font-black italic">{index + 1}</span>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.48, delay: 0.45 + index * 0.12, ease: [0.76, 0, 0.24, 1] }}
                    className="flex origin-left items-center bg-[#202020] px-[2.5cqmin] py-[1.5cqmin]"
                    style={{ minWidth: `${GENRE_WIDTHS[index]}cqmin`, width: "fit-content" }}
                  >
                    <motion.span
                      initial={{ opacity: 0, y: "3cqmin" }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.72 + index * 0.12 }}
                      className="font-display font-black italic leading-[0.92] tracking-tight text-[#f2f4e7]"
                      style={{ fontSize: `clamp(0.75rem, ${fontSize}cqmin, 4rem)` }}
                    >
                      {item}
                    </motion.span>
                  </motion.div>
                </motion.li>
              )
            })}
          </ol>

          {/* Wavy lines at bottom */}
          <svg aria-hidden="true" viewBox="0 0 180 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-[2%] h-[13%] w-full overflow-visible">
            <motion.path d="M-8 31C33 22 60 5 104 11c30 4 49 17 87 5" fill="none" stroke="#202020" strokeWidth="1.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 1, ease: "easeOut" }} />
            <motion.path d="M-10 37C28 29 53 14 91 15c38 1 57 14 101 3" fill="none" stroke="#202020" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.3, delay: 1.12, ease: "easeOut" }} />
          </svg>

          {/* Share button */}
          <motion.div
            initial={{ opacity: 0, y: "5cqmin", scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: [1, 1.04, 1] }}
            transition={{
              opacity: { duration: 0.3, delay: 1.15 },
              y: { type: "spring", stiffness: 140, damping: 16, delay: 1.1 },
              scale: { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.4 },
            }}
            className="absolute bottom-[8.5%] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#202020] px-[6cqmin] py-[2.1cqmin] font-sans text-[2.9cqmin] font-semibold text-white"
          >
            Share this story
          </motion.div>
        </div>
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

function FinaleCard({
  meta,
  data,
  stats,
  ai,
  palette,
  title = "Your wrapped",
  minutesLabel = "min lived",
  topPercentLabel = "main character"
}: {
  meta: any
  data: WrapData
  stats: WrapStats
  ai: AiWrapContent
  palette: BurstPalette
  title?: string
  minutesLabel?: string
  topPercentLabel?: string
}) {
  const { reset } = useWrap()
  const exportRef = useRef<HTMLDivElement>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  function openShareModal() {
    setIsShareModalOpen(true)
  }

  async function generateImageBlob() {
    if (!exportRef.current) return null
    try {
      setIsExporting(true)
      // High quality export specifically for social media
      const dataUrl = await htmlToImage.toJpeg(exportRef.current, { quality: 0.95, pixelRatio: 2 })
      const res = await fetch(dataUrl)
      return await res.blob()
    } catch (err) {
      console.error("Image generation failed", err)
      return null
    } finally {
      setIsExporting(false)
    }
  }

  async function handleShareIgStory() {
    const blob = await generateImageBlob()
    if (!blob) {
      alert("Failed to generate image.")
      return
    }
    const file = new File([blob], "story-wrapped.jpg", { type: "image/jpeg" })
    
    // Web Share API with files triggers Instagram Stories automatically on iOS/Android
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file]
        })
      } catch (e) {
        console.error(e)
      }
    } else {
      alert("Direct Instagram sharing isn't supported on this device. Downloading image instead!")
      handleDownload()
    }
  }

  async function handleDownload() {
    const blob = await generateImageBlob()
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `wrapsy-${data.slug || "export"}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleCopyLink() {
    const shareUrl = data.slug ? `${window.location.origin}/wrap/${data.slug}` : window.location.origin
    navigator.clipboard.writeText(shareUrl)
    alert("Link copied!")
  }

  function handleNativeShare() {
    const shareUrl = data.slug ? `${window.location.origin}/wrap/${data.slug}` : window.location.origin
    if (navigator.share) {
      navigator.share({
        title: "My Story Wrapped",
        text: ai.finale?.tagline || "My story wrapped.",
        url: shareUrl
      }).catch(console.error)
    } else {
      handleCopyLink()
    }
  }

  return (
    <Shell>
      {/* moving typography wall */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-6 z-0">
        <MarqueeRow text={HASHTAG} ink="var(--wr-yellow)" duration={22} />
        <MarqueeRow text={HASHTAG} ink="var(--wr-yellow)" duration={16} reverse outline />
        <MarqueeRow text={HASHTAG} ink="var(--wr-yellow)" duration={28} />
        <MarqueeRow text={HASHTAG} ink="var(--wr-yellow)" duration={19} reverse outline />
      </div>
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50, rotate: 3, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5, scale: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          className="relative z-[30] w-full max-w-xs"
        >
          <div className="rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border-2 border-white/10 bg-ink">
            <WrapCard wrap={{
              name: data.name,
              purpose: data.purpose || "life",
              slug: data.slug || "draft",
              photos: data.photos.map(p => p.url),
              userNames: data.userNames,
              personalityImageUrl: null
            }} />
          </div>
        </motion.div>

        {/* Lead Gen / CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="z-[30] flex flex-col items-center mt-2 w-full max-w-sm"
        >
          <div className="bg-ink/60 backdrop-blur-md border border-white/10 rounded-3xl p-5 w-full flex flex-col items-center text-center shadow-2xl">
            <p className="text-white font-display uppercase tracking-widest text-[10px] opacity-70 mb-1">
              Want your own story wrapped?
            </p>
            <p className="text-green font-display uppercase tracking-tight text-xl font-black leading-none mb-4 drop-shadow-[0_0_10px_rgba(30,215,96,0.3)]">
              Get yours free at Wrapsy.com
            </p>
            
            <div className="flex flex-row items-center justify-center gap-3 w-full">
              <motion.button
                type="button"
                onClick={openShareModal}
                disabled={isExporting}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                whileHover={{ scale: 1.08, y: -4, rotate: -2 }}
                whileTap={{ scale: 0.96 }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-green px-6 py-3.5 font-display text-sm font-black uppercase tracking-wide text-ink shadow-[0_0_20px_rgba(30,215,96,0.4)] disabled:opacity-50"
              >
                <Share2 className="size-4" />
                {isExporting ? "Generating..." : "Share Wrap"}
              </motion.button>
              
              <motion.button
                type="button"
                onClick={reset}
                whileHover={{ rotate: -180 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="flex size-12 items-center justify-center rounded-full border-2 border-white/10 bg-white/5 text-white backdrop-blur-md hover:bg-white hover:text-ink"
                aria-label="Start over"
              >
                <RotateCcw className="size-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onDownload={handleDownload}
        onShareIgStory={handleShareIgStory}
        onCopyLink={handleCopyLink}
        onNativeShare={handleNativeShare}
      />

      {/* Off-screen Export Container for html-to-image (9:16 IG Story aspect ratio) */}
      <div 
        ref={exportRef}
        className="pointer-events-none"
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: "1080px",
          height: "1920px",
          backgroundColor: meta.color || "var(--wr-purple)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: -1,
        }}
      >
        <div style={{ width: "860px" }} className="rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border-4 border-white/20 bg-ink">
          <WrapCard wrap={{
            name: data.name,
            purpose: data.purpose || "life",
            slug: data.slug || "draft",
            photos: data.photos.map(p => p.url),
            userNames: data.userNames,
            personalityImageUrl: null
          }} />
        </div>
        
        {/* Export Footer Logo */}
        <div style={{ marginTop: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <p style={{ color: "white", fontSize: "32px", fontFamily: "var(--font-display), sans-serif", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.8 }}>
            Get yours at Wrapsy.com
          </p>
        </div>
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

export function buildPages(
  data: WrapData,
  ai: AiWrapContent,
  generatedImageUrl?: string | null,
  isReverseExiting?: boolean
): WrapPage[] {
  const stats = buildStats(data)
  const purpose = data.purpose ?? "life"
  const photos = data.photos.map((p) => p?.url || "")
  const photo1 = photos[0] || "/wrapped-portrait-1.png"
  const photo2 = photos[1] || photo1
  const photo3 = photos[2] || photo1
  const photo4 = photos[3] || photo1
  const photo5 = photos[4] || photo1
  const meta = PURPOSES.find((p) => p.id === (data.purpose ?? "life"))!
  const palette = PALETTES["var(--wr-yellow)"]

  // SLIDE 1: INTRO
  const introKicker = ai.intro.kicker
  const introLines = ai.intro.lines
  const introSub = ai.intro.sub

  // SLIDE 2: DATA HIGHLIGHT
  const big = bigMetric(data, stats, ai)
  const dataKicker = ai.dataHighlight.kicker
  const dataLabel = big.label
  const dataNote = big.note

  // SLIDE 3: HIGHLIGHT
  const highlightTitle = (ai as any).highlightCard?.title || (ai as any).topTrack?.title || "Your Anthem"
  const highlightKicker = (ai as any).highlightCard?.kicker || (ai as any).topTrack?.kicker || "Highlight"
  const highlightSubtitle = (ai as any).highlightCard?.subtitle || (ai as any).topTrack?.artistLine || "An Artist"

  // SLIDE 7: DASHBOARD
  const dashboardList1 = (ai as any).summaryDashboard?.list1 || (ai as any).dashboard?.topArtists || ["The Beatles", "George Harrison", "Cigarettes After Sex", "Queen", "John Lennon"]
  const topArtists = dashboardList1
  const dashboardList2 = ((ai as any).summaryDashboard?.list2 || (ai as any).dashboard?.topSongs || ["Song 1", "Song 2", "Song 3", "Song 4", "Song 5"]).slice(0, 5)
  const dashboardList3 = (ai as any).summaryDashboard?.list3 || (ai as any).dashboard?.topGenres || ["K-Pop", "R&B", "Experimental Hip Hop", "Techno", "Hyperpop"]

  // Fallbacks for newly added AI fields (to handle old cached sessions)
  const globalArtists = (ai as any).topList || (ai as any).globalArtists || ["Bad Bunny", "Taylor Swift", "BTS", "Drake", "Justin Bieber"]
  const artistStats = (ai as any).statProfile || (ai as any).artistStats || {
    name: dashboardList1[0] || "Main Character",
    stat1Label: "Streams", stat1Value: String(stats.int(50, 400) + stats.int(0, 9) / 10),
    stat2Label: "Hours", stat2Value: String(stats.int(5, 50) + stats.int(0, 9) / 10),
    stat3Label: "Listeners", stat3Value: String(stats.int(10, 100) + stats.int(0, 9) / 10),
    stat4Label: "Countries", stat4Value: String(stats.int(30, 100))
  }
  const worldCitizen = (ai as any).globalFootprint || (ai as any).worldCitizen || {
    locationsCount: stats.int(24, 58),
    locations: [
      { name: "Avicii", location: "Sweden" },
      { name: "BTS", location: "South Korea" },
      { name: "Shakira", location: "Colombia" },
      { name: "Adele", location: "United Kingdom" },
      { name: "Stromae", location: "Belgium" },
      { name: "Bad Bunny", location: "Puerto Rico" },
    ]
  }
  const bottomMetric = (ai as any).summaryDashboard?.bottomMetric || (ai as any).dashboard?.minutesListened || fmt(stats.int(40000, 90000))
  const finaleTitle = ai.finale?.title || "Your wrapped"
  const finaleMinutesLabel = (ai as any).finale?.metricLabel || (ai as any).finale?.minutesLabel || "min lived"
  const finaleTopPercentLabel = ai.finale?.topPercentLabel || "main character"
  const shareTitle = ai.share?.title || "Share your\nWrapsy Wrapped"
  const shareHashtag = ai.share?.hashtag || "#WrapsyWrapped"
  const globalArtistsTitle = (ai as any).topListTitle || (ai as any).globalArtistsTitle || "Most Streamed\nArtists Globally"
  const list1Title = (ai as any).summaryDashboard?.list1Title || (ai as any).dashboard?.topArtistsTitle || "My Top Highlights"
  const list3Title = (ai as any).summaryDashboard?.list3Title || (ai as any).dashboard?.topGenresTitle || "Your Top Moments"

  const personalityTitle = (ai as any).personalityCard?.title || "Mastermind"
  const personalityDescription = (ai as any).personalityCard?.description || "You play the long game. You see everything."
  const personalityImagePrompt = (ai as any).personalityCard?.imagePrompt || ""

  const allPages = [
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
          photo={photo1}
          songTitle={highlightTitle}
          songArtist={highlightSubtitle}
          songStat={`${fmt(stats.int(100000, 5000000))} moments in ${data.destinationCity || "NYC"}`}
        />
      ),
    },
    {
      key: "s2-share",
      bg: "#101010",
      node: <ShareWrappedSlide title={shareTitle} hashtag={shareHashtag} />,
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
          photo={photo2}
          kicker={highlightKicker}
          title={highlightTitle}
          subtitle={highlightSubtitle}
        />
      ),
    },
    {
      key: "s4-global-artists",
      bg: "#f8cdd6",
      node: <GlobalArtists title={globalArtistsTitle} items={globalArtists} />,
    },
    {
      key: "s5-top-artists",
      bg: "#95eab1",
      node: <TopArtistsList title={list1Title} items={dashboardList1} photos={photos} isExiting={isReverseExiting} />,
    },
    {
      key: "s3-artist-stats",
      bg: "#E9148C",
      node: (
        <ArtistStatsCard
          artistName={artistStats.name}
          photoUrl={photo3}
          stat1Label={artistStats.stat1Label}
          stat1Value={artistStats.stat1Value}
          stat2Label={artistStats.stat2Label}
          stat2Value={artistStats.stat2Value}
          stat3Label={artistStats.stat3Label}
          stat3Value={artistStats.stat3Value}
          stat4Label={artistStats.stat4Label}
          stat4Value={artistStats.stat4Value}
        />
      ),
    },
    {
      key: "s-world-citizen",
      bg: "#2D8C7E",
      node: (
        <WorldCitizen
          title={ai.globalFootprint?.title || (ai as any).worldCitizen?.title || "World Citizen"}
          description1={ai.globalFootprint?.description1 || (ai as any).worldCitizen?.description1 || "When it comes to your music, borders disappear."}
          description2={ai.globalFootprint?.description2 || (ai as any).worldCitizen?.description2 || "You've listened to artists from {count} countries."}
          countriesCount={worldCitizen.locationsCount}
          locations={worldCitizen.locations}
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
          year="2026"
          photo={photo5}
          list1Title={list1Title}
          list1={dashboardList1}
          list2Title={(ai as any).summaryDashboard?.list2Title || "My Top Songs"}
          list2={dashboardList2}
          bottomMetricLabel={(ai as any).summaryDashboard?.bottomMetricLabel || "Minutes Listened"}
          bottomMetric={bottomMetric}
          list3Title={list3Title}
          list3={dashboardList3}
        />
      ),
    },
    {
      key: "s-top-genres",
      bg: "#f2f4e7",
      node: (
        <TopGenresSlide
          title={list3Title}
          items={dashboardList3}
          bg="#f2f4e7"
          ink="#202020"
        />
      ),
    },
    {
      key: "s-wrapped-2023",
      bg: "#FA5738",
      node: (
        <Wrapped2023Slide
          year="2026"
          title={ai.finale?.tagline || "Your Wrapped is here"}
          subtitle="Ready to reveal the soundtrack of your year?"
        />
      ),
    },
    {
      key: "s-personality-card",
      bg: "#050505",
      node: (
        <PersonalityCardSlide
          title={personalityTitle}
          description={personalityDescription}
          imageUrl={generatedImageUrl}
        />
      ),
    },
    {
      key: "s8",
      bg: "var(--wr-purple)",
      node: (
        <FinaleCard
          meta={meta}
          data={data}
          stats={stats}
          ai={ai}
          palette={palette}
          title={finaleTitle}
          minutesLabel={finaleMinutesLabel}
          topPercentLabel={finaleTopPercentLabel}
        />
      ),
    },
  ]

  if (data.isBasicPlan) {
    return allPages.slice(0, Math.ceil(allPages.length / 2))
  }

  return allPages
}
