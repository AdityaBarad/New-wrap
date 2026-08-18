import { createClient } from "@supabase/supabase-js"
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

const FEATURED_SLUGS = [
  "diya-mwsgfl",
  "aarna-6dl8g8",
  "shruti-odkkr6",
  "wrap-gtam8r",
  "sakshi-and-mohi-ngmfn4",
  "aarav-anaya-4nqzwf",
  "rohan-aananya-3cvvj6",
  "manik-kirti-37r7uu",
]

async function getFeaturedWraps() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data, error } = await supabase
    .from("wraps")
    .select("slug, name, wrap_title, purpose, photo_urls, user_names, personality_image_url, card_color")
    .in("slug", FEATURED_SLUGS)
    .eq("status", "generated")

  if (error) return []

  return (data || []).sort(
    (a, b) => FEATURED_SLUGS.indexOf(a.slug) - FEATURED_SLUGS.indexOf(b.slug),
  )
}

export default async function Page() {
  const featuredWraps = await getFeaturedWraps()

  return (
    <main className="relative w-full overflow-x-hidden bg-ink">
      <Nav />
      <Hero />

      <div className="flex w-full flex-col">
        <div className="border-y-4 border-ink bg-orange py-3">
          <Marquee text="TRENDING WRAPS · POPULAR NOW · GET INSPIRED ·" textClassName="text-ink" />
        </div>
      </div>

      <DummyWrapsDemo featuredWraps={featuredWraps} />
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

      <div className="w-full border-y-4 border-ink bg-pink py-3">
        <Marquee text="#YOURSTORYWRAPPED —" textClassName="text-ink" />
      </div>

      <Features />
      <Testimonials />

      <div className="w-full border-y-4 border-ink bg-orange py-3">
        <Marquee text="POST BEFORE THEY DO · GO VIRAL · REPEAT ·" reverse textClassName="text-ink" />
      </div>

      <Faq />
      <Footer />
    </main>
  )
}
