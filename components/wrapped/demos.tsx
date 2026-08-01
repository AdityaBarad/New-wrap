'use client'

import Image from 'next/image'
import { Pop, motion } from './motion'
import { Starburst } from './shapes'

function CardShell({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 90, rotate: -4, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18, delay }}
      whileHover={{ y: -12, rotate: 1.5, transition: { type: 'spring', stiffness: 400, damping: 12 } }}
      className={`relative aspect-[9/16] w-[78vw] shrink-0 snap-center overflow-hidden rounded-2xl border-4 border-ink shadow-xl sm:w-auto ${className}`}
    >
      {children}
    </motion.div>
  )
}

export function Demos() {
  return (
    <section id="demos" className="relative w-full bg-cream px-4 py-20 text-ink md:px-8 md:py-28">
      <div className="mx-auto max-w-[1600px]">
        <Pop from="up" className="mb-3 text-center">
          <h2 className="font-display text-5xl font-black uppercase tracking-tighter md:text-7xl">
            Check this out!
          </h2>
        </Pop>
        <Pop from="up" delay={0.1} className="mb-12 text-center">
          <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-ink/60 md:text-base">
            Here&apos;s our set of individual templates
          </p>
        </Pop>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-5">
          {/* 1 — op-art intro */}
          <CardShell className="bg-cream" delay={0}>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'repeating-radial-gradient(circle at 60% 40%, #0b0b0b 0 14px, #eeeee4 14px 28px)',
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-center p-5">
              <span className="font-display text-3xl font-black uppercase text-cream text-stroke-ink">
                Intro
              </span>
              <span className="font-display text-[7rem] font-black leading-[0.8] text-orange">
                25
              </span>
            </div>
          </CardShell>

          {/* 2 — generate */}
          <CardShell className="bg-neutral-700" delay={0.08}>
            <div className="absolute inset-0 opacity-30 spin-slow">
              <Starburst className="size-full" color="#a1a1a1" spikes={20} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-5">
              <motion.span
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
                className="rounded-2xl border-4 border-ink bg-green px-6 py-4 font-display text-2xl font-black uppercase text-ink shadow-lg"
              >
                Generate
              </motion.span>
            </div>
          </CardShell>

          {/* 3 — portrait + stats */}
          <CardShell className="bg-cream" delay={0.16}>
            <div className="absolute left-3 top-4 font-display text-4xl font-black text-orange [writing-mode:vertical-rl]">
              2026
            </div>
            <div className="absolute right-3 top-4 h-2/5 w-3/5 overflow-hidden rounded-lg border-2 border-ink">
              <Image src="/wrapped-portrait-2.png" alt="Template portrait" fill sizes="200px" className="object-cover" />
            </div>
            <div className="absolute inset-x-4 bottom-4 grid grid-cols-2 gap-2 font-display text-[0.7rem] font-bold leading-tight">
              <div>
                <p className="text-ink/50">Top Moments</p>
                <p>1 First Flat</p>
                <p>2 Berlin Trip</p>
                <p>3 New Job</p>
              </div>
              <div>
                <p className="text-ink/50">Top Feelings</p>
                <p>1 Unhinged</p>
                <p>2 Locked In</p>
                <p>3 Delulu</p>
              </div>
              <div className="col-span-2 mt-1">
                <p className="text-ink/50">Minutes Lived</p>
                <p className="font-display text-2xl font-black text-orange">525,600</p>
              </div>
            </div>
          </CardShell>

          {/* 4 — big number */}
          <CardShell className="bg-ink" delay={0.24}>
            <div className="absolute inset-0 opacity-40">
              <Starburst className="absolute -bottom-10 -right-10 size-52" color="var(--wr-purple)" spikes={16} spin />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center p-5">
              <p className="font-display text-sm font-bold uppercase tracking-widest text-foreground/60">
                Steps Taken
              </p>
              <p className="font-display text-[3.5rem] font-black leading-none text-orange">
                46,850
              </p>
              <p className="mt-2 font-display text-sm font-bold uppercase text-green">
                Top 3% of humans
              </p>
            </div>
          </CardShell>

          {/* 5 — top list */}
          <CardShell className="bg-cream" delay={0.32}>
            <div className="absolute inset-0 flex flex-col p-5">
              <p className="font-display text-xl font-black uppercase">Your Top [BLANK]</p>
              <ul className="mt-3 space-y-1.5 font-display text-lg font-black uppercase">
                {['Late Nights', 'Road Trips', 'Group Chats', 'Comebacks', 'Main Character'].map(
                  (t, i) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="text-ink/50">{i + 1}</span>
                      <span className="bg-ink px-1 text-cream">{t}</span>
                    </li>
                  ),
                )}
              </ul>
              <div className="mt-auto grid grid-cols-5 gap-1">
                {Array.from({ length: 15 }).map((_, i) => (
                  <span key={i} className="aspect-square rounded-full bg-orange" />
                ))}
              </div>
            </div>
          </CardShell>
        </div>
      </div>
    </section>
  )
}
