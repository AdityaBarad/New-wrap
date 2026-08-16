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

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3 xl:grid-cols-6">
          {[
            '/Check it out/1.jpeg',
            '/Check it out/2.jpeg',
            '/Check it out/3.jpeg',
            '/Check it out/4.jpeg',
            '/Check it out/5.jpeg',
            '/Check it out/Screenshot_2026-08-16-11-33-41-809_com.android.chrome.jpg.jpeg',
          ].map((img, i) => (
            <CardShell key={img} className="bg-ink" delay={i * 0.08}>
              <Image src={img} alt={`Demo ${i + 1}`} fill sizes="(max-width: 640px) 78vw, 300px" className="object-cover" />
            </CardShell>
          ))}
        </div>
      </div>
    </section>
  )
}
