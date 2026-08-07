"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import createGlobe from "cobe"
import { Shell } from "@/components/player/pages"

const SPRING = { type: "spring", stiffness: 120, damping: 14 } as const



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
}

export function WorldCitizen({
  title = "World Citizen",
  description1 = "When it comes to your music, borders disappear.",
  description2 = "Your vibe is truly global.",
}: WorldCitizenProps) {
  // Phase 1 (0-1.8s): globe centered, spinning fast
  // Phase 2 (1.8s+): globe slides to right, text fades in, spin slows down
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setSettled(true), 1800)
    return () => clearTimeout(timer)
  }, [])

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
              <img
                src="/logo/logo-solid.jpeg"
                alt="Logo"
                className="size-5 object-contain rounded-[6px]"
                style={{ borderRadius: '6px' }}
              />
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
              {description2}
            </p>
          </motion.div>

          {/* Spacer */}
          <div className="flex-1" />
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
            <img
              src="/logo/logo-solid.jpeg"
              alt="Logo"
              className="size-6 object-contain rounded-[6px]"
              style={{ borderRadius: '6px' }}
            />
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
                {description2}
              </p>
            </motion.div>
          </div>

          {/* Empty spacer at bottom-left */}
          <div />
        </div>
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
