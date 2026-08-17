'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Starburst } from './shapes'

const LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Demos', href: '#demos' },
  { label: 'How It Works', href: '#how' },
  { label: 'Hype', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
]

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-5">
        <a href="#top" className="flex items-center gap-2">
          <span className="relative flex size-[53px] items-center justify-center">
            <img src="/logo/logo-transparent.png" alt="Wrapsy Logo" className="w-full h-full object-contain" />
          </span>
          <span className="font-display text-lg sm:text-xl font-black uppercase leading-none tracking-tight text-foreground">
            Wrapsy
          </span>
        </a>

        <div className="hidden items-center gap-1 rounded-full border border-border bg-card/70 px-2 py-1.5 backdrop-blur-md lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-1.5 font-display text-sm font-bold uppercase tracking-wide text-foreground/80 transition-colors hover:bg-green hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/my-wraps"
            className="hidden rounded-full border-2 border-foreground/20 px-5 py-2 font-display text-sm font-black uppercase tracking-wide text-foreground transition-colors hover:border-green hover:bg-green hover:text-ink sm:block"
          >
            My Wraps
          </a>
          <a
            href="/create"
            className="hidden rounded-full bg-green px-5 py-2.5 font-display text-sm font-black uppercase tracking-wide text-ink transition-transform hover:-rotate-2 hover:scale-105 sm:block"
          >
            Get Wrapped
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-4 mb-2 rounded-2xl border border-border bg-card p-3 lg:hidden">
          <div className="flex flex-col">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 font-display text-base font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-green hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/my-wraps"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-xl border-2 border-foreground/20 px-4 py-3 text-center font-display text-base font-black uppercase tracking-wide text-foreground transition-colors hover:border-green hover:bg-green hover:text-ink"
            >
              My Wraps
            </a>
            <a
              href="/create"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-green px-4 py-3 text-center font-display text-base font-black uppercase tracking-wide text-ink"
            >
              Get Wrapped
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
