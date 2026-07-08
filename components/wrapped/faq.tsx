'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pop } from './motion'

const FAQS = [
  {
    q: 'Is it actually free?',
    a: 'Yes. Building and exporting your core Wrapped album is free forever. A Pro tier unlocks extra templates, 4K exports, and video rollouts.',
  },
  {
    q: 'What do you do with my photos and data?',
    a: 'Everything is processed to build your album and never sold. You can delete your data and generated albums at any time, instantly.',
  },
  {
    q: 'Where does the data come from?',
    a: 'You choose. Import from your camera roll, notes, calendars, and connected apps — or just type your stats in manually.',
  },
  {
    q: 'Can I edit the AI copy?',
    a: 'Absolutely. Every roast, stat, and caption is editable. Regenerate with one tap until it hits exactly right.',
  },
  {
    q: 'What can I share it to?',
    a: 'Export vertical stories, square posts, or a link. Optimized for Instagram, TikTok, and every group chat you are in.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative w-full bg-cream px-4 py-20 text-ink md:px-8 md:py-28">
      <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Pop from="left">
          <p className="mb-3 font-display text-sm font-black uppercase tracking-widest text-orange">
            ★ The Fine Print
          </p>
          <h2 className="text-balance font-display text-5xl font-black uppercase leading-[0.88] tracking-tighter md:text-7xl">
            Questions? <span className="text-purple">Answered.</span>
          </h2>
          <p className="mt-4 max-w-sm text-pretty text-base font-medium leading-relaxed text-ink/60">
            Everything you want to know before you drop the most unhinged
            year-in-review on the timeline.
          </p>
        </Pop>

        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => {
            const active = open === i
            return (
              <Pop key={f.q} from="right" delay={i * 0.05}>
                <div
                  className={`overflow-hidden rounded-2xl border-4 border-ink transition-colors ${active ? 'bg-green' : 'bg-cream'}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(active ? null : i)}
                    aria-expanded={active}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-display text-lg font-black uppercase tracking-tight md:text-2xl">
                      {f.q}
                    </span>
                    <motion.span animate={{ rotate: active ? 135 : 0 }} className="shrink-0">
                      <Plus className="size-6" strokeWidth={3} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      >
                        <p className="px-6 pb-6 text-base font-medium leading-relaxed text-ink/80">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Pop>
            )
          })}
        </div>
      </div>
    </section>
  )
}
