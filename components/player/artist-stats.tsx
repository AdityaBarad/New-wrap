"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Shell } from "@/components/player/pages"

const SPRING = { type: "spring", stiffness: 120, damping: 14 } as const

function useCountUp(target: number, duration = 1500) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
}

// AnimatedNumber removed as props are now strings

interface ArtistStatsCardProps {
  artistName: string
  photoUrl: string
  stat1Label: string
  stat1Value: string
  stat2Label: string
  stat2Value: string
  stat3Label: string
  stat3Value: string
  stat4Label: string
  stat4Value: string
}

export function ArtistStatsCard({
  artistName,
  photoUrl,
  stat1Label,
  stat1Value,
  stat2Label,
  stat2Value,
  stat3Label,
  stat3Value,
  stat4Label,
  stat4Value
}: ArtistStatsCardProps) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Cascading image effect constants
  const NUM_IMAGES = 6
  
  return (
    <Shell>
      <div className="flex h-full w-full flex-col justify-between bg-[#E9148C] px-6 py-10 md:px-12 md:py-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.2 }}
          className="flex items-center justify-between"
        >
          {/* Wrapsy for Artists Logo */}
          <div className="flex items-center gap-2 text-[#e4ff31]">
            <img
              src="/logo/logo-solid.jpeg"
              alt="Logo"
              className="size-8 object-contain rounded-[6px]"
              style={{ borderRadius: '6px' }}
            />
            <span className="font-sans text-xl font-bold tracking-tight">
              Wrapsy
            </span>
          </div>
          
          <div className="font-display text-sm font-bold tracking-widest text-[#e4ff31]">
            2026 WRAPPED
          </div>
        </motion.div>

        {/* Center Cascade Images */}
        <div className="relative mx-auto mt-12 flex h-[40vh] w-full max-w-sm items-center">
          {Array.from({ length: NUM_IMAGES }).map((_, i) => {
            const isFront = i === 0
            const zIndex = NUM_IMAGES - i
            
            // Calculate offsets for the cascade effect to keep it perfectly centered
            const scale = 1 - (i * 0.12)
            const baseMultiplier = isMobile ? 19 : 28
            const maxIndex = NUM_IMAGES - 1
            const totalWidthPercentOfImage = (maxIndex * baseMultiplier) + ((1 - maxIndex * 0.12) * 100)
            const containerWidthPercentOfImage = 100 / 0.75 // w-3/4 is 75% of container
            const initialLeftShift = (containerWidthPercentOfImage - totalWidthPercentOfImage) / 2
            
            const xOffset = (i * baseMultiplier) + initialLeftShift
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  x: `${xOffset}%`, 
                  scale: scale 
                }}
                transition={{ 
                  ...SPRING, 
                  delay: 0.4 + (NUM_IMAGES - i) * 0.1 
                }}
                className="absolute left-0 top-1/2 aspect-square w-3/4 -translate-y-1/2 overflow-hidden shadow-2xl"
                style={{ zIndex, transformOrigin: "left center" }}
              >
                {/* Fallback color if no image */}
                <div className="absolute inset-0 bg-[#e4ff31]/20" />
                {photoUrl && (
                  <img 
                    src={photoUrl} 
                    alt={artistName}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Stats Section */}
        <div className="mb-4 mt-auto space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 1.2 }}
            className="font-display text-5xl font-black tracking-tight text-[#e4ff31] md:text-7xl"
          >
            {artistName}
          </motion.h1>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 md:gap-2">
            {[
              { label: stat1Label, value: stat1Value, delay: 1.4 },
              { label: stat2Label, value: stat2Value, delay: 1.5 },
              { label: stat3Label, value: stat3Value, delay: 1.6 },
              { label: stat4Label, value: stat4Value, delay: 1.7 },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: stat.delay }}
                className="flex flex-col gap-1"
              >
                <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#0b0b0b] md:text-xs">
                  {stat.label}
                </span>
                <span className="font-display text-xl font-black text-[#e4ff31] md:text-3xl">
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </Shell>
  )
}
