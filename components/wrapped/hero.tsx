'use client'

import Image from 'next/image'
import { ArrowUpRight, Play } from 'lucide-react'
import { motion } from './motion'
import { Starburst, Checker } from './shapes'

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-ink px-4 pb-16 pt-28 md:px-8 md:pt-32"
    >
      {/* background blooms */}
      <Starburst
        className="pointer-events-none absolute -left-24 -top-16 size-72 opacity-90 md:size-96"
        color="var(--wr-purple)"
        spikes={16}
        spin
      />
      <Starburst
        className="pointer-events-none absolute -bottom-24 right-1/4 size-64 opacity-80 md:size-80"
        color="var(--wr-pink)"
        spikes={10}
      />

      <div className="mx-auto grid w-full max-w-[1600px] flex-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        {/* copy */}
        <div className="relative z-10">
          <motion.span
            initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 14 }}
            className="inline-block rounded-full bg-yellow px-4 py-1.5 font-display text-xs font-black uppercase tracking-widest text-ink md:text-sm"
          >
            ★ 2025 Edition — Now Rolling Out
          </motion.span>

          <h1 className="mt-6 font-display text-[16vw] font-black uppercase leading-[0.82] tracking-tighter text-foreground sm:text-[13vw] lg:text-[8.5rem] xl:text-[10rem]">
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
              Life,
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
            className="mt-6 max-w-md text-pretty text-base font-medium leading-relaxed text-foreground/70 md:text-lg"
          >
            Your memories deserve a rollout. We blend your photos, milestones, and
            unhinged personal stats into a cinematic year-in-review album built to be
            screenshotted, flexed, and posted at 2AM.
          </motion.p>

          <motion.div
            id="hero-cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44, type: 'spring', stiffness: 260, damping: 22 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="/create"
              className="group flex items-center gap-2 rounded-full bg-green px-7 py-4 font-display text-base font-black uppercase tracking-wide text-ink transition-transform hover:-rotate-2 hover:scale-105"
            >
              Design Your Own
              <ArrowUpRight className="size-5 transition-transform group-hover:rotate-45" />
            </a>
            <a
              href="#how"
              className="flex items-center gap-2 rounded-full border-2 border-foreground/20 px-7 py-4 font-display text-base font-black uppercase tracking-wide text-foreground transition-colors hover:border-pink hover:text-pink"
            >
              <Play className="size-4 fill-current" />
              Watch The Drop
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex items-center gap-6 font-display text-sm font-bold uppercase tracking-wide text-foreground/50"
          >
            <span><span className="text-yellow">4.2M+</span> wraps made</span>
            <span className="hidden sm:inline"><span className="text-orange">190M</span> memories</span>
            <span>Free · Instant</span>
          </motion.div>
        </div>

        {/* poster */}
        <motion.div
          initial={{ opacity: 0, y: 80, rotate: 6, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.2 }}
          className="relative z-10 mx-auto w-full max-w-sm"
        >
          <div className="relative aspect-[3/4] w-full rotate-2 rounded-2xl border-4 border-ink bg-purple p-4 shadow-2xl">
            <Checker className="absolute right-4 top-4 size-10" color="var(--wr-yellow)" />
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <Starburst className="absolute inset-0 z-0 size-full scale-110" color="var(--wr-yellow)" spikes={18} spin />
              <Image
                src="/wrapped-portrait-1.png"
                alt="Featured Wrapped album cover portrait"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 380px"
                className="relative z-10 object-cover mix-blend-normal [clip-path:polygon(50%_2%,63%_20%,85%_15%,80%_37%,98%_50%,80%_63%,85%_85%,63%_80%,50%_98%,37%_80%,15%_85%,20%_63%,2%_50%,20%_37%,15%_15%,37%_20%)]"
              />
            </div>
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
              <div>
                <p className="font-display text-3xl font-black uppercase leading-none text-yellow">2025</p>
                <p className="font-display text-sm font-bold uppercase tracking-widest text-foreground">Wrapped</p>
              </div>
              <p className="font-display text-5xl font-black leading-none text-green">#1</p>
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            className="absolute -bottom-6 -left-6 rotate-[-6deg] rounded-xl bg-pink px-4 py-2 font-display text-sm font-black uppercase text-ink shadow-lg"
          >
            53,623 min lived
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
