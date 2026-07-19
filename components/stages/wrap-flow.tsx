"use client"

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { WrapProvider, useWrap } from "@/context/wrap-context"
import { StageOne } from "@/components/stages/stage-one"
import { StageTwo } from "@/components/stages/stage-two"
import { StageThree } from "@/components/stages/stage-three"
import { IntroAnimation } from "@/components/stages/intro-animation"
import { YoutubePlayer } from "@/components/wrapped/youtube-player"

function Screens() {
  const { stage, data } = useWrap()
  const [introComplete, setIntroComplete] = useState(false)

  // Reset intro when stage goes back to 1 (user starts over)
  useEffect(() => {
    if (stage === 1) setIntroComplete(false)
  }, [stage])

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true)
  }, [])

  // Stage 3: Show intro animation first, then the wrap result
  if (stage === 3) {
    return (
      <>
        <AnimatePresence>
          {!introComplete && (
            <IntroAnimation onComplete={handleIntroComplete} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {introComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.1 }}
            >
              <StageThree />
            </motion.div>
          )}
        </AnimatePresence>
        
        {data.song && <YoutubePlayer videoId={data.song.videoId} />}
      </>
    )
  }

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-ink">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ type: "spring", stiffness: 240, damping: 26 }}
        >
          {stage === 1 ? <StageOne /> : <StageTwo />}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}

export function WrapFlow() {
  return (
    <WrapProvider>
      <Screens />
    </WrapProvider>
  )
}
