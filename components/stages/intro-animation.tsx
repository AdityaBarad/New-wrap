"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const PATTERN = [
  { text: "#WRAPSYWRAPPED", bg: "var(--wr-yellow)", color: "var(--wr-purple)" },
  { text: "#WRAPSYWRAPPED", bg: "var(--wr-pink)", color: "var(--wr-ink)" },
  { text: "#WRAPSYWRAPPED", bg: "var(--wr-ink)", color: "var(--wr-yellow)" },
  { text: "#WRAPSYWRAPPED", bg: "var(--wr-green)", color: "var(--wr-ink)" },
  { text: "#WRAPSYWRAPPED", bg: "var(--wr-ink)", color: "var(--wr-green)" },
  { text: "#WRAPSYWRAPPED", bg: "var(--wr-purple)", color: "var(--wr-yellow)" },
]

const TEXT_ROWS = [
  ...PATTERN,
  ...PATTERN,
  ...PATTERN,
]

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter")

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase("hold"), 1400)
    const holdTimer = setTimeout(() => setPhase("exit"), 2600)
    const exitTimer = setTimeout(() => onComplete(), 3800)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(holdTimer)
      clearTimeout(exitTimer)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden bg-ink">
      <AnimatePresence>
        {phase !== "exit" && (
          <motion.div
            className="flex h-full w-full flex-col justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            {TEXT_ROWS.map((row, i) => (
              <motion.div
                key={i}
                className={`relative w-full overflow-hidden py-1 md:py-2 ${i >= 6 ? "md:hidden" : ""}`}
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 70,
                  damping: 18,
                  mass: 1.2,
                  delay: 0.1 + i * 0.04,
                }}
                style={{ willChange: "transform, opacity" }}
              >
                <div
                  className="flex w-[250%] items-center"
                  style={{ backgroundColor: row.bg }}
                >
                  <motion.span
                    className="whitespace-nowrap font-display text-[14vw] font-black uppercase leading-none tracking-tighter md:text-[10rem]"
                    style={{ color: row.color, willChange: "transform" }}
                    animate={{
                      x: [0, -150, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    {row.text}&nbsp;&nbsp;&nbsp;{row.text}&nbsp;&nbsp;&nbsp;{row.text}&nbsp;&nbsp;&nbsp;{row.text}&nbsp;&nbsp;&nbsp;{row.text}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flash overlay for dramatic effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.4, delay: 0.05 }}
      />

      {/* Purple reveal flash at the end */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-purple"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "exit" ? [0, 1, 0] : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </div>
  )
}
