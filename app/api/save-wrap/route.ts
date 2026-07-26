import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateSlug } from "@/lib/slug"

// Use service-level client for storage uploads + DB writes
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

/**
 * Upload a base64-encoded image to Supabase Storage.
 * Returns the public URL, or null on failure.
 */
async function uploadToStorage(
  supabase: ReturnType<typeof createClient>,
  bucket: string,
  path: string,
  base64Data: string,
  contentType: string,
): Promise<string | null> {
  try {
    // Strip data URL prefix if present (e.g. "data:image/png;base64,")
    const raw = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data

    // Convert base64 → Uint8Array
    const bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0))

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, bytes, {
        contentType,
        upsert: true,
      })

    if (error) {
      console.error(`[save-wrap] Storage upload error for ${path}:`, error.message)
      return null
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return urlData.publicUrl
  } catch (err) {
    console.error(`[save-wrap] Upload failed for ${path}:`, err)
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      wrapData,
      aiContent,
      personalityImageBase64,
      photos, // Array of { name: string, base64: string }
    } = body

    if (!wrapData || !aiContent) {
      return NextResponse.json(
        { error: "wrapData and aiContent are required" },
        { status: 400 },
      )
    }

    if (!wrapData.slug) {
      return NextResponse.json(
        { error: "wrapData.slug is required" },
        { status: 400 },
      )
    }

    const supabase = getSupabase()
    const slug = wrapData.slug

    // 2. Upload personality card image (if provided)
    let personalityImageUrl: string | null = null
    if (personalityImageBase64) {
      personalityImageUrl = await uploadToStorage(
        supabase,
        "wrap-assets",
        `${slug}/personality.png`,
        personalityImageBase64,
        "image/png",
      )
    }

    // 3. Upload user photos (if provided)
    const photoUrls: string[] = []
    if (photos && Array.isArray(photos)) {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]
        if (!photo?.base64) continue

        let contentType = "image/jpeg"
        if (photo.base64.startsWith("data:")) {
          const match = photo.base64.match(/^data:([^;]+);/)
          if (match) contentType = match[1]
        }

        const ext = contentType.includes("png") ? "png" : "jpg"
        const url = await uploadToStorage(
          supabase,
          "wrap-assets",
          `${slug}/photos/photo-${i + 1}.${ext}`,
          photo.base64,
          contentType,
        )
        if (url) photoUrls.push(url)
      }
    }

    // 4. Update wrap row in database
    const { data: row, error: dbError } = await supabase
      .from("wraps")
      .update({
        photo_urls: photoUrls.length > 0 ? photoUrls : null,
        song_video_id: wrapData.song?.videoId || null,
        song_title: wrapData.song?.title || null,
        song_artist: wrapData.song?.artist || null,
        song_thumbnail: wrapData.song?.thumbnail || null,
        ai_content: aiContent,
        personality_image_url: personalityImageUrl,
        status: "generated"
      })
      .eq("slug", slug)
      .select("slug")
      .single()

    if (dbError) {
      console.error("[save-wrap] DB update error:", dbError)
      return NextResponse.json(
        { error: "Failed to update wrap" },
        { status: 500 },
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin
    const wrapUrl = `${baseUrl}/wrap/${slug}`

    return NextResponse.json({
      slug,
      url: wrapUrl,
    })
  } catch (err) {
    console.error("[save-wrap] Unexpected error:", err)
    return NextResponse.json(
      { error: "Failed to save wrap" },
      { status: 500 },
    )
  }
}
