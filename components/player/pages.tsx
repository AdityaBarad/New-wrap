"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useInView } from "framer-motion"
import { RotateCcw, Share2 } from "lucide-react"
import { Burst, Halftone, WrapFooter, type BurstPalette } from "@/components/player/burst"
import { BgPatternLayer, DecorationLayer } from "@/components/player/slide-effects"
import { c, typoClass, typoOutlineStyle, getDesign } from "@/lib/design-utils"
import type { SlideDesign, SlideData } from "@/lib/ai-types"
import { useWrap, type WrapData } from "@/context/wrap-context"
import { PURPOSES } from "@/context/wrap-context"
import { buildStats, fmt, type WrapStats } from "@/lib/wrap-stats"
import type { AiWrapContent } from "@/lib/ai-types"
import { ThreadSlide, RadarSlide, QuoteSlide, RoastSlide, AwardSlide, PolaroidSlide } from "@/components/player/new-slides"

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

export function Kicker({ children, ink, delay = 0.1 }: { children: ReactNode; ink: string; delay?: number }) {
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
  design,
  kicker,
  lines,
  sub,
  photo,
}: {
  design: SlideDesign
  kicker: string
  lines: string[]
  sub: string
  photo?: string
}) {
  const bg = c(design.bg)
  const ink = c(design.ink)
  const accent = c(design.accent)
  const palette = PALETTES[bg] ?? PALETTES["var(--wr-green)"]

  const isCentered = design.layout === "centered"
  const isStacked = design.layout === "stacked"
  const isRight = design.layout === "split-right"

  const textCol = (
    <div className={`flex h-full flex-col justify-center gap-5 ${isCentered ? "items-center text-center" : ""}`}>
      <Kicker ink={ink}>{kicker}</Kicker>
      <ClipHeading lines={lines} ink={ink} delay={0.2} className={typoClass(design.typoStyle)} />
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.6 }}
        className="max-w-md font-sans text-base font-semibold leading-relaxed md:text-lg"
        style={{ color: ink }}
      >
        {sub}
      </motion.p>
      <div className="mt-2">
        <WrapFooter ink={ink} hashtag={HASHTAG} />
      </div>
    </div>
  )

  const visualCol = (
    <div className="flex items-center justify-center">
      <Burst photo={photo} palette={palette} className="w-[74vw] max-w-[26rem] md:w-full" />
    </div>
  )

  return (
    <Shell>
      <BgPatternLayer pattern={design.bgPattern} ink={ink} dark={bg !== "var(--wr-ink)"} />
      <DecorationLayer style={design.decoration} colors={[accent, ink]} ink={ink} />
      <div className={`relative h-full w-full px-6 py-10 md:px-14 ${
        isCentered 
          ? "flex flex-col items-center justify-center gap-8" 
          : isStacked
            ? "flex flex-col justify-between"
            : "grid grid-cols-1 items-center gap-6 md:grid-cols-2"
      }`}>
        {isRight ? <>{visualCol}{textCol}</> : <>{textCol}{visualCol}</>}
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* SLIDE 2 — DATA HIGHLIGHT (kinetic grid + count up)                 */
/* ================================================================== */

function DataHighlight({
  design,
  kicker,
  value,
  label,
  note,
}: {
  design: SlideDesign
  kicker: string
  value: number
  label: string
  note: string
}) {
  const count = useCountUp(value, 1500)
  const bg = c(design.bg)
  const ink = c(design.ink)
  const accent = c(design.accent)

  const isSplit = design.layout === "split-left" || design.layout === "split-right"

  return (
    <Shell>
      <BgPatternLayer pattern={design.bgPattern} ink={ink} dark={bg !== "var(--wr-ink)"} />
      <DecorationLayer style={design.decoration} colors={[accent, ink]} ink={ink} />

      <div className={`relative flex h-full w-full px-6 ${
        isSplit ? "flex-row items-center gap-8" : "flex-col items-center justify-center text-center"
      }`}>
        <div className={isSplit ? "flex-1" : ""}>
          <Kicker ink={ink}>{kicker}</Kicker>
          <p
            className={`my-1 font-display font-black leading-[0.8] tracking-tighter tabular-nums ${isSplit ? "text-[15vw] md:text-[8rem]" : "text-[26vw] md:text-[15rem]"}`}
            style={{ color: ink, ...typoOutlineStyle(design.typoStyle, ink) }}
          >
            {fmt(count)}
          </p>
        </div>
        <div className={isSplit ? "flex-1" : ""}>
          <motion.p
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.9 }}
            className={typoClass(design.typoStyle !== "massive" ? design.typoStyle : "elegant")}
            style={{ color: ink }}
          >
            {label}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 14, delay: 1.15 }}
            className="mt-4 max-w-md font-sans text-base font-semibold leading-relaxed"
            style={{ color: ink, opacity: 0.85 }}
          >
            {note}
          </motion.p>
        </div>
        <div className={`absolute bottom-8 ${isSplit ? "left-6" : "left-1/2 -translate-x-1/2 md:left-14 md:translate-x-0"}`}>
          <WrapFooter ink={ink} hashtag={HASHTAG} />
        </div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* SLIDE 3 — TOP TRACK (typography wall + spinning vinyl)             */
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
  design,
  kicker,
  title,
  artist,
  photo,
}: {
  design: SlideDesign
  kicker: string
  title: string
  artist: string
  photo?: string
}) {
  const bg = c(design.bg)
  const ink = c(design.ink)
  const accent = c(design.accent)
  
  const isCentered = design.layout === "centered"
  const isRight = design.layout === "split-right"
  
  const textCol = (
    <div className={`flex flex-col justify-center gap-3 ${isCentered ? "items-center text-center" : ""}`}>
      <Kicker ink={ink}>{kicker}</Kicker>
      <motion.h2
        initial={{ opacity: 0, scale: 2.2, rotate: -4 }}
        animate={{ opacity: 1, scale: 1, rotate: design.typoStyle === "rotated" ? -2 : 0 }}
        transition={{ type: "spring", stiffness: 170, damping: 15, delay: 0.1 }}
        className={typoClass(design.typoStyle)}
        style={{ color: ink, ...typoOutlineStyle(design.typoStyle, ink) }}
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.5 }}
        className="font-display text-lg font-black uppercase tracking-widest"
        style={{ color: accent }}
      >
        {artist}
      </motion.p>
    </div>
  )
  
  const visualCol = (
    <motion.div
      initial={{ opacity: 0, x: isRight ? -80 : 80, rotate: 8 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.35 }}
      className="flex items-center justify-center"
    >
      <div
        className="relative w-[60vw] max-w-[18rem] border-4 p-4 md:w-full"
        style={{ borderColor: ink, backgroundColor: bg }}
      >
        <motion.div
          className="relative mx-auto aspect-square w-full overflow-hidden rounded-full border-4"
          style={{ borderColor: accent }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <img
            src={photo || "/wrapped-portrait-1.png"}
            alt="Now playing artwork"
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
          <span
            className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
            style={{ backgroundColor: ink, borderColor: accent }}
          />
        </motion.div>
        <p className="mt-3 text-center font-display text-xs font-black uppercase tracking-widest" style={{ color: ink }}>
          On Repeat
        </p>
      </div>
    </motion.div>
  )

  return (
    <Shell>
      <BgPatternLayer pattern={design.bgPattern} ink={ink} dark={bg !== "var(--wr-ink)"} />
      <DecorationLayer style={design.decoration} colors={[accent, ink]} ink={ink} />

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-6">
        <MarqueeRow text={HASHTAG} ink={ink} duration={22} />
        <MarqueeRow text={HASHTAG} ink={ink} duration={16} reverse outline />
        <MarqueeRow text={HASHTAG} ink={ink} duration={28} />
        <MarqueeRow text={HASHTAG} ink={ink} duration={19} reverse outline />
      </div>

      <div className={`relative h-full w-full px-6 py-10 md:px-14 ${
        isCentered 
          ? "flex flex-col items-center justify-center gap-12" 
          : "grid grid-cols-1 items-center gap-8 md:grid-cols-2"
      }`}>
        {isRight ? <>{visualCol}{textCol}</> : <>{textCol}{visualCol}</>}
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* SLIDE 4 — THE RECEIPTS (staggered leaderboard)                     */
/* ================================================================== */

function Receipts({
  design,
  kicker,
  title,
  rows,
}: {
  design: SlideDesign
  kicker: string
  title: string
  rows: { label: string; value: string; pct: number }[]
}) {
  const bg = c(design.bg)
  const ink = c(design.ink)
  const accent = c(design.accent)
  const isCentered = design.layout === "centered"
  
  return (
    <Shell>
      <BgPatternLayer pattern={design.bgPattern} ink={ink} dark={bg !== "var(--wr-ink)"} />
      <DecorationLayer style={design.decoration} colors={[accent, ink]} ink={ink} />
      <div className={`relative flex h-full w-full flex-col justify-center gap-5 px-6 md:px-14 ${isCentered ? "items-center text-center" : ""}`}>
        <Kicker ink={ink}>{kicker}</Kicker>
        <ClipHeading
          lines={[title]}
          ink={ink}
          delay={0.15}
          className={typoClass(design.typoStyle)}
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
                hidden: { opacity: 0, x: isCentered ? 0 : -40, y: isCentered ? 20 : 0 },
                show: { opacity: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
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
                  transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.5 + i * 0.14 }}
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
  design,
  kicker,
  left,
  right,
  leagueTitle,
  photo,
}: {
  design: SlideDesign
  kicker: string
  left: string
  right: string
  leagueTitle: string
  photo?: string
}) {
  const bg = c(design.bg)
  const ink = c(design.ink)
  const accent = c(design.accent)
  
  return (
    <Shell>
      <BgPatternLayer pattern={design.bgPattern} ink={ink} dark={bg !== "var(--wr-ink)"} />
      <DecorationLayer style={design.decoration} colors={[accent, ink]} ink={ink} />
      <div className="relative flex h-full w-full flex-col justify-center gap-6 px-6 py-10 md:px-14">
        <Kicker ink={ink}>{kicker}</Kicker>

        <div className="relative flex items-center justify-center gap-3 md:gap-6">
          <motion.span
            initial={{ x: "-120%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.15 }}
            className={`flex-1 text-right ${typoClass(design.typoStyle)}`}
            style={{ color: ink, ...typoOutlineStyle(design.typoStyle, ink) }}
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
            className={`flex-1 text-left ${typoClass(design.typoStyle)}`}
            style={{ color: ink, ...typoOutlineStyle(design.typoStyle, ink) }}
          >
            {right}
          </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.7 }}
          className="mx-auto aspect-[16/7] w-full max-w-2xl overflow-hidden"
          style={{ clipPath: SLANT_CLIP, backgroundColor: ink }}
        >
          {photo && (
            <motion.img
              src={photo}
              alt="Most watched moment"
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.7 }}
            />
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.95 }}
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
  design,
  kicker,
  title,
  games,
}: {
  design: SlideDesign
  kicker: string
  title: string
  games: { rank: number; team1: string; team2: string; competition: string }[]
}) {
  const bg = c(design.bg)
  const ink = c(design.ink)
  const accent = c(design.accent)
  const isCentered = design.layout === "centered"

  return (
    <Shell>
      <BgPatternLayer pattern={design.bgPattern} ink={ink} dark={bg !== "var(--wr-ink)"} />
      <DecorationLayer style={design.decoration} colors={[accent, ink]} ink={ink} />
      <div className={`relative flex h-full w-full flex-col justify-center gap-4 px-6 py-10 md:px-14 ${isCentered ? "items-center text-center" : ""}`}>
        <Kicker ink={ink}>{kicker}</Kicker>
        <ClipHeading
          lines={[title]}
          ink={ink}
          delay={0.15}
          className={typoClass(design.typoStyle)}
        />
        <div className="mt-2 flex max-w-3xl flex-col gap-3.5 w-full">
          {games.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.25 + i * 0.12 }}
              whileHover={{ scale: 1.02 }}
              className={`grid items-center gap-4 border-b-[3px] pb-3.5 ${isCentered ? "grid-cols-[1fr_auto_1fr]" : "grid-cols-[auto_1fr]"}`}
              style={{ borderColor: ink }}
            >
              {!isCentered && (
                <span className="font-display text-4xl font-black leading-none md:text-6xl" style={{ color: accent }}>
                  {g.rank}
                </span>
              )}
              {isCentered && (
                <motion.span
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.35 + i * 0.12 }}
                  className="font-display text-xl font-black uppercase md:text-3xl justify-self-end text-right"
                  style={{ color: ink }}
                >
                  {g.team1}
                </motion.span>
              )}
              {isCentered && (
                <div className="flex flex-col items-center justify-center">
                  <span className="font-display text-sm font-black uppercase opacity-50" style={{ color: ink }}>
                    vs
                  </span>
                </div>
              )}
              {isCentered && (
                <div className="flex flex-col gap-0.5 justify-self-start text-left">
                  <motion.span
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.35 + i * 0.12 }}
                    className="font-display text-xl font-black uppercase md:text-3xl"
                    style={{ color: ink }}
                  >
                    {g.team2}
                  </motion.span>
                  <span
                    className="font-display text-[0.68rem] font-bold uppercase tracking-widest md:text-xs"
                    style={{ color: ink, opacity: 0.6 }}
                  >
                    {g.competition}
                  </span>
                </div>
              )}

              {!isCentered && (
                <div className="flex flex-col gap-0.5">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <motion.span
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.35 + i * 0.12 }}
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
                      transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.35 + i * 0.12 }}
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
              )}
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
  design,
  year,
  photo,
  topArtists,
  topSongs,
  minutesListened,
  topGenre,
}: {
  design: SlideDesign
  year: string
  photo?: string
  topArtists: string[]
  topSongs: string[]
  minutesListened: string
  topGenre: string
}) {
  const bg = c(design.bg)
  const ink = c(design.ink)
  const accent = c(design.accent)
  
  const cardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(cardRef, { once: true })
  return (
    <Shell>
      <BgPatternLayer pattern={design.bgPattern} ink={ink} dark={bg !== "var(--wr-ink)"} />
      <DecorationLayer style={design.decoration} colors={[accent, ink]} ink={ink} />
      <div className="relative flex h-full w-full items-center justify-center px-4 py-6 md:px-8">
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: -40, scaleY: 0.2 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          style={{ transformOrigin: "top", backgroundColor: "var(--wr-cream)" }}
          className="relative w-full max-w-sm overflow-hidden border-4 shadow-2xl"
        >
          <div
            className="h-3 w-full"
            style={{ background: `repeating-linear-gradient(90deg, ${ink}, ${ink} 20px, transparent 20px, transparent 40px)` }}
          />
          <div className="flex items-center justify-between px-6 pt-5">
            <p className="font-display text-xs font-black uppercase tracking-widest" style={{ color: ink, opacity: 0.6 }}>
              The Lineup
            </p>
            <span className="font-display text-3xl font-black leading-none" style={{ color: ink }}>
              {year}
            </span>
          </div>

          <div className="mx-6 my-4 aspect-square overflow-hidden border-4" style={{ borderColor: ink }}>
            <img
              src={photo || "/wrapped-portrait-1.png"}
              alt="Wrapped headliner"
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
          </div>

          <motion.div
            className="space-y-4 px-6 pb-2"
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } } }}
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } } }}
              className="grid grid-cols-2 gap-6 border-b-[3px] pb-4"
              style={{ borderColor: ink }}
            >
              <div className="flex flex-col gap-2">
                <p className="font-display text-xs font-black uppercase tracking-wider" style={{ color: ink }}>
                  Top Artists
                </p>
                {topArtists.slice(0, 3).map((a, i) => (
                  <p key={i} className="font-display text-sm font-bold leading-tight" style={{ color: ink }}>
                    {i + 1} {a}
                  </p>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-display text-xs font-black uppercase tracking-wider" style={{ color: ink }}>
                  Top Songs
                </p>
                {topSongs.slice(0, 3).map((s, i) => (
                  <p key={i} className="font-display text-sm font-bold leading-tight" style={{ color: ink }}>
                    {i + 1} {s}
                  </p>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } } }}
              className="flex items-center justify-between"
            >
              <p className="font-display text-xs font-black uppercase tracking-wider" style={{ color: ink }}>
                Minutes Listened
              </p>
              <p className="font-display text-lg font-black tabular-nums" style={{ color: ink }}>
                {minutesListened}
              </p>
            </motion.div>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } } }}
              className="flex items-center justify-between border-t-2 pt-3"
              style={{ borderColor: ink }}
            >
              <p className="font-display text-xs font-black uppercase tracking-wider" style={{ color: ink }}>
                Top Genre
              </p>
              <p className="font-display text-sm font-black" style={{ color: ink }}>
                {topGenre}
              </p>
            </motion.div>
          </motion.div>

          <div className="mt-3 border-t-2 px-6 py-3 text-center" style={{ borderColor: ink }}>
            <p className="font-display text-xs font-black uppercase tracking-widest" style={{ color: ink, opacity: 0.55 }}>
              {HASHTAG}
            </p>
          </div>
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

