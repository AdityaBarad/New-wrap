'use client'

import { Sparkles, Camera, BarChart3, Share2, Music4, Zap } from 'lucide-react'
import { Pop, Stagger, StaggerItem } from './motion'
import { Starburst } from './shapes'

const FEATURES = [
  {
    title: 'AI Copy That Roasts You',
    body: 'Punchy, unhinged, editorial captions generated from your real data. It knows what you did last summer.',
    icon: Sparkles,
    bg: 'bg-green',
    fg: 'text-ink',
    span: 'md:col-span-2',
  },
  {
    title: 'Drop Your Memories',
    body: 'Upload photos, voice notes, texts. We cut them out and frame them in chaos.',
    icon: Camera,
    bg: 'bg-pink',
    fg: 'text-ink',
    span: '',
  },
  {
    title: 'Stat Overload',
    body: 'Steps, songs, spend, screen time — every metric turned into a flex.',
    icon: BarChart3,
    bg: 'bg-purple',
    fg: 'text-foreground',
    span: '',
  },
  {
    title: 'Built To Be Shared',
    body: 'Vertical story format, one-tap export, engineered for the algorithm.',
    icon: Share2,
    bg: 'bg-yellow',
    fg: 'text-ink',
    span: 'md:col-span-2',
  },
  {
    title: 'Soundtrack Your Recap',
    body: 'Sync the tracks that scored your milestones.',
    icon: Music4,
    bg: 'bg-orange',
    fg: 'text-ink',
    span: '',
  },
  {
    title: 'Instant Rollout',
    body: 'No waiting. Your cinematic album renders live, section by section.',
    icon: Zap,
    bg: 'bg-cream',
    fg: 'text-ink',
    span: 'md:col-span-2',
  },
]

export function Features() {
  return (
    <section id="features" className="relative w-full bg-ink px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Pop from="left">
            <p className="mb-3 flex items-center gap-2 font-display text-sm font-black uppercase tracking-widest text-green">
              <Starburst className="size-5" color="var(--wr-green)" spikes={10} /> The Feature Wall
            </p>
            <h2 className="max-w-2xl text-balance font-display text-5xl font-black uppercase leading-[0.9] tracking-tighter text-foreground md:text-7xl">
              Everything you lived, <span className="text-pink">turned loud.</span>
            </h2>
          </Pop>
          <Pop from="right">
            <p className="max-w-sm text-pretty text-base font-medium leading-relaxed text-foreground/60">
              This is how it looks: a maximalist, spring-loaded album that snaps
              through your story like a premium streaming recap.
            </p>
          </Pop>
        </div>

        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <StaggerItem key={f.title} className={f.span}>
              <article
                className={`group relative flex h-full min-h-52 flex-col justify-between overflow-hidden rounded-2xl border-4 border-ink ${f.bg} ${f.fg} p-6 transition-transform duration-200 hover:-translate-y-1 hover:rotate-1`}
              >
                <Starburst
                  className="absolute -right-8 -top-8 size-28 opacity-20 transition-transform duration-500 group-hover:rotate-90"
                  color="currentColor"
                  spikes={12}
                />
                <f.icon className="size-9" strokeWidth={2.5} />
                <div className="relative">
                  <h3 className="font-display text-2xl font-black uppercase leading-none tracking-tight md:text-3xl">
                    {f.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm font-medium leading-relaxed opacity-80">
                    {f.body}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
