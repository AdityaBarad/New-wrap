"use client"

import { AnimatePresence, motion } from "framer-motion"
import { WrapProvider, useWrap, PURPOSES } from "@/context/wrap-context"
import { StageOne } from "@/components/stages/stage-one"
import { StageTwo } from "@/components/stages/stage-two"
import { StageThreePayment } from "@/components/stages/stage-three-payment"
import { StageFourBasicSuccess } from "@/components/stages/stage-four-basic-success"
import { AiLoading } from "@/components/stages/ai-loading"

function Screens() {
  const { stage, data, aiLoading } = useWrap()

  // Stage 4: Generation Loading & Basic Success
  if (stage === 4) {
    if (aiLoading) {
      return <AiLoading accentColor={data.purpose ? (PURPOSES.find(p => p.id === data.purpose)?.color || "var(--wr-orange)") : "var(--wr-orange)"} />
    }
    return <StageFourBasicSuccess />
  }

  // Stage 3: Payment
  if (stage === 3) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ type: "spring", stiffness: 240, damping: 26 }}
        >
          <StageThreePayment />
        </motion.div>
      </AnimatePresence>
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