function FinaleCard({ data, stats, design, ai }: { data: WrapData; stats: WrapStats; design: SlideDesign; ai?: AiWrapContent | null }) {
  const { reset } = useWrap()
  const meta = PURPOSES.find((p) => p.id === (data.purpose ?? "life"))!
  
  const bg = c(design.bg)
  const ink = c(design.ink)
  const accent = c(design.accent)
  const palette = PALETTES[bg] ?? PALETTES["var(--wr-yellow)"]

  async function share() {
    const shareData = {
      title: "Your Life, Wrapped",
      text: ai?.finale?.tagline ?? `${stats.firstName}'s year is officially wrapped. Your year. Unhinged.`,
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
      <BgPatternLayer pattern={design.bgPattern} ink={ink} dark={bg !== "var(--wr-ink)"} />
      <DecorationLayer style={design.decoration} colors={[accent, ink]} ink={ink} />
      {design.bgPattern === "clean" && <Kaleidoscope />}
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
            {`${stats.firstName}'s wrapped`}
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
          transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.5 }}
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
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
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

const DEMO_ARTISTS = ["sombr", "Karol G", "Cyril Kamer"]
const DEMO_SONGS = ["back to friends", "Golden", "Bad Romance"]
const DEMO_GAMES = [
  { rank: 1, team1: "Barcelona", team2: "Inter Milan", competition: "UEFA Champions League Semi Final" },
  { rank: 2, team1: "Arsenal", team2: "Real Madrid", competition: "UEFA Champions League Quarter Final" },
  { rank: 3, team1: "PSG", team2: "Chelsea", competition: "FIFA Club World Cup Final" },
  { rank: 4, team1: "PSG", team2: "Inter Milan", competition: "UEFA Champions League Final" },
]

function bigMetric(data: WrapData, stats: WrapStats) {
  const purpose = data.purpose ?? "life"
  if (purpose === "couple") {
    const days = daysSince(data.anniversaryDate) || stats.int(200, 2400)
    return { value: days, label: "Days together", note: `That's ${fmt(days * 24)} hours of being disgustingly cute. Certified menace behavior.` }
  }
  if (purpose === "travel") {
    const hours = Number(data.travelHours) || stats.int(60, 380)
    return { value: hours, label: "Hours in transit", note: `Enough time to watch ${fmt(Math.round(hours / 2))} movies you fell asleep during.` }
  }
  if (purpose === "birthday") {
    const age = data.birthYear ? Math.max(1, new Date().getFullYear() - Number(data.birthYear)) : stats.int(18, 60)
    return { value: age, label: "Trips around the sun", note: `And a documented top ${stats.topPercent}% level of chaos this year alone.` }
  }
  if (purpose === "group") {
    return { value: stats.streakDays, label: "Days in the chat", note: `${stats.int(4, 12)} certified members, zero notifications silenced. Wrapped.` }
  }
  return { value: stats.streakDays, label: "Day streak", note: `And a documented top ${stats.topPercent}% level of chaos this year alone.` }
}


export function buildPages(data: WrapData, ai?: AiWrapContent | null): WrapPage[] {
  const stats = buildStats(data)
  const names = data.userNames || stats.firstName
  const purpose = data.purpose ?? "life"
  const photos = data.photos.map((p) => p.url)
  const photo0 = photos[0]

  const big = bigMetric(data, stats)
  const anthem = data.anthemTitle || "Your Anthem"

  if (ai?.slides && Array.isArray(ai.slides)) {
    return ai.slides.map((slide, i) => {
      const bg = c(slide.design.bg)
      const key = `${slide.type}-${i}`
      const p = photos.length > 0 ? photos[i % photos.length] : undefined
      
      switch (slide.type) {
        case "intro": return { key, bg, node: <IntroUniverse design={slide.design} kicker={slide.content.kicker} lines={slide.content.lines} sub={slide.content.sub} photo={photo0} /> }
        case "dataHighlight": return { key, bg, node: <DataHighlight design={slide.design} kicker={slide.content.kicker} value={slide.content.valueOverride ?? big.value} label={slide.content.label} note={slide.content.note} /> }
        case "topTrack": return { key, bg, node: <TopTrack design={slide.design} kicker={slide.content.kicker} title={slide.content.anthemTitleOverride ?? anthem} artist={slide.content.artistLine} photo={photo0} /> }
        case "receipts": return { key, bg, node: <Receipts design={slide.design} kicker="The receipts" title={slide.content.title} rows={slide.content.rows} /> }
        case "versus": return { key, bg, node: <VersusLeague design={slide.design} kicker={slide.content.kicker} left={slide.content.left} right={slide.content.right} leagueTitle={slide.content.leagueTitle} photo={photo0} /> }
        case "versusBoard": return { key, bg, node: <VersusBoard design={slide.design} kicker={slide.content.kicker} title={slide.content.title} games={slide.content.games} /> }
        case "dashboard": return { key, bg, node: <DashboardTicket design={slide.design} year="2025" photo={photo0} topArtists={slide.content.topArtists} topSongs={slide.content.topSongs} minutesListened={fmt(stats.int(40000, 90000))} topGenre={slide.content.topGenre} /> }
        case "finale": return { key, bg, node: <FinaleCard data={data} stats={stats} design={slide.design} ai={ai} /> }
        case "thread": return { key, bg, node: <ThreadSlide design={slide.design} content={slide.content} photo={p} /> }
        case "radar": return { key, bg, node: <RadarSlide design={slide.design} content={slide.content} photo={p} /> }
        case "quote": return { key, bg, node: <QuoteSlide design={slide.design} content={slide.content} photo={p} /> }
        case "polaroid": return { key, bg, node: <PolaroidSlide design={slide.design} content={slide.content} photos={photos} /> }
        case "roast": return { key, bg, node: <RoastSlide design={slide.design} content={slide.content} photo={p} /> }
        case "award": return { key, bg, node: <AwardSlide design={slide.design} content={slide.content} photo={p} /> }
        default: return { key, bg: "var(--wr-ink)", node: <div className="flex h-full items-center justify-center bg-ink text-white">Unknown slide type</div> }
      }
    })
  }

  // Fallback defaults
  const isGroup = purpose === "group"
  const isCouple = purpose === "couple"
  const isTravel = purpose === "travel"
  const introKicker = isCouple ? "Now streaming" : isTravel ? "Boarding now" : isGroup ? "The group chat" : purpose === "birthday" ? "Happy birthday" : "Now streaming"
  const introLines: [string, string, string] = isTravel ? ["The", (data.destinationCity || "world").slice(0, 14), "universe"] : isGroup ? ["The", "chaos", "universe"] : isCouple ? (data.userNames ? ["The", `${names}`.slice(0, 14), "universe"] : ["Your", "love", "story"]) : ["The", `${names}`.slice(0,14), "universe"]
  const introSub = isCouple ? "Two people, one unhinged storyline. Here's your love story, wrapped and ready to post." : isTravel ? `${data.destinationCity || "The world"} didn't stand a chance. Here's your year in transit, wrapped.` : isGroup ? "The people who ruin your notifications in the best way. Wrapped." : "Your year had range. Villain arc, glow up, redemption. All of it. Wrapped."
  
  const defaultDesign: SlideDesign = { bg: "ink", ink: "green", accent: "pink", layout: "centered", bgPattern: "halftone", decoration: "none", typoStyle: "massive" }
  
  return [
    { key: "intro", bg: "var(--wr-ink)", node: <IntroUniverse design={defaultDesign} kicker={introKicker} lines={introLines} sub={introSub} photo={photo0} /> },
    { key: "dataHighlight", bg: "var(--wr-ink)", node: <DataHighlight design={defaultDesign} kicker="Time on the clock" value={big.value} label={big.label} note={big.note} /> },
    { key: "finale", bg: "var(--wr-ink)", node: <FinaleCard data={data} stats={stats} design={defaultDesign} /> }
  ]
}
