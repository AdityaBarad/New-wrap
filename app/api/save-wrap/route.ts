import { NextRequest, NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"
import { createClient } from "@supabase/supabase-js"
import { generateSlug } from "@/lib/slug"

// Use service-level client for storage uploads + DB writes
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    if (body?.wrapData?.phone) {
      Sentry.setUser({ id: body.wrapData.phone })
    }
    
    const {
      wrapData,
      aiContent,
      personalityImageUrl,
      photoUrls,
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

    // 2. Update wrap row in database
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
      Sentry.captureException(new Error(`Supabase Error [save-wrap]: ${dbError.message || JSON.stringify(dbError)}`))
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
    Sentry.captureException(err)
    return NextResponse.json(
      { error: "Failed to save wrap" },
      { status: 500 },
    )
  }
}
