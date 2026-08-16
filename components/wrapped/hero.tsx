'use client'

import Image from 'next/image'
import { ArrowUpRight, Play } from 'lucide-react'
import { motion } from './motion'
import { Starburst } from './shapes'
import { Burst } from '@/components/player/burst'

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen w-full flex-col justify-start md:justify-center overflow-hidden bg-ink px-4 pb-8 pt-16 md:px-8 md:pt-24 lg:pt-20"
    >
      {/* background blooms */}
      <Starburst
        className="pointer-events-none absolute -left-24 -top-16 size-72 opacity-90 md:size-96"
        color="var(--wr-purple)"
        spikes={16}
        spin
      />

      <div className="mx-auto grid w-full max-w-[1600px] flex-1 items-center gap-6 lg:gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        {/* copy */}
        <div className="relative z-10">

          <h1
            className="font-display font-black uppercase leading-[0.82] tracking-tighter text-foreground"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 7.5rem)' }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, x: -120 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20 }}
            >
              Your
            </motion.span>
            <motion.span
              className="block text-green"
              initial={{ opacity: 0, x: 120 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20, delay: 0.08 }}
            >
              Story,
            </motion.span>
            <motion.span
              className="block italic text-pink"
              initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.16 }}
            >
              Wrapped
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, type: 'spring', stiffness: 260, damping: 22 }}
            className="mt-4 max-w-md text-pretty text-base font-medium leading-relaxed text-foreground/70 md:text-lg"
          >
            Your memories deserve a rollout. We blend your photos, milestones, and
            unhinged personal stats into a cinematic highlight reel built to be
            screenshotted, flexed, and posted at 2AM.
          </motion.p>

          <motion.div
            id="hero-cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44, type: 'spring', stiffness: 260, damping: 22 }}
            className="mt-6 flex flex-row items-center gap-2 sm:gap-3"
          >
            <a
              href="/create"
              className="group flex items-center gap-1.5 sm:gap-2 rounded-full bg-green px-5 py-3 sm:px-7 sm:py-4 font-display text-[13px] sm:text-base font-black uppercase tracking-wide text-ink transition-transform hover:-rotate-2 hover:scale-105 whitespace-nowrap"
            >
              Get Wrapped
              <ArrowUpRight className="size-4 sm:size-5 transition-transform group-hover:rotate-45" />
            </a>
            <a
              href="#how"
              className="flex items-center gap-1.5 sm:gap-2 rounded-full border-2 border-foreground/20 px-5 py-3 sm:px-7 sm:py-4 font-display text-[13px] sm:text-base font-black uppercase tracking-wide text-foreground transition-colors hover:border-pink hover:text-pink whitespace-nowrap"
            >
              <Play className="size-3 sm:size-4 fill-current" />
              Watch Demos
            </a>
          </motion.div>


        </div>

        {/* poster */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.2 }}
          className="relative z-10 mx-auto flex w-full max-w-sm xl:max-w-md aspect-square items-center justify-center"
        >
          <Burst
            photo="/Hero.jpg"
            palette={{ cloud: "var(--wr-orange)", star1: "var(--wr-purple)", star2: "var(--wr-yellow)" }}
            delay={0.2}
            className="h-full w-full"
            gridSize={8}
          />
        </motion.div>
      </div>
    </section>
  )
}
