"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import createGlobe from "cobe"
import { Shell } from "@/components/player/pages"

const SPRING = { type: "spring", stiffness: 120, damping: 14 } as const

// Sample locations for the carousel
const WORLD_LOCATIONS = [
  { name: "Avicii", location: "Sweden", coordinates: [59.33, 18.07] as [number, number] },
  { name: "BTS", location: "South Korea", coordinates: [37.57, 126.98] as [number, number] },
  { name: "Shakira", location: "Colombia", coordinates: [4.71, -74.07] as [number, number] },
  { name: "Adele", location: "United Kingdom", coordinates: [51.51, -0.13] as [number, number] },
  { name: "Stromae", location: "Belgium", coordinates: [50.85, 4.35] as [number, number] },
  { name: "Bad Bunny", location: "Puerto Rico", coordinates: [18.47, -66.11] as [number, number] },
]

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

/* ──────────────────────────────────────────────────────────────────── */
/* Real WebGL Globe using cobe — with decelerating spin               */
/* ──────────────────────────────────────────────────────────────────── */

function CobeGlobe({
  size,
  className,
}: {
  size: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const mountTimeRef = useRef(0)

  useEffect(() => {
    let width = size
    let animationId: number
    mountTimeRef.current = performance.now()

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
      }
    }
    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0.3,
      theta: 0.15,
      dark: 1,
      diffuse: 3,
      mapSamples: 40000,
      mapBrightness: 8,
      mapBaseBrightness: 0.01,
      baseColor: [0.4, 0.6, 0.1],
      markerColor: [1.0, 0.2, 0.6],
      glowColor: [0.18, 0.55, 0.50],
      markers: [],
      scale: 1.05,
      offset: [0, 0],
      opacity: 0.92,
    })

    // Rotation speed: starts fast (0.025) and decelerates to slow (0.003)
    // over ~3 seconds using an exponential decay
    const FAST_SPEED = 0.18
    const SLOW_SPEED = 0.003
    const DECEL_DURATION = 3500 // ms to reach slow speed

    const animate = () => {
      const elapsed = performance.now() - mountTimeRef.current
      // Exponential ease-out from fast to slow
      const t = Math.min(1, elapsed / DECEL_DURATION)
      const easedT = 1 - Math.pow(1 - t, 3) // cubic ease-out
      const speed = FAST_SPEED + (SLOW_SPEED - FAST_SPEED) * easedT

      phiRef.current += speed
      globe.update({
        phi: phiRef.current,
        width: width * 2,
        height: width * 2,
      })
      animationId = requestAnimationFrame(animate)
    }
    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: size,
        height: size,
        maxWidth: "100%",
        aspectRatio: "1",
        contain: "layout paint size",
      }}
    />
  )
}

/* ──────────────────────────────────────────────────────────────────── */
/* World Citizen Slide Component                                       */
/* ──────────────────────────────────────────────────────────────────── */

interface WorldCitizenProps {
  title?: string
  description1?: string
  description2?: string
  countriesCount: number
  locations?: { name: string; location: string }[]
}

