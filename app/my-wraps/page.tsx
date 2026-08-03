"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import { PhoneVerifier } from "@/components/auth/phone-verifier"
import s from "./page.module.css"

type WrapInfo = {
  slug: string
  name: string
  purpose: string
  created_at: string
  personality_image_url: string | null
  photo_urls: string[] | null
  user_names: string | null
}

/* ──────────── purpose → display label ──────────── */
const PURPOSE_LABELS: Record<string, string> = {
  couple: "COUPLE",
  travel: "TRAVEL",
  birthday: "BIRTHDAY",
  life: "LIFE",
  group: "GROUP / FAMILY",
}

const SPOTIFY_COLORS = [
  "#ff6666", "#ff8a8a", "#ffa1a1", "#ff4da8", "#ff66b3",
  "#ff99cc", "#ffb3e6", "#e60073", "#ff4d4d", "#ff6a13",
  "#ff876a", "#ff9640", "#ffb366", "#ffcc99", "#ffdb4d",
  "#ffe854", "#ffff66", "#c4f033", "#a6ff4d", "#ccff99",
  "#21e065", "#3de3a3", "#4de3a8", "#66ffcc", "#00e673",
  "#33cc33", "#4dd2ff", "#66c2ff", "#7ac5ff", "#99ddff",
  "#3399ff", "#0073e6", "#4d4dff", "#7b2ff2", "#9933ff",
  "#b366ff", "#cca3ff", "#d6a3ff", "#e6ccff", "#ff33cc",
  "#ff66d9", "#ff99e6", "#cc0099", "#ff5050", "#ff9999",
  "#ffd480", "#80ffaa", "#80bfff", "#d279d2", "#e6b3b3"
]

function getCardColor(slug: string) {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash)
  }
  return SPOTIFY_COLORS[Math.abs(hash) % SPOTIFY_COLORS.length]
}

/* ──────────── Spotify-Radio–style wrap card ──────────── */
function WrapCard({ wrap }: { wrap: WrapInfo }) {
  const photos = wrap.photo_urls ?? []
  const label = PURPOSE_LABELS[wrap.purpose] ?? wrap.purpose?.toUpperCase() ?? "WRAP"
  const cardColor = getCardColor(wrap.slug)

  // Build subtitle from user_names (comma-separated in DB)
  const names = wrap.user_names
    ? wrap.user_names
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean)
    : []

  const subtitle =
    names.length > 0 ? `With ${names.join(", ")}` : ""

  return (
    <a href={`/wrap/${wrap.slug}`} className={s.card}>
      {/* ── image area (colored square) ── */}
      <div 
        className={s.imageArea} 
        style={{ 
          backgroundColor: cardColor,
          "--card-bg": cardColor
        } as React.CSSProperties}
      >
        {/* Images (overlapping circles) */}
        <div className={s.circlesContainer}>
          {photos.length >= 3 ? (
            <>
              <img src={photos[1]} alt="" className={`${s.circleImage} ${s.leftCircle}`} />
              <img src={photos[2]} alt="" className={`${s.circleImage} ${s.rightCircle}`} />
              <img src={photos[0]} alt="" className={`${s.circleImage} ${s.centerCircle}`} />
            </>
          ) : photos.length === 2 ? (
            <>
              <img src={photos[1]} alt="" className={`${s.circleImage} ${s.leftCircle}`} />
              <img src={photos[0]} alt="" className={`${s.circleImage} ${s.centerCircle}`} />
            </>
          ) : photos.length === 1 ? (
            <img src={photos[0]} alt="" className={`${s.circleImage} ${s.fallbackCircle}`} />
          ) : wrap.personality_image_url ? (
            <img src={wrap.personality_image_url} alt="" className={`${s.circleImage} ${s.fallbackCircle}`} />
          ) : null}
        </div>

        {/* Custom logo (top-left) - Black */}
        <img src="/logo/logo-solid.jpeg" alt="Logo" className={s.logo} />

        {/* Type badge (top-right) – just text, like RADIO badge */}
        <span className={s.badge}>
          {label}
        </span>

        {/* Name overlaid at bottom of the colored square */}
        <h3 className={s.name}>{wrap.name}</h3>

        {/* Play button (visible on hover) */}
        <div className={s.playButton}>
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', color: '#000', marginLeft: '2px' }}>
            <path d="M7 6v12l10-6z" />
          </svg>
        </div>
      </div>

      {/* ── subtitle (user names) below the colored square ── */}
      {subtitle && <p className={s.subtitle}>{subtitle}</p>}
    </a>
  )
}

