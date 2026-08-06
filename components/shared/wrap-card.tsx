import React from "react"
import s from "./wrap-card.module.css"
import { getCardColor } from "@/lib/color"

export type WrapCardProps = {
  name: string
  purpose: string
  slug: string
  photos?: string[]
  userNames?: string | null
  personalityImageUrl?: string | null
  cardColor?: string
  href?: string
}

/* ──────────── purpose → display label ──────────── */
const PURPOSE_LABELS: Record<string, string> = {
  couple: "COUPLE",
  travel: "TRAVEL",
  birthday: "BIRTHDAY",
  life: "LIFE",
  group: "GROUP / FAMILY",
}

export function WrapCard({ wrap }: { wrap: WrapCardProps }) {
  const photos = wrap.photos ?? []
  const label = PURPOSE_LABELS[wrap.purpose] ?? wrap.purpose?.toUpperCase() ?? "WRAP"
  
  // Use provided cardColor from DB, fallback to deterministic calculation
  const cardColor = wrap.cardColor || getCardColor(wrap.slug)

  // Build subtitle from user_names (comma-separated in DB)
  const names = wrap.userNames
    ? wrap.userNames
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean)
    : []

  const subtitle = names.length > 0 ? `With ${names.join(", ")}` : ""

  const InnerContent = (
    <>
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
          ) : wrap.personalityImageUrl ? (
            <img src={wrap.personalityImageUrl} alt="" className={`${s.circleImage} ${s.fallbackCircle}`} />
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

        {/* Play button (visible on hover) - only if clickable */}
        {wrap.href && (
          <div className={s.playButton}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', color: '#000', marginLeft: '2px' }}>
              <path d="M7 6v12l10-6z" />
            </svg>
          </div>
        )}
      </div>

      {/* ── subtitle (user names) below the colored square ── */}
      {subtitle && <p className={s.subtitle}>{subtitle}</p>}
    </>
  )

  if (wrap.href) {
    return (
      <a href={wrap.href} className={s.card}>
        {InnerContent}
      </a>
    )
  }

  return (
    <div className={s.card}>
      {InnerContent}
    </div>
  )
}