export function WorldCitizen({
  title = "World Citizen",
  description1 = "When it comes to your music, borders disappear.",
  description2 = "You've listened to artists from {count} countries.",
  countriesCount = 38,
  locations = WORLD_LOCATIONS,
}: WorldCitizenProps) {
  // Phase 1 (0-1.8s): globe centered, spinning fast
  // Phase 2 (1.8s+): globe slides to right, text fades in, spin slows down
  const [settled, setSettled] = useState(false)
  const [locationIndex, setLocationIndex] = useState(0)

  const count = useCountUp(settled ? countriesCount : 0, 2000)

  useEffect(() => {
    const timer = setTimeout(() => setSettled(true), 1800)
    return () => clearTimeout(timer)
  }, [])

  const nextLocation = useCallback(() => {
    setLocationIndex((prev) => (prev + 1) % locations.length)
  }, [locations.length])

  const prevLocation = useCallback(() => {
    setLocationIndex((prev) => (prev - 1 + locations.length) % locations.length)
  }, [locations.length])

  const currentLocation = locations[locationIndex]

  return (
    <Shell>
      {/* Background */}
      <div className="absolute inset-0 bg-[#2D8C7E]" />

      {/* ── Mobile Layout ── */}
      <div className="relative flex h-full w-full flex-col md:hidden">
        {/* Single globe — starts centered, slides down to its spot */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          initial={{ y: 0 }}
          animate={settled ? { y: "15%" } : { y: 0 }}
          transition={{ type: "spring", stiffness: 40, damping: 16 }}
        >
          <motion.div
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              scale: { type: "spring", stiffness: 50, damping: 18 },
              opacity: { duration: 0.4 },
            }}
          >
            <CobeGlobe size={300} />
          </motion.div>
        </motion.div>

        {/* Text content — fades in after globe settles */}
        <div className="relative z-20 flex flex-1 flex-col">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ ...SPRING, delay: 0.2 }}
            className="flex items-center justify-between px-5 pt-8"
          >
            <div className="flex items-center gap-2 text-[#eeeee4]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 17.3c-.2.3-.6.4-.9.2-2.5-1.5-5.7-1.9-9.5-1-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 4.2-1 7.7-.5 10.5 1.2.3.2.4.6.3.8zm1.3-2.9c-.3.4-.8.5-1.2.2-2.9-1.8-7.3-2.4-10.9-1.3-.5.1-1-.2-1.1-.6-.1-.5.2-1 .6-1.1 4.1-1.2 9-1.1 12.3 1 1 .5 1.2 1 .9 1.4zm.1-3c-3.5-2.1-9.2-2.3-12.5-1.3-.6.2-1.2-.2-1.4-.8-.2-.6.2-1.2.8-1.4 3.9-1.1 10.2-.9 14.3 1.6.5.3.7.9.4 1.4-.3.5-.9.7-1.5.4z" />
              </svg>
              <span className="font-sans text-sm font-bold">Wrapsy Premium</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ ...SPRING, delay: 0.4 }}
            className="mt-3 px-5"
          >
            <h2 className="font-display text-3xl font-black tracking-tight text-[#0b0b0b]">
              {title}
            </h2>
          </motion.div>

          {/* Body text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ ...SPRING, delay: 0.6 }}
            className="mt-3 px-5"
          >
            <p className="max-w-[16rem] font-sans text-sm font-semibold leading-relaxed text-[#0b0b0b]/80">
              {description1}
            </p>
            <p className="mt-3 font-sans text-sm font-semibold leading-relaxed text-[#0b0b0b]/80">
              {description2.split("{count}").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <motion.span
                      className="inline-block font-display text-2xl font-black text-[#e4ff31]"
                      style={{ textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
                      initial={{ scale: 0 }}
                      animate={settled ? { scale: 1 } : { scale: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 12, delay: 1.0 }}
                    >
                      {count}
                    </motion.span>
                  )}
                </span>
              ))}
            </p>
          </motion.div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Carousel at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ ...SPRING, delay: 0.8 }}
            className="flex items-center justify-between px-5 pb-8"
          >
            <button onClick={prevLocation} className="text-[#0b0b0b]/50 hover:text-[#0b0b0b]">
              <ChevronLeft className="size-5" />
            </button>
            <AnimatePresence mode="wait">
              <motion.div
                key={locationIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-right"
              >
                <p className="font-display text-lg font-black text-[#0b0b0b]">
                  {currentLocation.name}
                </p>
                <p className="font-sans text-xs font-semibold text-[#0b0b0b]/60">
                  {currentLocation.location}
                </p>
              </motion.div>
            </AnimatePresence>
            <button onClick={nextLocation} className="text-[#0b0b0b]/50 hover:text-[#0b0b0b]">
              <ChevronRight className="size-5" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── Desktop Layout ── */}
      <div className="relative hidden h-full w-full md:block">
        {/* SINGLE GLOBE — starts dead center, slides right to its final position */}
        <motion.div
          className="absolute z-10 flex items-center justify-center"
          style={{ top: 0, bottom: 0, left: 0, right: 0 }}
          initial={{ x: 0 }}
          animate={
            settled
              ? { left: "40%", right: "0%", x: 0 }
              : { left: "0%", right: "0%", x: 0 }
          }
          transition={{
            type: "spring",
            stiffness: 35,
            damping: 18,
          }}
        >
          <motion.div
            initial={{ scale: 1.4, opacity: 0 }}
            animate={settled ? { scale: 1, opacity: 1 } : { scale: 1.4, opacity: 1 }}
            transition={{
              scale: { type: "spring", stiffness: 40, damping: 16 },
              opacity: { duration: 0.5 },
            }}
          >
            <CobeGlobe
              size={480}
              className="lg:!h-[520px] lg:!w-[520px] xl:!h-[560px] xl:!w-[560px]"
            />
          </motion.div>
        </motion.div>

        {/* Left side - text content (fades in after globe settles) */}
        <div className="relative z-20 flex h-full w-[40%] flex-col justify-between px-10 py-10 lg:px-14 lg:py-12">
          {/* Header - Wrapsy Premium logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ ...SPRING, delay: 0.2 }}
            className="flex items-center gap-2 text-[#eeeee4]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 17.3c-.2.3-.6.4-.9.2-2.5-1.5-5.7-1.9-9.5-1-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 4.2-1 7.7-.5 10.5 1.2.3.2.4.6.3.8zm1.3-2.9c-.3.4-.8.5-1.2.2-2.9-1.8-7.3-2.4-10.9-1.3-.5.1-1-.2-1.1-.6-.1-.5.2-1 .6-1.1 4.1-1.2 9-1.1 12.3 1 1 .5 1.2 1 .9 1.4zm.1-3c-3.5-2.1-9.2-2.3-12.5-1.3-.6.2-1.2-.2-1.4-.8-.2-.6.2-1.2.8-1.4 3.9-1.1 10.2-.9 14.3 1.6.5.3.7.9.4 1.4-.3.5-.9.7-1.5.4z" />
            </svg>
            <span className="font-sans text-lg font-bold">Wrapsy Premium</span>
          </motion.div>

          {/* Title - World Citizen */}
          <div className="flex flex-col gap-5">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ ...SPRING, delay: 0.4 }}
              className="font-display text-5xl font-black tracking-tight text-[#0b0b0b] lg:text-6xl xl:text-7xl"
            >
              {title.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ ...SPRING, delay: 0.6 }}
            >
              <p className="max-w-[18rem] font-sans text-base font-semibold leading-relaxed text-[#0b0b0b]/80 lg:text-lg">
                {description1}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ ...SPRING, delay: 0.8 }}
            >
              <p className="font-sans text-base font-semibold leading-relaxed text-[#0b0b0b]/80 lg:text-lg">
                {description2.split("{count}").map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <motion.span
                        className="inline-block font-display text-3xl font-black text-[#e4ff31] lg:text-4xl"
                        style={{ textShadow: "0 2px 12px rgba(0,0,0,0.15)" }}
                        initial={{ scale: 0 }}
                        animate={settled ? { scale: 1 } : { scale: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 1.0 }}
                      >
                        {count}
                      </motion.span>
                    )}
                  </span>
                ))}
              </p>
            </motion.div>
          </div>

          {/* Empty spacer at bottom-left */}
          <div />
        </div>

        {/* Bottom bar — carousel (desktop, absolute positioned) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ ...SPRING, delay: 1.0 }}
          className="absolute bottom-8 right-10 z-20 flex items-center gap-4 lg:right-14"
        >
          <button
            onClick={prevLocation}
            className="flex size-8 items-center justify-center rounded-full border border-[#0b0b0b]/20 text-[#0b0b0b]/50 transition-colors hover:border-[#0b0b0b]/50 hover:text-[#0b0b0b]"
          >
            <ChevronLeft className="size-4" />
          </button>
          <AnimatePresence mode="wait">
            <motion.div
              key={locationIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="min-w-[8rem] text-right"
            >
              <p className="font-display text-xl font-black text-[#0b0b0b]">
                {currentLocation.name}
              </p>
              <p className="font-sans text-sm font-semibold text-[#0b0b0b]/60">
                {currentLocation.location}
              </p>
            </motion.div>
          </AnimatePresence>
          <button
            onClick={nextLocation}
            className="flex size-8 items-center justify-center rounded-full border border-[#0b0b0b]/20 text-[#0b0b0b]/50 transition-colors hover:border-[#0b0b0b]/50 hover:text-[#0b0b0b]"
          >
            <ChevronRight className="size-4" />
          </button>
        </motion.div>
      </div>

      {/* Bottom down arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={settled ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.svg
          viewBox="0 0 24 24"
          className="size-5 text-[#0b0b0b]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </motion.div>
    </Shell>
  )
}
