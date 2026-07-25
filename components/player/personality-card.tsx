"use client"

import { useState, useEffect } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { Shell } from "@/components/player/pages"

function CardBack() {
  return (
    <div
      className="h-full w-full overflow-hidden rounded-xl border-[3px] border-black"
      style={{ backgroundColor: "#00BFFF" }}
    >
      {/* TAP TO REVEAL text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm uppercase tracking-[0.4em] font-display font-black text-black">
          Tap to reveal
        </span>
      </div>
    </div>
  )
}

function CardFront({ imageUrl, title }: { imageUrl: string | null; title: string }) {
  return (
    <div
      className="h-full w-full overflow-hidden rounded-xl border-[3px] border-black"
      style={{ backgroundColor: "#00BFFF" }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
          style={{ backgroundColor: "#00BFFF" }}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center p-6 text-center text-black/60 font-sans text-sm font-semibold"
          style={{ backgroundColor: "#00BFFF" }}
        >
          No image available.
        </div>
      )}
    </div>
  )
}

export function PersonalityCardSlide({
  title = "Mastermind",
  description = "A punchy description of this persona.",
  imageUrl = null,
}: {
  title?: string
  description?: string
  imageUrl?: string | null
}) {
  const [phase, setPhase] = useState<"idle" | "flipping" | "done">("idle")
  const flipProgress = useMotionValue(0)
  const [showFront, setShowFront] = useState(false)

  const rotateX = useTransform(flipProgress, [0, 90, 180], [0, -12, 0])
  const scale = useTransform(flipProgress, [0, 50, 90, 130, 180], [1, 1.05, 1.15, 1.05, 1])

  // Opacity-based face switching at 90° — no backfaceVisibility needed
  const backOpacity = useTransform(flipProgress, [0, 89, 90, 180], [1, 1, 0, 0])
  const frontOpacity = useTransform(flipProgress, [0, 89, 90, 180], [0, 0, 1, 1])

  // The rotation applied to the whole card container
  const rotateY = useTransform(flipProgress, (v) => v)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("flipping")
      animate(flipProgress, 180, {
        duration: 1.2,
        ease: [0.34, 1.56, 0.64, 1],
        onComplete: () => {
          setPhase("done")
          setShowFront(true)
        },
      })
    }, 1500)

    // Listen for the midpoint to swap faces
    const unsubscribe = flipProgress.on("change", (v) => {
      setShowFront(v >= 90)
    })

    return () => {
      clearTimeout(timer)
      unsubscribe()
    }
  }, [flipProgress])

  return (
    <Shell>
      {/* Background */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ backgroundColor: "#FA5838" }}
        animate={{ backgroundColor: "#050505" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Decorative elements */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ scale: 1, opacity: 1, rotate: 0 }}
        animate={{ scale: 0.85, opacity: 0.5, rotate: 5 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ transformOrigin: "center center" }}
      >
        <div className="absolute inset-0 w-full h-full">
          <div
            className="absolute z-0"
            style={{
              left: 0, top: 0, width: "32%", height: "45%",
              background: "linear-gradient(135deg, #D4FFC6 0%, #68B2FF 50%, #C490FF 100%)",
            }}
          />
          <div className="absolute z-10 pointer-events-none" style={{ left: "-12vw", top: "35vh", transform: "rotate(-20deg)" }}>
            <svg viewBox="0 0 200 200" fill="none" style={{ width: "clamp(250px, 45vw, 400px)", height: "clamp(250px, 45vw, 400px)" }}>
              <defs>
                <radialGradient id="starGradLeft" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#39FF14" />
                  <stop offset="25%" stopColor="#FF0055" />
                  <stop offset="60%" stopColor="#7F00FF" />
                  <stop offset="100%" stopColor="#4B0082" />
                </radialGradient>
              </defs>
              <path d="M100 0 L108 55 L160 10 L130 65 L195 50 L145 90 L200 110 L145 125 L180 180 L125 145 L110 200 L95 145 L35 185 L70 130 L0 120 L65 95 L5 50 L75 65 L40 10 L92 55 Z" fill="url(#starGradLeft)" />
            </svg>
          </div>
          <div className="absolute z-10 pointer-events-none" style={{ left: "10vw", top: "8vh" }}>
            <svg viewBox="0 0 100 100" fill="none" style={{ width: "clamp(120px, 15vw, 200px)", height: "clamp(120px, 15vw, 200px)" }}>
              <path d="M50 20 C60 0, 80 10, 70 30 C90 20, 100 40, 80 50 C100 60, 90 80, 70 70 C80 90, 60 100, 50 80 C40 100, 20 90, 30 70 C10 80, 0 60, 20 50 C0 40, 10 20, 30 30 C20 10, 40 0, 50 20 Z" stroke="#7FFF00" strokeWidth="4" strokeLinejoin="miter" />
            </svg>
          </div>
          <div className="absolute z-10 pointer-events-none" style={{ right: "-12vw", top: "45vh" }}>
            <svg viewBox="0 0 100 100" fill="none" style={{ width: "clamp(250px, 40vw, 400px)", height: "clamp(250px, 40vw, 400px)" }}>
              <path d="M50 20 C60 0, 80 10, 70 30 C90 20, 100 40, 80 50 C100 60, 90 80, 70 70 C80 90, 60 100, 50 80 C40 100, 20 90, 30 70 C10 80, 0 60, 20 50 C0 40, 10 20, 30 30 C20 10, 40 0, 50 20 Z" stroke="#39FF14" strokeWidth="3" strokeLinejoin="miter" />
            </svg>
          </div>
          <div className="absolute z-20 pointer-events-none" style={{ top: "-2vh", right: "8vw" }}>
            <svg viewBox="0 0 200 300" fill="none" style={{ width: "clamp(150px, 25vw, 250px)", height: "clamp(200px, 35vw, 350px)" }}>
              <path d="M100 -50 C 150 50, 0 100, 50 180 C 100 260, 250 200, 200 350" stroke="#00E5FF" strokeWidth="32" strokeLinecap="round" />
              <path d="M100 -50 C 150 50, 0 100, 50 180 C 100 260, 250 200, 200 350" stroke="#101010" strokeWidth="20" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute z-20 pointer-events-none" style={{ bottom: "-5vh", left: "2vw" }}>
            <svg viewBox="0 0 300 200" fill="none" style={{ width: "clamp(200px, 30vw, 300px)", height: "clamp(150px, 20vw, 250px)" }}>
              <path d="M-50 150 C 50 250, 150 100, 250 150 C 350 200, 300 0, 400 -50" stroke="#00E5FF" strokeWidth="32" strokeLinecap="round" />
              <path d="M-50 150 C 50 250, 150 100, 250 150 C 350 200, 300 0, 400 -50" stroke="#101010" strokeWidth="20" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Flash burst on reveal completion */}
      {phase === "done" && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, times: [0, 0.1, 1] }}
          style={{
            background: "radial-gradient(circle at center, rgba(0,191,255,0.5) 0%, rgba(0,191,255,0.1) 40%, transparent 70%)",
          }}
        />
      )}

      <div className="relative z-30 flex h-full w-full flex-col items-center justify-center px-6 py-10 md:px-14">
        {/* Card wrapper with perspective */}
        <div
          className="relative w-full max-w-[18rem]"
          style={{ perspective: "1400px", perspectiveOrigin: "center 40%" }}
        >
          {/* Aspect ratio container */}
          <motion.div
            className="relative w-full"
            style={{ aspectRatio: "2/3", rotateX, scale, rotateY }}
          >
            {/* BACK face — visible before 90° */}
            <motion.div
              className="absolute inset-0"
              style={{ opacity: backOpacity }}
            >
              <CardBack />
            </motion.div>

            {/* FRONT face — visible after 90°, counter-rotated so it reads correctly */}
            <motion.div
              className="absolute inset-0"
              style={{
                opacity: frontOpacity,
                rotateY: 180,
              }}
            >
              <CardFront imageUrl={imageUrl} title={title} />
            </motion.div>
          </motion.div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center text-center"
        >
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-white drop-shadow-lg md:text-5xl">
            {title}
          </h2>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 max-w-sm text-center font-sans text-[clamp(0.85rem,3vw,1rem)] font-medium leading-relaxed tracking-wide text-white/80 drop-shadow-md md:text-base"
        >
          {description}
        </motion.p>
      </div>
    </Shell>
  )
}
