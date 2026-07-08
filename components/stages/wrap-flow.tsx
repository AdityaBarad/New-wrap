"use client"

import { AnimatePresence, motion } from "framer-motion"
import { WrapProvider, useWrap } from "@/context/wrap-context"
import { StageOne } from "@/components/stages/stage-one"
import { StageTwo } from "@/components/stages/stage-two"
import { StageThree } from "@/components/stages/stage-three"

function Screens() {
  const { stage } = useWrap()

  if (stage === 3) return <StageThree />

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
