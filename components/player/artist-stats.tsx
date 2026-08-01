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
  streams: string
  hours: string
  listeners: string
  countries: string
}

export function ArtistStatsCard({
  artistName,
  photoUrl,
  streams,
  hours,
  listeners,
  countries
}: ArtistStatsCardProps) {
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
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-8">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 17.3c-.2.3-.6.4-.9.2-2.5-1.5-5.7-1.9-9.5-1-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 4.2-1 7.7-.5 10.5 1.2.3.2.4.6.3.8zm1.3-2.9c-.3.4-.8.5-1.2.2-2.9-1.8-7.3-2.4-10.9-1.3-.5.1-1-.2-1.1-.6-.1-.5.2-1 .6-1.1 4.1-1.2 9-1.1 12.3 1 1 .5 1.2 1 .9 1.4zm.1-3c-3.5-2.1-9.2-2.3-12.5-1.3-.6.2-1.2-.2-1.4-.8-.2-.6.2-1.2.8-1.4 3.9-1.1 10.2-.9 14.3 1.6.5.3.7.9.4 1.4-.3.5-.9.7-1.5.4z" />
            </svg>
            <span className="font-sans text-xl font-bold tracking-tight">
              Wrapsy. <span className="font-normal opacity-90">for Artists</span>
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
            
            // Calculate offsets for the cascade effect
            const scale = 1 - (i * 0.12)
            const xOffset = i * 28 // percentage shift to the right
            
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

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "STREAMS", value: streams, delay: 1.4 },
              { label: "HOURS", value: hours, delay: 1.5 },
              { label: "LISTENERS", value: listeners, delay: 1.6 },
              { label: "COUNTRIES", value: countries, delay: 1.7 },
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
