"use client"

import { IntroAnimation } from "@/components/stages/intro-animation"
import { StageThree } from "@/components/stages/stage-three"
import { YoutubePlayer } from "@/components/wrapped/youtube-player"
import type { WrapData } from "@/context/wrap-context"
import type { AiWrapContent } from "@/lib/ai-types"
import { WrapProvider } from "@/context/wrap-context"
import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

type Props = {
  wrapData: WrapData
  aiContent: AiWrapContent
  personalityImageUrl: string | null
  slug: string
  views: number
}

export function WrapViewer({ wrapData, aiContent, personalityImageUrl, slug, views }: Props) {
  const [wrapUrl, setWrapUrl] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [introComplete, setIntroComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true)
  }, [])

  useEffect(() => {
    setWrapUrl(window.location.href)
  }, [])

  return (
    <WrapProvider
      initialWrapData={wrapData}
      initialAiContent={aiContent}
      initialImageUrl={personalityImageUrl}
      initialWrapSlug={slug}
      initialWrapUrl={wrapUrl || `https://yourlifewrapped.com/wrap/${slug}`}
    >
      <div className="fixed inset-0 bg-[#0b0b0b]">
        {!hasStarted ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#101010] px-6 text-center"
            >
              {/* Decorative blobs */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -left-1/4 -top-1/4 h-[70vmin] w-[70vmin] rounded-full bg-gradient-to-br from-orange to-pink opacity-40 blur-[80px]" />
                <div className="absolute -bottom-1/4 -right-1/4 h-[70vmin] w-[70vmin] rounded-full bg-gradient-to-br from-green to-yellow opacity-30 blur-[80px]" />
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-display text-sm font-black uppercase tracking-[0.3em] text-green sm:text-base"
                >
                  Ready for the recap?
                </motion.p>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 font-display text-[3.5rem] font-black leading-[0.9] tracking-tight text-cream sm:text-[5rem]"
                >
                  {aiContent.intro?.lines?.[0] || wrapData.name}
                  <br />
                  <span className="text-cream/40">Wrapped</span>
                </motion.h1>

                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200, damping: 20 }}
                  onClick={() => setHasStarted(true)}
                  className="mt-12 rounded-full bg-cream px-10 py-4 font-sans text-sm font-bold uppercase tracking-widest text-ink transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(238,238,228,0.3)]"
                >
                  Unwrap
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
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
                  className="absolute inset-0"
                >
                  <StageThree isPaused={isPaused} setIsPaused={setIsPaused} />
                </motion.div>
              )}
            </AnimatePresence>
            
            {wrapData.song && <YoutubePlayer videoId={wrapData.song.videoId} isPaused={isPaused} />}
          </>
        )}
      </div>
    </WrapProvider>
  )
}
