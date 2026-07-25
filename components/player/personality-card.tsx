"use client"

import { useState, useEffect } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { Shell } from "@/components/player/pages"

function CardBack() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#0d0d1a] border-[3px] border-[#00ff88] shadow-[0_0_20px_#00ff88,0_0_40px_#00ff8833,inset_0_0_30px_#00ff8811]">
      {/* Neon grid */}
      <div className="absolute inset-0" style={{
        backgroundImage:
          "linear-gradient(rgba(0,255,136,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.2) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }} />

      {/* Large neon glow blobs */}
      <div className="absolute -left-[20%] -top-[10%] w-[70%] h-[50%] rounded-full bg-[#ff00ff]/25 blur-[60px]" />
      <div className="absolute -right-[20%] -bottom-[10%] w-[70%] h-[50%] rounded-full bg-[#00ffff]/25 blur-[60px]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] rounded-full bg-[#00ff88]/20 blur-[50px]" />

      {/* Center spinning diamond */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 140 140" className="w-32 h-32 md:w-40 md:h-40">
            <defs>
              <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ff88" />
                <stop offset="50%" stopColor="#ff00ff" />
                <stop offset="100%" stopColor="#00ffff" />
              </linearGradient>
            </defs>
            <path d="M70 5 L135 70 L70 135 L5 70 Z" fill="none" stroke="url(#neonGrad)" strokeWidth="3" />
            <path d="M70 25 L115 70 L70 115 L25 70 Z" fill="none" stroke="#00ff88" strokeWidth="2" opacity="0.8" />
            <path d="M70 45 L95 70 L70 95 L45 70 Z" fill="none" stroke="#ff00ff" strokeWidth="2" opacity="0.7" />
            <circle cx="70" cy="70" r="14" fill="none" stroke="#00ffff" strokeWidth="2.5" />
            <circle cx="70" cy="70" r="6" fill="#00ff88" />
          </svg>
        </motion.div>
      </div>

      {/* Neon corner brackets — thick and glowing */}
      <div className="absolute left-2 top-2 h-12 w-12">
        <div className="absolute left-0 top-0 h-full w-[3px] bg-[#00ff88] shadow-[0_0_10px_#00ff88,0_0_20px_#00ff88]" />
        <div className="absolute left-0 top-0 h-[3px] w-full bg-[#00ff88] shadow-[0_0_10px_#00ff88,0_0_20px_#00ff88]" />
      </div>
      <div className="absolute right-2 top-2 h-12 w-12">
        <div className="absolute right-0 top-0 h-full w-[3px] bg-[#ff00ff] shadow-[0_0_10px_#ff00ff,0_0_20px_#ff00ff]" />
        <div className="absolute right-0 top-0 h-[3px] w-full bg-[#ff00ff] shadow-[0_0_10px_#ff00ff,0_0_20px_#ff00ff]" />
      </div>
      <div className="absolute bottom-2 left-2 h-12 w-12">
        <div className="absolute bottom-0 left-0 h-full w-[3px] bg-[#00ffff] shadow-[0_0_10px_#00ffff,0_0_20px_#00ffff]" />
        <div className="absolute bottom-0 left-0 h-[3px] w-full bg-[#00ffff] shadow-[0_0_10px_#00ffff,0_0_20px_#00ffff]" />
      </div>
      <div className="absolute bottom-2 right-2 h-12 w-12">
        <div className="absolute bottom-0 right-0 h-full w-[3px] bg-[#ff00ff] shadow-[0_0_10px_#ff00ff,0_0_20px_#ff00ff]" />
        <div className="absolute bottom-0 right-0 h-[3px] w-full bg-[#ff00ff] shadow-[0_0_10px_#ff00ff,0_0_20px_#ff00ff]" />
      </div>

      {/* TAP TO REVEAL text */}
      <div className="absolute bottom-5 left-0 right-0 text-center">
        <span
          className="text-xs uppercase tracking-[0.35em] font-display font-black"
          style={{ color: "#00ff88", textShadow: "0 0 12px #00ff88, 0 0 24px #00ff88, 0 0 40px #00ff88" }}
        >
          Tap to reveal
        </span>
      </div>
    </div>
  )
}

function CardFront({ imageUrl, title }: { imageUrl: string | null; title: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#0d0d1a] border-[3px] border-[#00ff88] shadow-[0_0_20px_#00ff88,0_0_40px_#00ff8833]">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6 text-center text-[#00ff88]/50 font-sans text-sm font-semibold">
          No image available.
        </div>
      )}
      {/* Inner neon glow ring */}
      <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_40px_rgba(0,255,136,0.2)]" />
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

  // Derived values for realistic card physics
  const rotateX = useTransform(flipProgress, [0, 0.5, 1], [0, -8, 0])
  const scale = useTransform(flipProgress, [0, 0.3, 0.5, 0.7, 1], [1, 1.08, 1.12, 1.08, 1])
  const shadowBlur = useTransform(flipProgress, [0, 0.5, 1], [20, 60, 30])
  const shadowY = useTransform(flipProgress, [0, 0.5, 1], [10, 30, 15])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("flipping")
      animate(flipProgress, 180, {
        duration: 1.0,
        ease: [0.37, 0, 0.63, 1],
        onComplete: () => setPhase("done"),
      })
    }, 1800)
    return () => clearTimeout(timer)
  }, [flipProgress])

  const rotateYValue = useTransform(flipProgress, (v) => v)

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
          transition={{ duration: 0.5, times: [0, 0.08, 1] }}
          style={{
            background: "radial-gradient(circle at center, rgba(0,255,136,0.7) 0%, rgba(255,0,255,0.3) 40%, transparent 70%)",
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
            style={{ aspectRatio: "2/3", rotateX, scale }}
          >
            {/* Drop shadow (behind card) */}
            <motion.div
              className="absolute -bottom-4 left-[10%] right-[10%] h-8 rounded-[50%] bg-black/40 blur-xl"
              style={{
                opacity: useTransform(flipProgress, [0, 0.5, 1], [0.4, 0.8, 0.5]),
                scaleX: useTransform(flipProgress, [0, 0.5, 1], [0.8, 1.2, 1]),
              }}
            />

            {/* The flipping card */}
            <motion.div
              className="absolute inset-0"
              style={{
                transformStyle: "preserve-3d",
                rotateY: rotateYValue,
              }}
            >
              {/* BACK face */}
              <div
                className="absolute inset-0"
                style={{ backfaceVisibility: "hidden" }}
              >
                <CardBack />
              </div>

              {/* FRONT face */}
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <CardFront imageUrl={imageUrl} title={title} />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col items-center text-center"
        >
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-white drop-shadow-lg md:text-5xl">
            {title}
          </h2>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 max-w-sm text-center font-sans text-[clamp(0.85rem,3vw,1rem)] font-semibold leading-relaxed tracking-wide text-white/80 drop-shadow-md md:text-base"
        >
          {description}
        </motion.p>
      </div>
    </Shell>
  )
}
