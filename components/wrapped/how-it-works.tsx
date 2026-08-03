'use client'

import { Pop, Stagger, StaggerItem } from './motion'

const STEPS = [
  {
    n: '01',
    title: 'Dump It All',
    body: 'Connect your camera roll, notes, and apps. Upload the receipts of your era in one messy drop.',
    color: 'text-green',
    bg: 'bg-green',
  },
  {
    n: '02',
    title: 'We Wrap It',
    body: 'Our AI cuts, ranks, roasts, and choreographs everything into a spring-loaded cinematic sequence.',
    color: 'text-pink',
    bg: 'bg-pink',
  },
  {
    n: '03',
    title: 'Flex It',
    body: 'Swipe through your rollout, export vertical stories, and post before anyone else drops theirs.',
    color: 'text-orange',
    bg: 'bg-orange',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="relative w-full overflow-hidden bg-purple px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1600px]">
        <Pop from="left" className="mb-14">
          <p className="mb-3 font-display text-sm font-black uppercase tracking-widest text-yellow">
            ★ The Process
          </p>
          <h2 className="max-w-3xl text-balance font-display text-5xl font-black uppercase leading-[0.9] tracking-tighter text-foreground md:text-8xl">
            Three steps to <span className="text-yellow">the drop.</span>
          </h2>
        </Pop>

        <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <StaggerItem key={s.n}>
              <article className="group relative flex h-full flex-col rounded-2xl border-4 border-ink bg-ink p-6">
                <span className={`font-display text-[6rem] font-black leading-none ${s.color}`}>
                  {s.n}
                </span>
                <div className={`my-4 h-1.5 w-16 ${s.bg} transition-all duration-300 group-hover:w-full`} />
                <h3 className="font-display text-3xl font-black uppercase tracking-tight text-foreground">
                  {s.title}
                </h3>
                <p className="mt-3 text-base font-medium leading-relaxed text-foreground/60">
                  {s.body}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
