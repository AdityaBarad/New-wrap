import { ImageResponse } from "next/og"
import { createClient } from "@supabase/supabase-js"
import { getCardColor } from "@/lib/color"

export const alt = "Story Wrapped"
export const size = { width: 1080, height: 1080 }
export const contentType = "image/png"
export const dynamic = "force-dynamic"

// Supabase client for fetching wrap data
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const PURPOSE_LABELS: Record<string, string> = {
  couple: "COUPLE",
  travel: "TRAVEL",
  birthday: "BIRTHDAY",
  life: "LIFE",
  group: "GROUP / FAMILY",
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = getSupabase()
  const { data: wrap, error } = await supabase
    .from("wraps")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (!wrap) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#0b0b0b", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#fff", fontSize: 60, fontWeight: "bold" }}>Wrap Not Found</div>
          {error && <div style={{ color: "#ff4444", fontSize: 30, marginTop: 20 }}>Error: {error.message}</div>}
          <div style={{ color: "#888", fontSize: 30, marginTop: 20 }}>Slug: {slug}</div>
        </div>
      ),
      { ...size }
    )
  }

  const cardColor = wrap.card_color || getCardColor(wrap.slug)
  const label = PURPOSE_LABELS[wrap.purpose] ?? wrap.purpose?.toUpperCase() ?? "WRAP"
  
  const photos = wrap.photo_urls || []
  const photo1 = photos[0] || wrap.personality_image_url
  const photo2 = photos.length > 1 ? photos[1] : null
  const photo3 = photos.length > 2 ? photos[2] : null

  const names = wrap.user_names
    ? wrap.user_names.split(",").map((n: string) => n.trim()).filter(Boolean)
    : []
  const subtitle = names.length > 0 ? `With ${names.join(", ")}` : ""

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#18181b", // dark background surrounding the card
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: cardColor,
            borderRadius: 60,
            padding: 60,
            position: "relative",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", position: "absolute", top: 60, left: 60 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://www.wrapsy.co/logo/logo-solid.jpeg" 
              width="80" 
              height="80" 
              style={{ borderRadius: 16 }} 
              alt="Wrapsy"
            />
          </div>

          {/* Badge */}
          <div style={{ display: "flex", position: "absolute", top: 60, right: 60 }}>
            <div style={{ 
              color: "#000", 
              fontSize: 32, 
              fontWeight: 900, 
              letterSpacing: "0.1em",
              textTransform: "uppercase" 
            }}>
              {label}
            </div>
          </div>

          {/* Photos Area */}
          <div style={{ 
            display: "flex", 
            width: "100%", 
            flex: 1, 
            alignItems: "center", 
            justifyContent: "center",
            position: "relative",
            marginTop: 40
          }}>
            {/* 3 Photos */}
            {photo1 && photo2 && photo3 ? (
              <div style={{ display: "flex", position: "relative", width: 700, height: 400, alignItems: "center", justifyContent: "center" }}>
                <img src={photo2} style={{ position: "absolute", left: 0, width: 340, height: 340, borderRadius: 170, objectFit: "cover" }} alt="" />
                <img src={photo3} style={{ position: "absolute", right: 0, width: 340, height: 340, borderRadius: 170, objectFit: "cover" }} alt="" />
                <img src={photo1} style={{ position: "absolute", zIndex: 10, width: 420, height: 420, borderRadius: 210, objectFit: "cover", border: `12px solid ${cardColor}` }} alt="" />
              </div>
            ) : photo1 && photo2 ? (
              <div style={{ display: "flex", position: "relative", width: 600, height: 400, alignItems: "center", justifyContent: "center" }}>
                <img src={photo2} style={{ position: "absolute", left: 0, width: 340, height: 340, borderRadius: 170, objectFit: "cover" }} alt="" />
                <img src={photo1} style={{ position: "absolute", right: 0, zIndex: 10, width: 420, height: 420, borderRadius: 210, objectFit: "cover", border: `12px solid ${cardColor}` }} alt="" />
              </div>
            ) : photo1 ? (
              <img src={photo1} style={{ width: 500, height: 500, borderRadius: 250, objectFit: "cover" }} alt="" />
            ) : null}
          </div>

          {/* Name & Subtitle */}
          <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
            <div style={{ 
              color: "#000", 
              fontSize: 80, 
              fontWeight: 900, 
              lineHeight: 1,
              letterSpacing: "-0.02em"
            }}>
              {wrap.name}
            </div>
          </div>
        </div>

        {/* Subtitle below card */}
        {subtitle && (
          <div style={{ display: "flex", marginTop: 40, width: "100%", justifyContent: "flex-start", paddingLeft: 20 }}>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 40, fontWeight: 700 }}>
              {subtitle}
            </div>
          </div>
        )}
      </div>
    ),
    { ...size }
  )
}