/* ──────────────────────────── page ──────────────────────────── */
export default function MyWrapsPage() {
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [wraps, setWraps] = useState<WrapInfo[] | null>(null)

  const handleSearch = async (verifiedPhone: string) => {
    setPhone(verifiedPhone)
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/my-wraps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: verifiedPhone }),
      })

      if (!res.ok) throw new Error("Failed to fetch wraps")

      const data = await res.json()
      setWraps(data.wraps || [])
    } catch (err) {
      setError("Something went wrong loading your wraps. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setWraps(null)
    setPhone("")
    setError(null)
  }

  return (
    <main className="relative min-h-screen w-full bg-ink overflow-x-hidden selection:bg-green/30 selection:text-green">
      {/* Decorative Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] -top-[20%] h-[70vw] w-[70vw] rounded-full bg-pink opacity-10 blur-[100px] mix-blend-screen" />
        <div className="absolute -bottom-[20%] -right-[20%] h-[70vw] w-[70vw] rounded-full bg-green opacity-10 blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          {!wraps ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <div className="text-center">
                <span className="flex items-center justify-center gap-1.5 font-display text-xs font-black uppercase tracking-widest text-pink">
                  <Sparkles className="size-3.5" />
                  Welcome Back
                </span>
                <h1 className="mt-4 font-display text-5xl font-black uppercase tracking-tighter text-cream sm:text-6xl">
                  Find Your <br />
                  <span className="text-green">Wraps</span>
                </h1>
                <p className="mt-4 font-sans text-sm font-medium text-cream/60">
                  Enter the phone number you used to generate your wraps to access your entire collection.
                </p>
              </div>

              <div className="mt-10">
                <PhoneVerifier
                  onSuccess={handleSearch}
                  buttonText="Find My Wraps"
                />
              </div>

              {loading && (
                <p className="mt-6 text-center font-sans text-sm text-cream/70 animate-pulse">
                  Fetching your wraps...
                </p>
              )}
              {error && (
                <p className="mt-6 text-center font-sans text-sm font-bold text-orange">
                  {error}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full max-w-5xl"
            >
              <div className="mb-10 text-center flex flex-col items-center">
                <h2 className="font-display text-4xl font-black uppercase tracking-tight text-cream sm:text-5xl">
                  Your Archive
                </h2>
                <p className="mt-2 font-sans text-sm font-medium text-cream/50">
                  Found {wraps.length} {wraps.length === 1 ? "wrap" : "wraps"} for {phone}
                </p>
                <button
                  onClick={handleReset}
                  className="mt-4 font-sans text-xs font-bold uppercase tracking-wider text-green hover:underline"
                >
                  Change Number
                </button>
              </div>

              {wraps.length === 0 ? (
                <div className="rounded-3xl border border-cream/10 bg-cream/5 p-12 text-center backdrop-blur-md">
                  <p className="font-sans text-lg font-medium text-cream/70">
                    No wraps found for this number.
                  </p>
                  <a
                    href="/create"
                    className="mt-6 inline-block rounded-full bg-green px-8 py-3 font-display text-sm font-black uppercase tracking-widest text-ink hover:scale-105 transition-transform"
                  >
                    Create Your First Wrap
                  </a>
                </div>
              ) : (
                <div className={s.wrapGrid}>
                  {wraps.map((wrap, i) => (
                    <motion.div
                      key={wrap.slug}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <WrapCard wrap={wrap} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
