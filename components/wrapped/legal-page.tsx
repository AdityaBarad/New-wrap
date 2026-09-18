import Link from 'next/link'

type LegalSection = {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow: string
  title: string
  intro: string
  updated: string
  sections: LegalSection[]
}) {
  return (
    <main className="min-h-screen bg-ink px-4 py-8 text-foreground md:px-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center rounded-full border-2 border-foreground/20 px-4 py-2 font-display text-sm font-black uppercase tracking-wide transition-colors hover:border-green hover:bg-green hover:text-ink"
        >
          Back to Wrapsy
        </Link>

        <header className="mt-16 border-b-4 border-green pb-10 md:mt-24">
          <p className="font-display text-sm font-black uppercase tracking-[0.2em] text-green">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-8xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70">{intro}</p>
          <p className="mt-5 font-display text-xs font-bold uppercase tracking-widest text-foreground/50">
            Last updated: {updated}
          </p>
        </header>

        <div className="space-y-12 py-12 md:py-16">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl font-black uppercase tracking-tight text-green md:text-3xl">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/75">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="list-disc space-y-2 pl-6">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <footer className="border-t-4 border-foreground/20 py-8 text-sm text-foreground/60">
          Questions about these policies? Contact us at{' '}
          <a className="font-bold text-green hover:underline" href="mailto:admin@wrapsy.co">
            admin@wrapsy.co
          </a>
          .
        </footer>
      </div>
    </main>
  )
}
