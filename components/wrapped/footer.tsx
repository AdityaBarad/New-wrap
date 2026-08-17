'use client'

import { ArrowUpRight } from 'lucide-react'
import { Pop, motion } from './motion'
import { Starburst } from './shapes'

const COLS = [
  { 
    title: 'Product', 
    links: [
      { label: 'Demos', href: '#popular-wraps' }, 
      { label: 'How it Works', href: '#how' }, 
      { label: 'FAQ', href: '#faq' }
    ] 
  },
  { 
    title: 'Support', 
    links: [
      { label: 'Contact Us', href: 'mailto:admin@wrapsy.co' },
      { label: 'Privacy Policy', href: '#' }, 
      { label: 'Terms of Service', href: '#' }
    ] 
  },
  { 
    title: 'Social', 
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/getwrapsy' }, 
      { label: 'TikTok', href: 'https://tiktok.com/@wrapsy.co' }, 
      { label: 'X / Twitter', href: 'https://twitter.com/wrapsyco' }
    ] 
  },
]

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-green px-4 pb-8 pt-20 text-ink md:px-8">
      <Starburst
        className="pointer-events-none absolute -right-20 -top-20 size-80 opacity-30"
        color="var(--wr-ink)"
        spikes={18}
        spin
      />
      <div className="relative mx-auto max-w-[1600px]">
        <Pop from="up">
          <h2 className="max-w-5xl text-balance font-display text-[13vw] font-black uppercase leading-[0.82] tracking-tighter lg:text-[9rem]">
            Wrap your era.
          </h2>
        </Pop>

        <div className="mt-8 flex flex-col items-start justify-between gap-8 border-b-4 border-ink pb-14 md:flex-row md:items-end">
          <p className="max-w-md text-pretty text-lg font-medium leading-relaxed text-ink/70">
            The moment is not going to romanticize itself. Build your cinematic
            recap in minutes — free, instant, and built to break the
            timeline.
          </p>
          <motion.a
            href="/create"
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.96 }}
            className="group flex items-center gap-3 rounded-full bg-ink px-8 py-5 font-display text-lg font-black uppercase tracking-wide text-cream"
          >
            Get Wrapped Now
            <ArrowUpRight className="size-6 transition-transform group-hover:rotate-45" />
          </motion.a>
        </div>

        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-3">
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="mb-4 font-display text-sm font-black uppercase tracking-widest text-ink/50">
                {c.title}
              </p>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith('http') ? '_blank' : undefined}
                      rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-display text-base font-bold uppercase tracking-tight text-ink transition-colors hover:text-cream"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t-4 border-ink pt-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="relative flex size-10 items-center justify-center">
              <img src="/logo/black-transparent.png" alt="Wrapsy Logo" className="w-full h-full object-contain" />
            </span>
            <span className="font-display text-base font-black uppercase tracking-tight">
              Wrapsy
            </span>
          </div>
          <p className="font-display text-xs font-bold uppercase tracking-widest text-ink/60">
            © {new Date().getFullYear()} Wrapsy — Your Era. Unhinged.
          </p>
        </div>
      </div>
    </footer>
  )
}
