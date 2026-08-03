'use client'

import Image from 'next/image'
import { Pop, Stagger, StaggerItem } from './motion'
import { Starburst } from './shapes'

const QUOTES = [
  {
    quote: 'Posted my Wrapped and my group chat has not recovered. This is the flex of the era.',
    name: 'Zara O.',
    handle: '@zaraonline',
    bg: 'bg-green',
    fg: 'text-ink',
    img: '/wrapped-portrait-1.png',
  },
  {
    quote: 'The AI called out my 3AM snack runs by name. Rude. Accurate. Obsessed.',
    name: 'Mateo R.',
    handle: '@matteo.runs',
    bg: 'bg-pink',
    fg: 'text-ink',
    img: '/wrapped-portrait-2.png',
  },
  {
    quote: 'It made my mundane life feel like a Netflix trailer. 10/10 would relive.',
    name: 'Priya K.',
    handle: '@priyakay',
    bg: 'bg-yellow',
    fg: 'text-ink',
    img: '/wrapped-portrait-3.png',
  },
  {
    quote: 'Every transition slaps. Feels like a premium app, not a screenshot generator.',
    name: 'Dev S.',
    handle: '@devbuilds',
    bg: 'bg-orange',
    fg: 'text-ink',
    img: null,
  },
  {
    quote: 'My recap in review made me cry then made me laugh. Emotional whiplash. Loved it.',
    name: 'Lena M.',
    handle: '@lenam',
    bg: 'bg-cream',
    fg: 'text-ink',
    img: null,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="relative w-full bg-ink px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1600px]">
        <Pop from="up" className="mb-12 text-center">
          <p className="mb-3 flex items-center justify-center gap-2 font-display text-sm font-black uppercase tracking-widest text-green">
            <Starburst className="size-5" color="var(--wr-green)" spikes={10} /> The Hype
          </p>
          <h2 className="text-balance font-display text-5xl font-black uppercase leading-[0.9] tracking-tighter text-foreground md:text-7xl">
            People are <span className="text-pink">unwell</span> about it.
          </h2>
        </Pop>

        <Stagger className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {QUOTES.map((q) => (
            <StaggerItem key={q.name} className="break-inside-avoid">
              <figure
                className={`rounded-2xl border-4 border-ink ${q.bg} ${q.fg} p-6 transition-transform duration-200 hover:-rotate-1`}
              >
                <blockquote className="font-display text-xl font-black uppercase leading-tight tracking-tight md:text-2xl">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  {q.img ? (
                    <span className="relative size-11 overflow-hidden rounded-full border-2 border-ink">
                      <Image src={q.img} alt={q.name} fill sizes="44px" className="object-cover" />
                    </span>
                  ) : (
                    <span className="flex size-11 items-center justify-center rounded-full border-2 border-ink bg-ink font-display text-sm font-black text-cream">
                      {q.name.slice(0, 1)}
                    </span>
                  )}
                  <div className="font-display leading-tight">
                    <p className="text-sm font-black uppercase">{q.name}</p>
                    <p className="text-xs font-bold opacity-60">{q.handle}</p>
                  </div>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
