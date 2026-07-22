"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { useWrap } from "@/context/wrap-context"
import { buildPages, PixelTransitionShutter } from "@/components/player/pages"
import { SpiralRibbon, ANIM_DURATION_MS as SPIRAL_MS } from "@/components/player/spiral-ribbon"
import { HypnoticRipple, ANIM_DURATION_MS as HYPNOTIC_MS } from "@/components/player/hypnotic-ripple"
import { SweepTransition, ANIM_DURATION_MS as SWEEP_MS } from "@/components/player/sweep-transition"

const PAGE_MS = 7000
const CURTAIN_CLOSE_MS = 2700
const CURTAIN_OPEN_MS = 3000

type CurtainPhase = "closing" | "opening" | "spiral-closing" | "spiral-opening" | "hypnotic-closing" | "hypnotic-opening" | "sweep-closing" | "sweep-opening" | null

export function StageThree({
  isPaused = false,
  setIsPaused,
}: {
  isPaused?: boolean
  setIsPaused?: (val: boolean | ((prev: boolean) => boolean)) => void
}) {
  const { data, aiContent } = useWrap()
  const pages = useMemo(() => (aiContent ? buildPages(data, aiContent) : []), [data, aiContent])
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [isIntroZoom, setIsIntroZoom] = useState(false)
  const [localPaused, setLocalPaused] = useState(false)
  const paused = setIsPaused ? isPaused : localPaused
  const handleSetPaused = setIsPaused || setLocalPaused
  const [progress, setProgress] = useState(0)
  const [curtainPhase, setCurtainPhase] = useState<CurtainPhase>(null)
  const reducedMotion = useReducedMotion()
  const raf = useRef<number | null>(null)
  const start = useRef<number>(0)
  const elapsedBefore = useRef<number>(0)
  const transitionLock = useRef(false)
  const transitionTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  const commitPage = useCallback((next: number, d: number) => {
    setDir(d)
    setIndex(next)
    setProgress(0)
    elapsedBefore.current = 0
    start.current = performance.now()
  }, [])

  const go = useCallback(
    (next: number, d: number) => {
      if (next < 0 || next >= pages.length || transitionLock.current) return

      const nextIsIntro =
        !reducedMotion &&
        ((index === 0 && next === 1) || (index === 1 && next === 0))
      setIsIntroZoom(nextIsIntro)

      const isForwardShutter =
        d > 0 &&
        ((pages[index]?.key === "s2-share" && pages[next]?.key === "s2") ||
         (pages[index]?.key === "s2" && pages[next]?.key === "s3-top-song"))

      const isBackwardShutter =
        d < 0 &&
        ((pages[index]?.key === "s3-top-song" && pages[next]?.key === "s2") ||
         (pages[index]?.key === "s2" && pages[next]?.key === "s2-share"))

      const isForwardSpiralShutter =
        d > 0 && pages[index]?.key === "s3-top-song" && pages[next]?.key === "s4-global-artists"

      const isBackwardSpiralShutter =
        d < 0 && pages[index]?.key === "s4-global-artists" && pages[next]?.key === "s3-top-song"

      const isForwardHypnoticShutter =
        d > 0 && pages[index]?.key === "s-world-citizen" && pages[next]?.key === "s7"

      const isBackwardHypnoticShutter =
        d < 0 && pages[index]?.key === "s7" && pages[next]?.key === "s-world-citizen"

      const isForwardSweepShutter =
        d > 0 && pages[index]?.key === "s3-artist-stats" && pages[next]?.key === "s-world-citizen"

      const isBackwardSweepShutter =
        d < 0 && pages[index]?.key === "s-world-citizen" && pages[next]?.key === "s3-artist-stats"

      const usesPixelShutter =
        !reducedMotion && (isForwardShutter || isBackwardShutter)

      const usesSpiralShutter =
        !reducedMotion && (isForwardSpiralShutter || isBackwardSpiralShutter)
        
      const usesHypnoticShutter =
        !reducedMotion && (isForwardHypnoticShutter || isBackwardHypnoticShutter)

      const usesSweepShutter =
        !reducedMotion && (isForwardSweepShutter || isBackwardSweepShutter)

      if (!usesPixelShutter && !usesSpiralShutter && !usesHypnoticShutter && !usesSweepShutter) {
        commitPage(next, d)
        return
      }

      transitionLock.current = true
      setProgress(1)
      setCurtainPhase(usesSpiralShutter ? "spiral-closing" : usesHypnoticShutter ? "hypnotic-closing" : usesSweepShutter ? "sweep-closing" : "closing")

      const closeMs = usesSpiralShutter ? SPIRAL_MS : usesHypnoticShutter ? HYPNOTIC_MS : usesSweepShutter ? SWEEP_MS : CURTAIN_CLOSE_MS
      const openMs = usesSpiralShutter ? SPIRAL_MS : usesHypnoticShutter ? HYPNOTIC_MS : usesSweepShutter ? SWEEP_MS : CURTAIN_OPEN_MS

      const closeTimer = setTimeout(() => {
        commitPage(next, d)
        setCurtainPhase(usesSpiralShutter ? "spiral-opening" : usesHypnoticShutter ? "hypnotic-opening" : usesSweepShutter ? "sweep-opening" : "opening")

        const openTimer = setTimeout(() => {
          setCurtainPhase(null)
          transitionLock.current = false
          start.current = performance.now()
        }, openMs)
        transitionTimers.current.push(openTimer)
      }, closeMs)
      transitionTimers.current.push(closeTimer)
    },
    [commitPage, index, pages, reducedMotion],
  )

  const advance = useCallback(() => go(index + 1, 1), [go, index])
  const back = useCallback(() => go(index - 1, -1), [go, index])

  useEffect(() => {
    return () => {
      transitionTimers.current.forEach(clearTimeout)
      transitionTimers.current = []
    }
  }, [])

  // autoplay progress
  useEffect(() => {
    start.current = performance.now()
    elapsedBefore.current = 0
    const tick = (now: number) => {
      if (!paused && !curtainPhase) {
        const elapsed = elapsedBefore.current + (now - start.current)
        const p = Math.min(1, elapsed / PAGE_MS)
        setProgress(p)
        if (p >= 1) {
          if (index < pages.length - 1) {
            go(index + 1, 1)
          } else {
            handleSetPaused(true)
          }
          return
        }
      } else {
        start.current = now
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [index, paused, pages.length, go, curtainPhase])

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") advance()
      else if (e.key === "ArrowLeft") back()
      else if (e.key === " ") {
        e.preventDefault()
        handleSetPaused((p) => !p)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [advance, back])

  const current = pages[index]
  const isLast = index === pages.length - 1

  if (!current) return null

  const customData = { dir, isIntroZoom }

  return (
    <div className="fixed inset-0 z-50 h-[100dvh] w-screen overflow-hidden bg-ink select-none">
      {/* progress bars */}
      <div className="absolute inset-x-0 top-0 z-30 flex gap-1.5 p-3 md:p-4">
        {pages.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream/25">
            <div
              className="h-full rounded-full bg-cream transition-[width] duration-75"
              style={{ width: `${i < index ? 100 : i === index ? progress * 100 : 0}%` }}
            />
          </div>
        ))}
      </div>

      {/* click zones */}
      <button
        type="button"
        aria-label="Previous"
        onClick={back}
        className="absolute inset-y-0 left-0 z-20 w-1/2 cursor-w-resize"
      />
      <button
        type="button"
        aria-label="Next"
        onClick={advance}
        className="absolute inset-y-0 right-0 z-20 w-1/2 cursor-e-resize"
      />

      {/* pages */}
      <AnimatePresence mode="popLayout" custom={customData}>
        <motion.div
          key={current.key}
          custom={customData}
          variants={{
            initial: ({ dir, isIntroZoom }: { dir: number; isIntroZoom: boolean }) => {
              if (isIntroZoom) {
                return {
                  clipPath: dir > 0 ? "circle(0% at 50% 50%)" : "circle(150% at 50% 50%)",
                  zIndex: dir > 0 ? 10 : 1,
                  y: 0,
                  opacity: 1,
                }
              }
              return {
                clipPath: "circle(150% at 50% 50%)",
                zIndex: dir > 0 ? 10 : 1,
                y: dir > 0 ? "100%" : "0%",
                opacity: 1,
              }
            },
            animate: ({ dir, isIntroZoom }: { dir: number; isIntroZoom: boolean }) => ({
              clipPath: "circle(150% at 50% 50%)",
              zIndex: dir > 0 ? 10 : 1,
              y: "0%",
              opacity: 1,
              transition: isIntroZoom
                ? { duration: dir > 0 ? 3.2 : 1.0, ease: [0.76, 0, 0.24, 1] }
                : { type: "spring", stiffness: 300, damping: 30, mass: 1 },
            }),
            exit: ({ dir, isIntroZoom }: { dir: number; isIntroZoom: boolean }) => {
              if (isIntroZoom) {
                return {
                  clipPath: dir > 0 ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)",
                  zIndex: dir > 0 ? 1 : 10,
                  y: 0,
                  opacity: dir > 0 ? 0 : 1,
                  transition: { duration: dir > 0 ? 3.2 : 1.0, ease: [0.76, 0, 0.24, 1] },
                }
              }
              return {
                clipPath: "circle(150% at 50% 50%)",
                zIndex: dir > 0 ? 1 : 10,
                y: dir > 0 ? "0%" : "100%",
                opacity: 1,
                transition: { type: "spring", stiffness: 300, damping: 30, mass: 1 },
              }
            },
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 overflow-hidden"
          style={{ backgroundColor: current.bg }}
        >
          <motion.div
            custom={customData}
            variants={{
              initial: ({ dir, isIntroZoom }: { dir: number; isIntroZoom: boolean }) => {
                if (isIntroZoom) {
                  return {
                    scale: dir > 0 ? 0.8 : 2.5,
                    filter: dir > 0 ? "blur(0px)" : "blur(15px)",
                    opacity: dir > 0 ? 1 : 0,
                  }
                }
                return {
                  scale: dir > 0 ? 1 : 0.9,
                  filter: "blur(0px)",
                  opacity: dir > 0 ? 1 : 0,
                }
              },
              animate: ({ isIntroZoom, dir }: { isIntroZoom: boolean; dir: number }) => ({
                scale: 1,
                filter: "blur(0px)",
                opacity: 1,
                transition: isIntroZoom
                  ? { duration: dir > 0 ? 3.2 : 1.0, ease: [0.76, 0, 0.24, 1] }
                  : { type: "spring", stiffness: 300, damping: 30, mass: 1 },
              }),
              exit: ({ dir, isIntroZoom }: { dir: number; isIntroZoom: boolean }) => {
                if (isIntroZoom) {
                  return {
                    scale: dir > 0 ? 2.5 : 0.8,
                    filter: dir > 0 ? "blur(15px)" : "blur(0px)",
                    opacity: dir > 0 ? 0 : 1,
                    transition: { duration: dir > 0 ? 3.2 : 1.0, ease: [0.76, 0, 0.24, 1] },
                  }
                }
                return {
                  scale: dir > 0 ? 0.9 : 1,
                  filter: "blur(0px)",
                  opacity: dir > 0 ? 0 : 1,
                  transition: { type: "spring", stiffness: 300, damping: 30, mass: 1 },
                }
              },
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {current.node}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {curtainPhase === "closing" || curtainPhase === "opening" ? (
          <PixelTransitionShutter
            key="pixel-shutter"
            phase={curtainPhase}
            outward={current.key === "s3-top-song"}
            slideInCorners={!(pages[index]?.key === "s2" || pages[index]?.key === "s3-top-song")}
          />
        ) : curtainPhase === "spiral-closing" || curtainPhase === "spiral-opening" ? (
          <div key="spiral-shutter" className="pointer-events-auto absolute inset-0 z-[25]">
            <SpiralRibbon phase={curtainPhase === "spiral-closing" ? "closing" : "opening"} />
          </div>
        ) : curtainPhase === "hypnotic-closing" || curtainPhase === "hypnotic-opening" ? (
          <HypnoticRipple key="hypnotic-shutter" phase={curtainPhase === "hypnotic-closing" ? "closing" : "opening"} />
        ) : curtainPhase === "sweep-closing" || curtainPhase === "sweep-opening" ? (
          <SweepTransition key="sweep-shutter" phase={curtainPhase === "sweep-closing" ? "closing" : "opening"} direction={dir} />
        ) : null}
      </AnimatePresence>

      {/* top-right glassmorphism controls */}
      <div className="absolute right-3 top-8 z-30 flex items-center gap-2 md:right-4 md:top-10">
        <button
          type="button"
          onClick={() => handleSetPaused((p) => !p)}
          className="rounded-full border border-cream/30 bg-cream/10 p-2.5 text-cream shadow-lg backdrop-blur-md transition-colors hover:border-cream/70 hover:bg-cream/20"
          aria-label={paused ? "Play" : "Pause"}
        >
          {paused ? <Play className="size-4 fill-current" /> : <Pause className="size-4 fill-current" />}
        </button>
      </div>

      {/* bottom bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-center justify-between p-4 md:p-6">
        <span className="font-display text-xs font-black uppercase tracking-widest text-cream/60">
          {String(index + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
        </span>
        <div className="pointer-events-auto flex items-center gap-2">
          {index > 0 && (
            <button
              type="button"
              onClick={back}
              className="rounded-full border border-cream/30 bg-cream/10 p-2.5 text-cream shadow-lg backdrop-blur-md transition-colors hover:border-cream/70 hover:bg-cream/20"
              aria-label="Back"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
          {!isLast && (
            <button
              type="button"
              onClick={advance}
              className="rounded-full border border-cream/30 bg-cream/10 p-2.5 text-cream shadow-lg backdrop-blur-md transition-colors hover:border-cream/70 hover:bg-cream/20"
              aria-label="Next"
            >
              <ChevronRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
