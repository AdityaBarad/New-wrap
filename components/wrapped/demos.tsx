'use client'

import Image from 'next/image'
import { Pop, motion } from './motion'
import { Starburst } from './shapes'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'

const IMAGES = [
  '/Check it out/1.jpeg',
  '/Check it out/2.jpeg',
  '/Check it out/3.jpeg',
  '/Check it out/4.jpeg',
  '/Check it out/5.jpeg',
  '/Check it out/Screenshot_2026-08-16-11-33-41-809_com.android.chrome.jpg.jpeg',
]

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
      className={`relative aspect-[9/16] w-full overflow-hidden rounded-2xl border-4 border-ink shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  )
}

function MobileCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const next = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % IMAGES.length)
  }

  const prev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length)
  }

  return (
    <div className="relative flex w-full flex-col items-center sm:hidden">
      {/* We add a little vertical padding so the shadow isn't clipped by an outer hidden container, if any */}
      <div className="relative flex w-[78vw] max-w-[320px] aspect-[9/16] items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 150 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 150 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 size-full overflow-hidden rounded-2xl border-4 border-ink shadow-xl bg-ink"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset }) => {
              if (offset.x < -40) {
                next()
              } else if (offset.x > 40) {
                prev()
              }
            }}
          >
            <Image src={IMAGES[currentIndex]} alt={`Demo ${currentIndex + 1}`} fill sizes="78vw" className="object-cover" priority />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between w-[78vw] max-w-[320px]">
        <button onClick={prev} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-cream transition-transform active:scale-90 shadow-md">
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex gap-2">
          {IMAGES.map((_, i) => (
            <div key={i} className={`size-2 shrink-0 rounded-full transition-colors ${i === currentIndex ? 'bg-ink' : 'bg-ink/20'}`} />
          ))}
        </div>
        <button onClick={next} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-cream transition-transform active:scale-90 shadow-md">
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
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

        {/* Mobile Carousel */}
        <MobileCarousel />

        {/* Desktop Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {IMAGES.map((img, i) => (
            <CardShell key={img} className="bg-ink" delay={i * 0.08}>
              <Image src={img} alt={`Demo ${i + 1}`} fill sizes="(max-width: 640px) 100vw, 300px" className="object-cover" />
            </CardShell>
          ))}
        </div>
      </div>
    </section>
  )
}
