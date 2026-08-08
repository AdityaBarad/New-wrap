"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function Wrapped2023Slide({
  year = "2026",
  title = "Your Wrapped is here",
  subtitle = "Ready to reveal the soundtrack of your era?",
}: {
  year?: string
  title?: string
  subtitle?: string
}) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return (
    <motion.div 
      className="relative h-full w-full overflow-hidden select-none flex flex-col items-center justify-between"
      animate={{ backgroundColor: ["#000000", "#000000", "#FA5838"] }}
      transition={{ duration: 3, times: [0, 0.66, 1], ease: "easeInOut" }}
      style={{ color: "#000" }}
    >

      {/* --- BACKGROUND DECORATIVE ELEMENTS --- */}
      
      {/* 0. Black Intro Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: "#000000", zIndex: 40 }}
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={{ duration: 3, times: [0, 0.66, 1], ease: "easeInOut" }}
      />

      {/* 2. Spiky Star Burst (Bottom Right) */}
      <motion.div
        className={`absolute pointer-events-none ${isMobile ? "z-20" : "z-50"}`}
        style={isMobile
          ? { right: "clamp(-60px, -2vw, 0px)", bottom: "35vh" }
          : { right: "clamp(-60px, -2vw, 0px)", bottom: "clamp(-80px, -10vh, 0px)" }
        }
        initial={{ opacity: 0, scale: 6, x: "-30vw", y: "-30vh" }}
        animate={{ 
          opacity: 1, 
          scale: [6, 6, 1], 
          x: ["-30vw", "-30vw", "0vw"], 
          y: ["-30vh", "-30vh", "0vh"] 
        }}
        transition={{ 
          opacity: { duration: 0.5 },
          default: { duration: 3, times: [0, 0.66, 1], ease: "easeInOut" }
        }}
      >
        <div 
          style={{ 
            transform: "rotateZ(-35deg) rotateX(65deg)", 
            transformOrigin: "center center", 
            display: "flex",
            transformStyle: "preserve-3d"
          }}
        >
          <motion.div
            animate={{ rotate: [0, 1080, 1440] }}
            transition={{ duration: 3, times: [0, 0.66, 1], ease: "easeInOut" }}
            style={{ transformOrigin: "center center", display: "flex" }}
          >
            <motion.svg 
              viewBox="0 0 200 200" 
              fill="none" 
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{ 
                width: "clamp(200px, 50vw, 500px)", 
                height: "clamp(200px, 50vw, 500px)",
                transformOrigin: "center center"
              }}
            >
            <defs>
              <radialGradient id="starGradLeft" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#39FF14" />
                <stop offset="25%" stopColor="#39FF14" />
                <stop offset="45%" stopColor="#FF2A00" />
                <stop offset="70%" stopColor="#8A2BE2" />
                <stop offset="100%" stopColor="#5B00FF" />
              </radialGradient>
            </defs>
            <path
              d="M 200.0 100.0 L 134.7 104.6 L 172.4 119.4 L 132.3 113.4 L 186.6 150.0 L 127.8 121.3 L 153.0 153.0 L 121.3 127.8 L 150.0 186.6 L 113.4 132.3 L 119.4 172.4 L 104.6 134.7 L 100.0 200.0 L 95.4 134.7 L 80.6 172.4 L 86.6 132.3 L 50.0 186.6 L 78.7 127.8 L 47.0 153.0 L 72.2 121.3 L 13.4 150.0 L 67.7 113.4 L 27.6 119.4 L 65.3 104.6 L 0.0 100.0 L 65.3 95.4 L 27.6 80.6 L 67.7 86.6 L 13.4 50.0 L 72.2 78.7 L 47.0 47.0 L 78.7 72.2 L 50.0 13.4 L 86.6 67.7 L 80.6 27.6 L 95.4 65.3 L 100.0 0.0 L 104.6 65.3 L 119.4 27.6 L 113.4 67.7 L 150.0 13.4 L 121.3 72.2 L 153.0 47.0 L 127.8 78.7 L 186.6 50.0 L 132.3 86.6 L 172.4 80.6 L 134.7 95.4 Z"
              fill="url(#starGradLeft)"
            />
            </motion.svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Fade-in wrapper for rest of slide elements (hidden during 2s star intro) */}
      <motion.div
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-between pointer-events-auto z-10"
        animate={{ opacity: [0, 0, 1] }}
        transition={{ duration: 3, times: [0, 0.66, 1], ease: "easeInOut" }}
      >
        {/* 1. Holographic Gradient Box (Center-Right) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: [
            "saturate(1.6) brightness(1.15) hue-rotate(0deg)",
            "saturate(1.9) brightness(1.25) hue-rotate(40deg)",
            "saturate(1.6) brightness(1.15) hue-rotate(0deg)"
          ]
        }}
        transition={{
          opacity: { duration: 0.8, ease: "easeOut" },
          scale: { duration: 0.8, ease: "easeOut" },
          filter: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute z-0"
        style={{
          right: 0,
          top: 0,
          width: "45%",
          height: "45%",
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.55) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 70%, rgba(167,139,250,0.8) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 10%, rgba(110,198,245,0.9) 0%, transparent 45%),
            linear-gradient(135deg, #38BDF8 0%, #818CF8 25%, #C084FC 50%, #34D399 75%, #A3E635 100%)
          `,
        }}
      />
        {/* 3. Pixel Flower (Top Left, bright green) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, y: [0, -14, 0] }}
        transition={{
          opacity: { duration: 0.8, delay: 0.2 },
          scale: { duration: 0.8, delay: 0.2 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
        }}
        className="absolute z-10 pointer-events-none"
        style={{ left: "clamp(-20px, 4vw, 40px)", top: "clamp(-20px, 4vh, 40px)" }}
      >
        <svg viewBox="0 0 64 64" fill="none" style={{ width: isMobile ? "clamp(280px, 75vw, 500px)" : "clamp(160px, 35vw, 500px)", height: isMobile ? "clamp(280px, 75vw, 500px)" : "clamp(160px, 35vw, 500px)" }}>
          <path
            d="M37 2h1v1h-1Z M38 2h1v1h-1Z M39 2h1v1h-1Z M36 3h1v1h-1Z M37 3h1v1h-1Z M38 3h1v1h-1Z M39 3h1v1h-1Z M35 4h1v1h-1Z M36 4h1v1h-1Z M37 4h1v1h-1Z M38 4h1v1h-1Z M39 4h1v1h-1Z M35 5h1v1h-1Z M39 5h1v1h-1Z M40 5h1v1h-1Z M15 6h1v1h-1Z M16 6h1v1h-1Z M34 6h1v1h-1Z M35 6h1v1h-1Z M39 6h1v1h-1Z M40 6h1v1h-1Z M14 7h1v1h-1Z M15 7h1v1h-1Z M16 7h1v1h-1Z M17 7h1v1h-1Z M18 7h1v1h-1Z M34 7h1v1h-1Z M40 7h1v1h-1Z M14 8h1v1h-1Z M15 8h1v1h-1Z M16 8h1v1h-1Z M17 8h1v1h-1Z M18 8h1v1h-1Z M19 8h1v1h-1Z M34 8h1v1h-1Z M40 8h1v1h-1Z M14 9h1v1h-1Z M15 9h1v1h-1Z M20 9h1v1h-1Z M33 9h1v1h-1Z M40 9h1v1h-1Z M15 10h1v1h-1Z M21 10h1v1h-1Z M33 10h1v1h-1Z M40 10h1v1h-1Z M15 11h1v1h-1Z M22 11h1v1h-1Z M33 11h1v1h-1Z M15 12h1v1h-1Z M23 12h1v1h-1Z M16 13h1v1h-1Z M32 13h1v1h-1Z M39 13h1v1h-1Z M16 14h1v1h-1Z M24 14h1v1h-1Z M32 14h1v1h-1Z M39 14h1v1h-1Z M55 14h1v1h-1Z M56 14h1v1h-1Z M57 14h1v1h-1Z M17 15h1v1h-1Z M25 15h1v1h-1Z M32 15h1v1h-1Z M39 15h1v1h-1Z M52 15h1v1h-1Z M53 15h1v1h-1Z M54 15h1v1h-1Z M55 15h1v1h-1Z M56 15h1v1h-1Z M57 15h1v1h-1Z M58 15h1v1h-1Z M17 16h1v1h-1Z M39 16h1v1h-1Z M50 16h1v1h-1Z M51 16h1v1h-1Z M56 16h1v1h-1Z M57 16h1v1h-1Z M58 16h1v1h-1Z M18 17h1v1h-1Z M26 17h1v1h-1Z M48 17h1v1h-1Z M49 17h1v1h-1Z M56 17h1v1h-1Z M57 17h1v1h-1Z M47 18h1v1h-1Z M56 18h1v1h-1Z M57 18h1v1h-1Z M19 19h1v1h-1Z M38 19h1v1h-1Z M45 19h1v1h-1Z M56 19h1v1h-1Z M20 20h1v1h-1Z M28 20h1v1h-1Z M31 20h1v1h-1Z M44 20h1v1h-1Z M55 20h1v1h-1Z M31 21h1v1h-1Z M42 21h1v1h-1Z M54 21h1v1h-1Z M21 22h1v1h-1Z M29 22h1v1h-1Z M31 22h1v1h-1Z M37 22h1v1h-1Z M41 22h1v1h-1Z M53 22h1v1h-1Z M22 23h1v1h-1Z M31 23h1v1h-1Z M40 23h1v1h-1Z M52 23h1v1h-1Z M5 24h1v1h-1Z M6 24h1v1h-1Z M7 24h1v1h-1Z M8 24h1v1h-1Z M9 24h1v1h-1Z M10 24h1v1h-1Z M23 24h1v1h-1Z M30 24h1v1h-1Z M31 24h1v1h-1Z M39 24h1v1h-1Z M50 24h1v1h-1Z M2 25h1v1h-1Z M3 25h1v1h-1Z M4 25h1v1h-1Z M5 25h1v1h-1Z M6 25h1v1h-1Z M13 25h1v1h-1Z M14 25h1v1h-1Z M15 25h1v1h-1Z M16 25h1v1h-1Z M24 25h1v1h-1Z M30 25h1v1h-1Z M31 25h1v1h-1Z M36 25h1v1h-1Z M49 25h1v1h-1Z M2 26h1v1h-1Z M3 26h1v1h-1Z M4 26h1v1h-1Z M19 26h1v1h-1Z M31 26h1v1h-1Z M36 26h1v1h-1Z M47 26h1v1h-1Z M2 27h1v1h-1Z M3 27h1v1h-1Z M4 27h1v1h-1Z M22 27h1v1h-1Z M31 27h1v1h-1Z M35 27h1v1h-1Z M3 28h1v1h-1Z M4 28h1v1h-1Z M25 28h1v1h-1Z M26 28h1v1h-1Z M44 28h1v1h-1Z M4 29h1v1h-1Z M5 29h1v1h-1Z M6 29h1v1h-1Z M27 29h1v1h-1Z M42 29h1v1h-1Z M6 30h1v1h-1Z M7 30h1v1h-1Z M8 30h1v1h-1Z M39 30h1v1h-1Z M40 30h1v1h-1Z M9 31h1v1h-1Z M10 31h1v1h-1Z M11 31h1v1h-1Z M37 31h1v1h-1Z M38 31h1v1h-1Z M39 31h1v1h-1Z M40 31h1v1h-1Z M41 31h1v1h-1Z M42 31h1v1h-1Z M43 31h1v1h-1Z M44 31h1v1h-1Z M13 32h1v1h-1Z M14 32h1v1h-1Z M15 32h1v1h-1Z M49 32h1v1h-1Z M50 32h1v1h-1Z M51 32h1v1h-1Z M20 33h1v1h-1Z M21 33h1v1h-1Z M22 33h1v1h-1Z M23 33h1v1h-1Z M24 33h1v1h-1Z M25 33h1v1h-1Z M26 33h1v1h-1Z M27 33h1v1h-1Z M53 33h1v1h-1Z M54 33h1v1h-1Z M55 33h1v1h-1Z M24 34h1v1h-1Z M25 34h1v1h-1Z M56 34h1v1h-1Z M57 34h1v1h-1Z M58 34h1v1h-1Z M22 35h1v1h-1Z M37 35h1v1h-1Z M58 35h1v1h-1Z M59 35h1v1h-1Z M60 35h1v1h-1Z M20 36h1v1h-1Z M38 36h1v1h-1Z M39 36h1v1h-1Z M60 36h1v1h-1Z M61 36h1v1h-1Z M29 37h1v1h-1Z M33 37h1v1h-1Z M42 37h1v1h-1Z M60 37h1v1h-1Z M61 37h1v1h-1Z M62 37h1v1h-1Z M17 38h1v1h-1Z M28 38h1v1h-1Z M33 38h1v1h-1Z M45 38h1v1h-1Z M60 38h1v1h-1Z M61 38h1v1h-1Z M62 38h1v1h-1Z M15 39h1v1h-1Z M28 39h1v1h-1Z M33 39h1v1h-1Z M34 39h1v1h-1Z M40 39h1v1h-1Z M48 39h1v1h-1Z M49 39h1v1h-1Z M50 39h1v1h-1Z M51 39h1v1h-1Z M58 39h1v1h-1Z M59 39h1v1h-1Z M60 39h1v1h-1Z M61 39h1v1h-1Z M62 39h1v1h-1Z M14 40h1v1h-1Z M25 40h1v1h-1Z M33 40h1v1h-1Z M34 40h1v1h-1Z M41 40h1v1h-1Z M54 40h1v1h-1Z M55 40h1v1h-1Z M56 40h1v1h-1Z M57 40h1v1h-1Z M58 40h1v1h-1Z M59 40h1v1h-1Z M12 41h1v1h-1Z M24 41h1v1h-1Z M33 41h1v1h-1Z M42 41h1v1h-1Z M11 42h1v1h-1Z M23 42h1v1h-1Z M27 42h1v1h-1Z M33 42h1v1h-1Z M35 42h1v1h-1Z M43 42h1v1h-1Z M10 43h1v1h-1Z M22 43h1v1h-1Z M33 43h1v1h-1Z M9 44h1v1h-1Z M20 44h1v1h-1Z M33 44h1v1h-1Z M36 44h1v1h-1Z M44 44h1v1h-1Z M8 45h1v1h-1Z M19 45h1v1h-1Z M26 45h1v1h-1Z M45 45h1v1h-1Z M7 46h1v1h-1Z M8 46h1v1h-1Z M17 46h1v1h-1Z M7 47h1v1h-1Z M8 47h1v1h-1Z M15 47h1v1h-1Z M16 47h1v1h-1Z M38 47h1v1h-1Z M46 47h1v1h-1Z M6 48h1v1h-1Z M7 48h1v1h-1Z M8 48h1v1h-1Z M13 48h1v1h-1Z M14 48h1v1h-1Z M25 48h1v1h-1Z M47 48h1v1h-1Z M6 49h1v1h-1Z M7 49h1v1h-1Z M8 49h1v1h-1Z M9 49h1v1h-1Z M10 49h1v1h-1Z M11 49h1v1h-1Z M12 49h1v1h-1Z M25 49h1v1h-1Z M32 49h1v1h-1Z M39 49h1v1h-1Z M47 49h1v1h-1Z M7 50h1v1h-1Z M8 50h1v1h-1Z M9 50h1v1h-1Z M25 50h1v1h-1Z M32 50h1v1h-1Z M40 50h1v1h-1Z M48 50h1v1h-1Z M25 51h1v1h-1Z M32 51h1v1h-1Z M48 51h1v1h-1Z M41 52h1v1h-1Z M49 52h1v1h-1Z M31 53h1v1h-1Z M42 53h1v1h-1Z M49 53h1v1h-1Z M24 54h1v1h-1Z M31 54h1v1h-1Z M43 54h1v1h-1Z M49 54h1v1h-1Z M24 55h1v1h-1Z M31 55h1v1h-1Z M44 55h1v1h-1Z M49 55h1v1h-1Z M50 55h1v1h-1Z M24 56h1v1h-1Z M30 56h1v1h-1Z M45 56h1v1h-1Z M46 56h1v1h-1Z M47 56h1v1h-1Z M48 56h1v1h-1Z M49 56h1v1h-1Z M50 56h1v1h-1Z M24 57h1v1h-1Z M30 57h1v1h-1Z M46 57h1v1h-1Z M47 57h1v1h-1Z M48 57h1v1h-1Z M49 57h1v1h-1Z M50 57h1v1h-1Z M24 58h1v1h-1Z M25 58h1v1h-1Z M29 58h1v1h-1Z M30 58h1v1h-1Z M48 58h1v1h-1Z M49 58h1v1h-1Z M24 59h1v1h-1Z M25 59h1v1h-1Z M29 59h1v1h-1Z M25 60h1v1h-1Z M26 60h1v1h-1Z M27 60h1v1h-1Z M28 60h1v1h-1Z M29 60h1v1h-1Z M25 61h1v1h-1Z M26 61h1v1h-1Z M27 61h1v1h-1Z M28 61h1v1h-1Z M25 62h1v1h-1Z M26 62h1v1h-1Z M27 62h1v1h-1Z"
            fill="#39FF14"
            stroke="#39FF14"
            strokeWidth="0.5"
            shapeRendering="crispEdges"
          />
        </svg>
      </motion.div>



      {/* 5. Squiggly Ribbon (Left Strip) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
        transition={{
          opacity: { duration: 1, delay: 0.4 },
          scale: { duration: 1, delay: 0.4 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        <svg viewBox="0 0 1920 1080" preserveAspectRatio="none" fill="none" className="w-full h-full" style={{ filter: "drop-shadow(6px 12px 15px rgba(0,0,0,0.4))" }}>
          <defs>
            <linearGradient id="ribbonGradLeft" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#7F00FF" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>
          </defs>
          <path d="M 0 200 C 600 100, 600 400, 250 400 C 100 400, 100 650, 250 650 C 500 650, 400 900, 0 850" stroke="#101010" strokeWidth="50" strokeLinecap="round" />
          <path d="M 0 200 C 600 100, 600 400, 250 400 C 100 400, 100 650, 250 650 C 500 650, 400 900, 0 850" stroke="url(#ribbonGradLeft)" strokeWidth="32" strokeLinecap="round" style={{ transform: "translate(-4px, -4px)" }} />
          <path d="M 0 200 C 600 100, 600 400, 250 400 C 100 400, 100 650, 250 650 C 500 650, 400 900, 0 850" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" style={{ transform: "translate(-8px, -8px)" }} />
        </svg>
      </motion.div>

      {/* 6. Squiggly Ribbon (Right Strip) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
        transition={{
          opacity: { duration: 1, delay: 0.5 },
          scale: { duration: 1, delay: 0.5 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
        }}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        <svg viewBox="0 0 1920 1080" preserveAspectRatio="none" fill="none" className="w-full h-full" style={{ filter: "drop-shadow(-6px 12px 15px rgba(0,0,0,0.4))" }}>
          <defs>
            <linearGradient id="ribbonGradRight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#39FF14" />
              <stop offset="50%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#39FF14" />
            </linearGradient>
          </defs>
          <path d="M 1400 0 C 1400 300, 900 200, 1100 500 C 1300 500, 1300 700, 1150 700 C 1000 700, 1000 900, 1920 800" stroke="#101010" strokeWidth="50" strokeLinecap="round" />
          <path d="M 1400 0 C 1400 300, 900 200, 1100 500 C 1300 500, 1300 700, 1150 700 C 1000 700, 1000 900, 1920 800" stroke="url(#ribbonGradRight)" strokeWidth="32" strokeLinecap="round" style={{ transform: "translate(-4px, -4px)" }} />
          <path d="M 1400 0 C 1400 300, 900 200, 1100 500 C 1300 500, 1300 700, 1150 700 C 1000 700, 1000 900, 1920 800" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" style={{ transform: "translate(-8px, -8px)" }} />
        </svg>
      </motion.div>


      {/* --- CONTENT LAYER --- */}
      </motion.div>

      {/* Fade-in wrapper for CONTENT (hidden during 2s star intro) */}
      <motion.div
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-between pointer-events-auto z-30"
        animate={{ opacity: [0, 0, 1] }}
        transition={{ duration: 3, times: [0, 0.66, 1], ease: "easeInOut" }}
      >

      {/* Top Header: Wrapsy Logo */}
      <div className="relative z-30 w-full flex flex-col items-center pt-8 md:pt-12">
        <div className="flex items-center gap-2">
          <img
            src="/logo/logo-solid.jpeg"
            alt="Wrapsy"
            className="object-contain rounded-[6px]"
            style={{ width: "clamp(1.5rem, 4vw, 2.5rem)", height: "clamp(1.5rem, 4vw, 2.5rem)", borderRadius: "6px" }}
          />
          <span className="font-display font-black tracking-tight" style={{ color: "#000", fontSize: "clamp(1.2rem, 3vw, 1.6rem)" }}>Wrapsy</span>
        </div>
      </div>

      {/* Main Center Typography */}
      <div className="relative z-30 flex flex-col items-center justify-center text-center flex-1 w-full mix-blend-normal">
        <div style={{ background: "#FA5838", padding: "0.2em 0.4em", display: "inline-block" }}>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 120 }}
            className="font-display font-black"
            style={{
              color: "#000",
              fontSize: "clamp(2.5rem, 8vw, 6rem)", // Scaled down for "Unlock Your"
              letterSpacing: "-0.05em",
              lineHeight: "0.85",
              marginBottom: "-0.05em",
              textTransform: "uppercase"
            }}
          >
            Unlock Your
          </motion.h1>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25, type: "spring", stiffness: 120 }}
            className="font-display font-black"
            style={{
              color: "#000",
              fontSize: "clamp(2.8rem, 9vw, 6.5rem)", // Scaled down for "Personality"
              letterSpacing: "-0.05em",
              lineHeight: "0.85",
              marginTop: "-0.05em",
              textTransform: "uppercase"
            }}
          >
            Personality
          </motion.h2>
        </div>
      </div>

      {/* Bottom Subtitle / Tagline */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-30 flex flex-col items-center text-center pb-12 md:pb-16 px-4"
        style={{ maxWidth: "45rem" }}
      >
        <div style={{ background: "#FA5838", padding: "0.3em 0.6em", display: "inline-block" }}>
          <p className="font-display font-black mb-3 tracking-[-0.02em]" style={{ color: "#000", fontSize: "clamp(1.2rem, 3.5vw, 2.0rem)" }}>
            {title}
          </p>
          <p className="font-sans font-medium leading-snug opacity-90" style={{ color: "#000", fontSize: "clamp(0.7rem, 1.5vw, 0.95rem)", maxWidth: "85%" }}>
            {subtitle}
          </p>
        </div>
      </motion.div>
      </motion.div>
    </motion.div>
  )
}
