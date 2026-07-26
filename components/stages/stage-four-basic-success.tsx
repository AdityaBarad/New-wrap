"use client"

import { motion } from "@/components/wrapped/motion"
import { CheckCircle2 } from "lucide-react"
import { useWrap } from "@/context/wrap-context"

export function StageFourBasicSuccess() {
  const { data } = useWrap()

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-ink px-4 py-12 flex items-center justify-center md:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-lg rounded-3xl border-4 border-foreground/10 bg-card p-10 text-center shadow-xl"
      >
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green/20">
          <CheckCircle2 className="size-10 text-green" />
        </div>
        
        <h2 className="font-display text-4xl font-black uppercase tracking-tight text-foreground">
          Wrap Successfully Generated
        </h2>
        
        <p className="mt-4 font-sans text-base font-medium text-foreground/70">
          Thank you, {data.name || "friend"}! Your basic wrap has been created. 
          As part of the basic plan, your wrap is currently inactive. It will be manually reviewed and activated, and you will receive access to your wrap within 1-2 days.
        </p>

        <div className="mt-8 rounded-xl bg-ink/50 p-4">
          <p className="font-sans text-sm font-bold text-foreground/50">
            You may now safely close this window.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
