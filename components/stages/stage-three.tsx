"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { useWrap } from "@/context/wrap-context"
import { buildPages } from "@/components/player/pages"

const PAGE_MS = 7000

export function StageThree() {
  const { data, aiContent } = useWrap()
  const pages = useMemo(() => (aiContent ? buildPages(data, aiContent) : []), [data, aiContent])
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const raf = useRef<number | null>(null)
  const start = useRef<number>(0)
  const elapsedBefore = useRef<number>(0)

  const go = useCallback(
    (next: number, d: number) => {
      if (next < 0 || next >= pages.length) return
      setDir(d)
      setIndex(next)
      setProgress(0)
      elapsedBefore.current = 0
      start.current = performance.now()
    },
    [pages.length],
  )

  const advance = useCallback(() => go(index + 1, 1), [go, index])
  const back = useCallback(() => go(index - 1, -1), [go, index])

  // autoplay progress
  useEffect(() => {
    start.current = performance.now()
    elapsedBefore.current = 0
    const tick = (now: number) => {
      if (!paused) {
        const elapsed = elapsedBefore.current + (now - start.current)
        const p = Math.min(1, elapsed / PAGE_MS)
        setProgress(p)
        if (p >= 1) {
          if (index < pages.length - 1) {
            go(index + 1, 1)
          } else {
            setPaused(true)
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
  }, [index, paused, pages.length, go])

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") advance()
      else if (e.key === "ArrowLeft") back()
      else if (e.key === " ") {
        e.preventDefault()
        setPaused((p) => !p)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [advance, back])

  const current = pages[index]
  const isLast = index === pages.length - 1

  if (!current) return null

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
      <AnimatePresence mode="popLayout" custom={dir}>
        <motion.div
          key={current.key}
          custom={dir}
          initial={{ opacity: 0, x: dir * 120, scale: 0.92, rotate: dir * 2 }}
          animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, x: dir * -120, scale: 0.92, rotate: dir * -2 }}
          transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.9 }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: current.bg }}
        >
          {current.node}
        </motion.div>
      </AnimatePresence>

      {/* top-right glassmorphism controls */}
      <div className="absolute right-3 top-8 z-30 flex items-center gap-2 md:right-4 md:top-10">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
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
