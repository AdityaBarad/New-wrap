"use client"

import { motion } from "framer-motion"

export function Wrapped2023Slide({
  year = "2023",
  title = "Your Wrapped is here",
  subtitle = "Ready? Log in to reveal the artists, songs, and podcasts that ruled your listening this year.",
}: {
  year?: string
  title?: string
  subtitle?: string
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#FA5838] select-none flex flex-col items-center justify-between" style={{ color: "#000" }}>
      
      {/* --- BACKGROUND DECORATIVE ELEMENTS --- */}

      {/* 1. Holographic Gradient Box (Top Left) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
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
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: [0, 5, 0] }}
        transition={{ duration: 1, delay: 0.1 }}
        className="absolute z-10 pointer-events-none"
        style={{ left: "-12vw", top: "35vh" }}
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
      </motion.div>

      {/* 3. Pixel Flower (Top Left, bright green) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
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
      </motion.div>

      {/* 4. Pixel Flower (Middle Right, large, bright green) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
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
      </motion.div>

      {/* 5. Squiggly Ribbon (Top Right) */}
      <motion.div
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
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
      </motion.div>

      {/* 6. Squiggly Ribbon (Bottom Left) */}
      <motion.div
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
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
      </motion.div>


      {/* --- CONTENT LAYER --- */}
      
      {/* Top Header: Spotify Logo */}
      <div className="relative z-30 w-full flex flex-col items-center pt-8 md:pt-12">
        <div className="flex items-center gap-2">
          <svg className="fill-current" viewBox="0 0 24 24" style={{ color: "#000", width: "clamp(1.5rem, 4vw, 2.5rem)", height: "clamp(1.5rem, 4vw, 2.5rem)" }}>
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z" />
          </svg>
          <span className="font-display font-black tracking-tight" style={{ color: "#000", fontSize: "clamp(1.2rem, 3vw, 1.6rem)" }}>Spotify</span>
        </div>
      </div>

      {/* Main Center Typography: 2023 Wrapped */}
      <div className="relative z-30 flex flex-col items-center justify-center text-center flex-1 w-full mix-blend-normal">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 120 }}
          className="font-display font-black"
          style={{ 
            color: "#000", 
            fontSize: "clamp(6rem, 24vw, 16rem)", 
            letterSpacing: "-0.04em", 
            lineHeight: "0.85",
            marginBottom: "-0.05em"
          }}
        >
          {year}
        </motion.h1>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25, type: "spring", stiffness: 120 }}
          className="font-display font-black"
          style={{ 
            color: "#000", 
            fontSize: "clamp(4.5rem, 16vw, 11.5rem)", 
            letterSpacing: "-0.05em", 
            lineHeight: "0.85",
            marginTop: "-0.05em"
          }}
        >
          Wrapped
        </motion.h2>
      </div>

      {/* Bottom Subtitle / Tagline */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-30 flex flex-col items-center text-center pb-12 md:pb-16 px-4"
        style={{ maxWidth: "45rem" }}
      >
        <p className="font-display font-black mb-3 tracking-[-0.02em]" style={{ color: "#000", fontSize: "clamp(1.4rem, 4.5vw, 2.5rem)" }}>
          {title}
        </p>
        <p className="font-sans font-medium leading-snug opacity-90" style={{ color: "#000", fontSize: "clamp(0.75rem, 2vw, 1.1rem)", maxWidth: "85%" }}>
          {subtitle}
        </p>
      </motion.div>
    </div>
  )
}
