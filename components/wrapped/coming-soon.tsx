'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from './motion'
import { Starburst } from './shapes'

export function ComingSoon() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-ink px-4 py-20 text-center">
      <Starburst
        className="pointer-events-none absolute -left-24 -top-16 size-72 opacity-90 md:size-96"
        color="var(--wr-purple)"
        spikes={16}
        spin
      />
      <Starburst
        className="pointer-events-none absolute -bottom-24 -right-16 size-64 opacity-80 md:size-80"
        color="var(--wr-pink)"
        spikes={10}
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 14 }}
          className="inline-block rounded-full bg-yellow px-4 py-1.5 font-display text-xs font-black uppercase tracking-widest text-ink md:text-sm"
        >
          ★ 2026 Edition
        </motion.span>

        <h1 className="mt-8 font-display text-[16vw] font-black uppercase leading-[0.85] tracking-tighter text-foreground sm:text-8xl md:text-9xl lg:text-[10rem]">
          <motion.span
            className="block text-green"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          >
            Coming
          </motion.span>
          <motion.span
            className="block italic text-pink"
            initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.1 }}
          >
            Soon
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 22 }}
          className="mt-8 max-w-md text-pretty text-base font-medium leading-relaxed text-foreground/70 md:text-lg"
        >
          We're putting the finishing touches on your personalized recap. 
          Check back later to generate your unhinged Moments/Wrapped album.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 22 }}
          className="mt-10"
        >
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-full border-2 border-foreground/20 px-7 py-4 font-display text-base font-black uppercase tracking-wide text-foreground transition-colors hover:border-pink hover:text-pink"
          >
            <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
