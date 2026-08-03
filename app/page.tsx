import { Nav } from '@/components/wrapped/nav'
import { Hero } from '@/components/wrapped/hero'
import { DummyWrapsDemo } from '@/components/wrapped/dummy-wraps-demo'
import { Marquee } from '@/components/wrapped/marquee'
import { Features } from '@/components/wrapped/features'
import { Demos } from '@/components/wrapped/demos'
import { HowItWorks } from '@/components/wrapped/how-it-works'
import { Testimonials } from '@/components/wrapped/testimonials'
import { Faq } from '@/components/wrapped/faq'
import { Footer } from '@/components/wrapped/footer'

export default function Page() {
  return (
    <main className="relative w-full overflow-x-hidden bg-ink">
      <Nav />
      <Hero />
      <DummyWrapsDemo />

      <div className="w-full border-y-4 border-ink bg-pink py-3">
        <Marquee text="#YOURSTORYWRAPPED —" textClassName="text-ink" />
      </div>

      <Features />

      <div className="flex w-full flex-col">
        <div className="border-y-4 border-ink bg-yellow py-3">
          <Marquee text="DESIGN YOUR OWN · FREE DOWNLOAD · INSTANT ·" textClassName="text-ink" />
        </div>
        <div className="border-b-4 border-ink bg-purple py-3">
          <Marquee text="190M MEMORIES WRAPPED · 4.2M ALBUMS ·" reverse textClassName="text-yellow" />
        </div>
      </div>

      <Demos />

      <div className="w-full border-y-4 border-ink bg-green py-3">
        <Marquee text="YOUR ERA. UNHINGED. —" textClassName="text-ink" />
      </div>

      <HowItWorks />
      <Testimonials />

      <div className="w-full border-y-4 border-ink bg-orange py-3">
        <Marquee text="POST BEFORE THEY DO · GO VIRAL · REPEAT ·" reverse textClassName="text-ink" />
      </div>

      <Faq />
      <Footer />
    </main>
  )
}
