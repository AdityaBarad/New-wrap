"use client"

import { motion } from "framer-motion"
import { Shell } from "@/components/player/pages"

export function PersonalityCardSlide({
  title = "Mastermind",
  description = "A punchy description of this persona.",
  imageUrl = null,
}: {
  title?: string
  description?: string
  imageUrl?: string | null
}) {
  return (
    <Shell>
      {/* Background that transitions from previous slide's orange to black */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ backgroundColor: "#FA5838" }}
        animate={{ backgroundColor: "#000000" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Decorative elements converging into the card but remaining visible */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ scale: 1, opacity: 1, rotate: 0 }}
        animate={{ scale: 0.85, opacity: 0.6, rotate: 5 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ transformOrigin: "center center" }}
      >
        <div className="absolute inset-0 w-full h-full">
          {/* 1. Holographic Gradient Box (Top Left) */}
          <div
            className="absolute z-0"
            style={{
              left: 0,
              top: 0,
              width: "32%",
              height: "45%",
              background: "linear-gradient(135deg, #D4FFC6 0%, #68B2FF 50%, #C490FF 100%)",
            }}
          />

          {/* 2. Spiky Star Burst (Left Edge, overlapping box) */}
          <div
            className="absolute z-10 pointer-events-none"
            style={{ left: "-12vw", top: "35vh", transform: "rotate(-20deg)" }}
          >
            <svg viewBox="0 0 200 200" fill="none" style={{ width: "clamp(250px, 45vw, 400px)", height: "clamp(250px, 45vw, 400px)" }}>
              <defs>
                <radialGradient id="starGradLeft" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#39FF14" />
                  <stop offset="25%" stopColor="#FF0055" />
                  <stop offset="60%" stopColor="#7F00FF" />
                  <stop offset="100%" stopColor="#4B0082" />
                </radialGradient>
              </defs>
              <path
                d="M100 0 L108 55 L160 10 L130 65 L195 50 L145 90 L200 110 L145 125 L180 180 L125 145 L110 200 L95 145 L35 185 L70 130 L0 120 L65 95 L5 50 L75 65 L40 10 L92 55 Z"
                fill="url(#starGradLeft)"
              />
            </svg>
          </div>

          {/* 3. Pixel Flower (Top Left, bright green) */}
          <div
            className="absolute z-10 pointer-events-none"
            style={{ left: "10vw", top: "8vh" }}
          >
            <svg viewBox="0 0 100 100" fill="none" style={{ width: "clamp(120px, 15vw, 200px)", height: "clamp(120px, 15vw, 200px)" }}>
              <path
                d="M50 20 C60 0, 80 10, 70 30 C90 20, 100 40, 80 50 C100 60, 90 80, 70 70 C80 90, 60 100, 50 80 C40 100, 20 90, 30 70 C10 80, 0 60, 20 50 C0 40, 10 20, 30 30 C20 10, 40 0, 50 20 Z"
                stroke="#7FFF00"
                strokeWidth="4"
                strokeLinejoin="miter"
              />
            </svg>
          </div>

          {/* 4. Pixel Flower (Middle Right, large, bright green) */}
          <div
            className="absolute z-10 pointer-events-none"
            style={{ right: "-12vw", top: "45vh" }}
          >
            <svg viewBox="0 0 100 100" fill="none" style={{ width: "clamp(250px, 40vw, 400px)", height: "clamp(250px, 40vw, 400px)" }}>
              <path
                d="M50 20 C60 0, 80 10, 70 30 C90 20, 100 40, 80 50 C100 60, 90 80, 70 70 C80 90, 60 100, 50 80 C40 100, 20 90, 30 70 C10 80, 0 60, 20 50 C0 40, 10 20, 30 30 C20 10, 40 0, 50 20 Z"
                stroke="#39FF14"
                strokeWidth="3"
                strokeLinejoin="miter"
              />
            </svg>
          </div>

          {/* 5. Squiggly Ribbon (Top Right) */}
          <div
            className="absolute z-20 pointer-events-none"
            style={{ top: "-2vh", right: "8vw" }}
          >
            <svg viewBox="0 0 200 300" fill="none" style={{ width: "clamp(150px, 25vw, 250px)", height: "clamp(200px, 35vw, 350px)" }}>
              <path
                d="M100 -50 C 150 50, 0 100, 50 180 C 100 260, 250 200, 200 350"
                stroke="#00E5FF"
                strokeWidth="32"
                strokeLinecap="round"
              />
              <path
                d="M100 -50 C 150 50, 0 100, 50 180 C 100 260, 250 200, 200 350"
                stroke="#101010"
                strokeWidth="20"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* 6. Squiggly Ribbon (Bottom Left) */}
          <div
            className="absolute z-20 pointer-events-none"
            style={{ bottom: "-5vh", left: "2vw" }}
          >
            <svg viewBox="0 0 300 200" fill="none" style={{ width: "clamp(200px, 30vw, 300px)", height: "clamp(150px, 20vw, 250px)" }}>
              <path
                d="M-50 150 C 50 250, 150 100, 250 150 C 350 200, 300 0, 400 -50"
                stroke="#00E5FF"
                strokeWidth="32"
                strokeLinecap="round"
              />
              <path
                d="M-50 150 C 50 250, 150 100, 250 150 C 350 200, 300 0, 400 -50"
                stroke="#101010"
                strokeWidth="20"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 py-10 md:px-14">
        {/* Holographic / Gradient Card for the Image Only */}
        <motion.div
          initial={{ scale: 0.2, y: 0, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex aspect-[2/3] w-full max-w-[18rem] items-center justify-center rounded-xl p-[4px] shadow-[0_0_50px_rgba(255,255,255,0.15)]"
        >
          {/* Rainbow Border Gradient overlay - Forced with inline styles to guarantee it renders */}
          <div 
            className="absolute inset-0 z-0 rounded-xl" 
            style={{ background: "linear-gradient(to top right, #ec4899, #22d3ee, #facc15)" }}
          />

          {/* Inner Image Container */}
          <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] bg-[#222222]">
            {imageUrl ? (
              <motion.img
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="p-6 text-center text-red-400 font-sans text-sm font-semibold">
                No image available.
              </div>
            )}

            {/* A subtle holographic shine over the image */}
            <motion.div
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-transparent to-pink-500/20 mix-blend-screen"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Title placed below the card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-8 flex flex-col items-center text-center"
        >
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-white drop-shadow-lg md:text-5xl">
            {title}
          </h2>
        </motion.div>

        {/* Description that scales in closer */}
        <motion.p
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 1.5 }}
          className="mt-4 max-w-sm text-center font-sans text-[clamp(0.85rem,3vw,1rem)] font-semibold leading-relaxed tracking-wide text-white/90 drop-shadow-md md:text-base"
        >
          {description}
        </motion.p>
      </div>
    </Shell>
  )
}
