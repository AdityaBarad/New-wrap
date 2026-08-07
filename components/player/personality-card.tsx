"use client"

import { useState, useEffect } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"

function CardBack() {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-xl border-[3px] border-black"
      style={{
        background: `
          radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.55) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 70%, rgba(167,139,250,0.8) 0%, transparent 50%),
          radial-gradient(ellipse at 60% 10%, rgba(110,198,245,0.9) 0%, transparent 45%),
          linear-gradient(135deg, #38BDF8 0%, #818CF8 25%, #C084FC 50%, #34D399 75%, #A3E635 100%)
        `,
      }}
    >
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.6) 25%, transparent 30%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
      />
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
  const scale = useTransform(flipProgress, [0, 50, 90, 130, 180], [1, 1, 1, 1, 1])

  const backOpacity = useTransform(flipProgress, [0, 89, 90, 180], [1, 1, 0, 0])
  const frontOpacity = useTransform(flipProgress, [0, 89, 90, 180], [0, 0, 1, 1])

  const rotateY = useTransform(flipProgress, (v) => v)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("flipping")
      animate(flipProgress, 180, {
        duration: 3.5, // much slower
        ease: [0.25, 1, 0.5, 1], // smoother, less bouncy ease for a slow reveal
        onComplete: () => {
          setPhase("done")
          setShowFront(true)
        },
      })
    }, 500) // flip almost immediately upon mounting

    const unsubscribe = flipProgress.on("change", (v) => {
      setShowFront(v >= 90)
    })

    return () => {
      clearTimeout(timer)
      unsubscribe()
    }
  }, [flipProgress])

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
      animate={{ backgroundColor: ["#FA5838", "#FA5838", "#050505"] }}
      transition={{ duration: 1, times: [0, 0.2, 1], ease: "easeInOut" }}
      style={{ color: "#000" }}
    >
      {/* --- BACKGROUND DECORATIVE ELEMENTS (Static from previous slide) --- */}
      
      {/* 1. Holographic Gradient Box (Center-Right) */}
      <motion.div
        className="absolute z-0 pointer-events-none"
        animate={{
          filter: [
            "saturate(1.6) brightness(1.15) hue-rotate(0deg)",
            "saturate(1.9) brightness(1.25) hue-rotate(40deg)",
            "saturate(1.6) brightness(1.15) hue-rotate(0deg)"
          ]
        }}
        transition={{
          filter: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
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

      {/* 2. Spiky Star Burst (Bottom Right) */}
      <motion.div
        className={`absolute pointer-events-none ${isMobile ? "z-20" : "z-50"}`}
        style={isMobile
          ? { right: "clamp(-60px, -2vw, 0px)", bottom: "35vh" }
          : { right: "clamp(-60px, -2vw, 0px)", bottom: "clamp(-80px, -10vh, 0px)" }
        }
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
            style={{ transformOrigin: "center center", display: "flex", rotate: 1440 }} // Final state from previous slide
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
              <radialGradient id="starGradLeft2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#39FF14" />
                <stop offset="25%" stopColor="#39FF14" />
                <stop offset="45%" stopColor="#FF2A00" />
                <stop offset="70%" stopColor="#8A2BE2" />
                <stop offset="100%" stopColor="#5B00FF" />
              </radialGradient>
            </defs>
            <path
              d="M 200.0 100.0 L 134.7 104.6 L 172.4 119.4 L 132.3 113.4 L 186.6 150.0 L 127.8 121.3 L 153.0 153.0 L 121.3 127.8 L 150.0 186.6 L 113.4 132.3 L 119.4 172.4 L 104.6 134.7 L 100.0 200.0 L 95.4 134.7 L 80.6 172.4 L 86.6 132.3 L 50.0 186.6 L 78.7 127.8 L 47.0 153.0 L 72.2 121.3 L 13.4 150.0 L 67.7 113.4 L 27.6 119.4 L 65.3 104.6 L 0.0 100.0 L 65.3 95.4 L 27.6 80.6 L 67.7 86.6 L 13.4 50.0 L 72.2 78.7 L 47.0 47.0 L 78.7 72.2 L 50.0 13.4 L 86.6 67.7 L 80.6 27.6 L 95.4 65.3 L 100.0 0.0 L 104.6 65.3 L 119.4 27.6 L 113.4 67.7 L 150.0 13.4 L 121.3 72.2 L 153.0 47.0 L 127.8 78.7 L 186.6 50.0 L 132.3 86.6 L 172.4 80.6 L 134.7 95.4 Z"
              fill="url(#starGradLeft2)"
            />
            </motion.svg>
          </motion.div>
        </div>
      </motion.div>

      {/* 3. Pixel Flower (Top Left, bright green) */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
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
        animate={{ y: [0, -10, 0] }}
        transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        <svg viewBox="0 0 1920 1080" preserveAspectRatio="none" fill="none" className="w-full h-full" style={{ filter: "drop-shadow(6px 12px 15px rgba(0,0,0,0.4))" }}>
          <defs>
            <linearGradient id="ribbonGradLeft3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#7F00FF" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>
          </defs>
          <path d="M 0 200 C 600 100, 600 400, 250 400 C 100 400, 100 650, 250 650 C 500 650, 400 900, 0 850" stroke="#101010" strokeWidth="50" strokeLinecap="round" />
          <path d="M 0 200 C 600 100, 600 400, 250 400 C 100 400, 100 650, 250 650 C 500 650, 400 900, 0 850" stroke="url(#ribbonGradLeft3)" strokeWidth="32" strokeLinecap="round" style={{ transform: "translate(-4px, -4px)" }} />
          <path d="M 0 200 C 600 100, 600 400, 250 400 C 100 400, 100 650, 250 650 C 500 650, 400 900, 0 850" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" style={{ transform: "translate(-8px, -8px)" }} />
        </svg>
      </motion.div>

      {/* 6. Squiggly Ribbon (Right Strip) */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 } }}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        <svg viewBox="0 0 1920 1080" preserveAspectRatio="none" fill="none" className="w-full h-full" style={{ filter: "drop-shadow(-6px 12px 15px rgba(0,0,0,0.4))" }}>
          <defs>
            <linearGradient id="ribbonGradRight4" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#39FF14" />
              <stop offset="50%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#39FF14" />
            </linearGradient>
          </defs>
          <path d="M 1400 0 C 1400 300, 900 200, 1100 500 C 1300 500, 1300 700, 1150 700 C 1000 700, 1000 900, 1920 800" stroke="#101010" strokeWidth="50" strokeLinecap="round" />
          <path d="M 1400 0 C 1400 300, 900 200, 1100 500 C 1300 500, 1300 700, 1150 700 C 1000 700, 1000 900, 1920 800" stroke="url(#ribbonGradRight4)" strokeWidth="32" strokeLinecap="round" style={{ transform: "translate(-4px, -4px)" }} />
          <path d="M 1400 0 C 1400 300, 900 200, 1100 500 C 1300 500, 1300 700, 1150 700 C 1000 700, 1000 900, 1920 800" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" style={{ transform: "translate(-8px, -8px)" }} />
        </svg>
      </motion.div>

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

      {/* Main Card Content */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center z-30 pt-16 px-6 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div
          className="relative w-full max-w-[18rem]"
          style={{ perspective: "1400px", perspectiveOrigin: "center 40%" }}
        >
          <motion.div
            className="relative w-full"
            style={{ aspectRatio: "2/3", rotateX, scale, rotateY }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ opacity: backOpacity }}
            >
              <CardBack />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              style={{ opacity: frontOpacity, rotateY: 180 }}
            >
              <CardFront imageUrl={imageUrl} title={title} />
            </motion.div>
          </motion.div>
        </div>

        <div style={{ background: "#050505", padding: "0.3em 0.6em", display: "inline-block", marginTop: "2rem", border: "3px solid #050505" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showFront ? 1 : 0, y: showFront ? 0 : 20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center"
          >
            <h2 className="font-display text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
              {title}
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: showFront ? 1 : 0, y: showFront ? 0 : 16 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-sm text-center font-sans text-[clamp(0.85rem,3vw,1rem)] font-medium leading-relaxed tracking-wide text-white md:text-base"
          >
            {description}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  )
}
