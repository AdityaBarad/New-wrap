"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const LOADING_MESSAGES = [
  "Scanning your chaos…",
  "Assembling the timeline…",
  "Analyzing your main character energy…",
  "Crafting your narrative arc…",
  "Adding dramatic pauses…",
  "Making it screenshot-worthy…",
  "Applying the Gen-Z filter…",
  "Generating your villain origin story…",
  "Finalizing the unhinged bits…",
  "Almost ready to go viral…",
]

const SPRING = { type: "spring", stiffness: 120, damping: 14 } as const

export function AiLoading({ accentColor }: { accentColor: string }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [dots, setDots] = useState("")

  // Cycle loading messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 2400)
    return () => clearInterval(interval)
  }, [])

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink">
      {/* Background rotating shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large rotating ring */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="size-[60vw] max-w-[400px] rounded-full border-[3px] opacity-15"
            style={{ borderColor: accentColor }}
          />
        </motion.div>

        {/* Second ring — counter-rotate */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="size-[45vw] max-w-[300px] rounded-full border-2 opacity-10"
            style={{ borderColor: "var(--wr-pink)" }}
          />
        </motion.div>

        {/* Floating cubes */}
        {[
          { size: 30, x: "15%", y: "20%", delay: 0, color: "var(--wr-green)" },
          { size: 22, x: "78%", y: "15%", delay: 0.5, color: "var(--wr-pink)" },
          { size: 40, x: "85%", y: "72%", delay: 1, color: "var(--wr-yellow)" },
          { size: 18, x: "10%", y: "75%", delay: 1.5, color: "var(--wr-purple)" },
          { size: 26, x: "55%", y: "85%", delay: 0.8, color: "var(--wr-orange)" },
        ].map((cube, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: cube.x, top: cube.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.6, 0.3, 0.6],
              scale: [0, 1, 0.8, 1],
              y: [0, -20, 0],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: cube.delay,
              ease: "easeInOut",
            }}
          >
            <div
              style={{
                width: cube.size,
                height: cube.size,
                backgroundColor: cube.color,
              }}
            />
          </motion.div>
        ))}

        {/* Pulsing gradient blob */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            width: "50vw",
            height: "50vw",
            maxWidth: 340,
            maxHeight: 340,
            background: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Spinner */}
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="size-16 rounded-full border-[3px] border-t-transparent"
            style={{ borderColor: `${accentColor}88`, borderTopColor: "transparent" }}
          />
          <div
            className="absolute inset-2 rounded-full border-2 border-b-transparent"
            style={{ borderColor: `var(--wr-cream)44`, borderBottomColor: "transparent" }}
          />
        </motion.div>

        {/* Brand */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.5, y: 0 }}
          className="font-display text-xs font-black uppercase tracking-[0.35em] text-cream"
        >
          Your Story, Wrapped
        </motion.p>

        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.2 }}
          className="font-display text-3xl font-black uppercase leading-none tracking-tight text-cream md:text-5xl"
        >
          Making it{" "}
          <span style={{ color: accentColor }}>yours</span>
          {dots}
        </motion.h2>

        {/* Cycling messages */}
        <div className="h-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 0.7, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="font-sans text-base font-semibold text-cream/70"
            >
              {LOADING_MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-64 overflow-hidden rounded-full bg-cream/10">
          <motion.div
            className="h-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 12, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  )
}
