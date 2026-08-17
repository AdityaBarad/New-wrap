'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pop } from './motion'

const FAQS = [
  {
    q: 'How does the AI work?',
    a: 'You write a short paragraph about your story, memories, and inside jokes. Our AI analyzes it and generates an 8-slide cinematic experience with witty, highly personalized copy and a custom character card.',
  },
  {
    q: 'Can I add my own photos and music?',
    a: 'Yes! You can upload up to 14 photos to feature in your slides, and you can select a custom background song to play during the experience.',
  },
  {
    q: 'What do you do with my photos and data?',
    a: 'Your story and photos are only used to generate your Wrapped experience. We never sell your data, and your assets are securely hosted solely for your personal shareable link.',
  },
  {
    q: 'How do I share my Wrap?',
    a: 'Once your Wrap is ready, you receive a unique URL. You can share this link directly in group chats, or screen-record the interactive experience to post on Instagram, TikTok, and Snapchat.',
  },
  {
    q: 'How long does it take to get my Wrap?',
    a: 'Your personalized Wrapped experience is generated and delivered instantly!',
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
            recap on the timeline.
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
