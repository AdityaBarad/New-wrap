import { NextRequest, NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"
import { createClient } from "@supabase/supabase-js"
import { generateSlug } from "@/lib/slug"
import { getCardColor } from "@/lib/color"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export async function POST(req: NextRequest) {
  try {
    const { wrapData } = await req.json()
    if (!wrapData) {
      return NextResponse.json({ error: "wrapData is required" }, { status: 400 })
    }

    const supabase = getSupabase()

    // 1. Generate a unique slug
    let slug = generateSlug(wrapData.userNames || "wrap")
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data: existing } = await supabase.from("wraps").select("slug").eq("slug", slug).maybeSingle()
      if (!existing) break
      slug = generateSlug(wrapData.userNames || "wrap")
    }

    // 2. Ensure user exists in users table (upsert)
    await supabase.from("users").upsert({
      phone: wrapData.phone,
      name: wrapData.name,
    }, { onConflict: "phone" })

    // Extract photoUrls if they exist
    const photoUrls: string[] = []
    if (wrapData.photos && Array.isArray(wrapData.photos)) {
      for (let i = 0; i < 14; i++) {
        const photo = wrapData.photos[i]
        if (!photo) {
          photoUrls.push("")
        } else {
          photoUrls.push(photo.url)
        }
      }
    }

    // 3. Insert wrap row into database as draft
    const { error: dbError } = await supabase.from("wraps").insert({
      phone: wrapData.phone,
      slug,
      name: wrapData.name,
      wrap_title: wrapData.wrapTitle || null,
      purpose: wrapData.purpose,
      user_names: wrapData.userNames || null,
      anniversary_date: wrapData.anniversaryDate || null,
      destination_city: wrapData.destinationCity || null,
      travel_hours: wrapData.travelHours || null,
      where_did_you_meet: wrapData.whereDidYouMeet || null,
      location_visited: wrapData.locationVisited || null,
      trip_start_date: wrapData.tripStartDate || null,
      number_of_people: wrapData.numberOfPeople || null,
      delusional_habit: wrapData.delusionalHabit || null,
      birth_year: wrapData.birthYear || null,
      story_paragraph: wrapData.storyParagraph || null,
      photo_urls: photoUrls.length > 0 ? photoUrls : null,
      song_video_id: wrapData.song?.videoId || null,
      song_title: wrapData.song?.title || null,
      song_artist: wrapData.song?.artist || null,
      song_thumbnail: wrapData.song?.thumbnail || null,
      status: "draft",
      is_active: false, // By default inactive, elite will make it active
      card_color: getCardColor(slug)
    })

    if (dbError) {
      console.error("[save-draft] DB insert error:", dbError)
      Sentry.captureException(dbError)
      return NextResponse.json({ error: "Failed to save draft", details: dbError }, { status: 500 })
    }

    return NextResponse.json({ slug })
  } catch (err: any) {
    console.error("[save-draft] Unexpected error:", err)
    Sentry.captureException(err)
    return NextResponse.json({ error: "Failed to save draft", details: err.message || err }, { status: 500 })
  }
}
