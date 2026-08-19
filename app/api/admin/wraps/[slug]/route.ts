import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import * as Sentry from "@sentry/nextjs"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params
    const { slug } = params
    const body = await req.json()
    
    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 })
    }

    const { 
      wrap_title, purpose, photo_urls, is_active, ai_content, has_password, password,
      user_names, anniversary_date, destination_city, travel_hours, where_did_you_meet,
      location_visited, trip_start_date, number_of_people, delusional_habit, birth_year,
      story_paragraph, song_video_id, song_title, song_artist, card_color
    } = body

    // Convert empty strings to null for optional fields to avoid type/enum constraint errors
    const updatePayload = {
      wrap_title: wrap_title || null,
      purpose: purpose || null,
      photo_urls,
      is_active,
      ai_content,
      has_password,
      password: password || null,
      user_names: user_names || null,
      anniversary_date: anniversary_date || null,
      destination_city: destination_city || null,
      travel_hours: travel_hours || null,
      where_did_you_meet: where_did_you_meet || null,
      location_visited: location_visited || null,
      trip_start_date: trip_start_date || null,
      number_of_people: number_of_people || null,
      delusional_habit: delusional_habit || null,
      birth_year: birth_year || null,
      story_paragraph: story_paragraph || null,
      song_video_id: song_video_id || null,
      song_title: song_title || null,
      song_artist: song_artist || null,
      card_color: card_color || null
    }

    const supabase = getSupabase()
    
    const { data, error } = await supabase
      .from("wraps")
      .update(updatePayload)
      .eq("slug", slug)
      .select()
      .single()

    if (error) {
      console.error("[admin-wraps] DB update error:", error)
      return NextResponse.json({ error: "Failed to update wrap", details: error }, { status: 500 })
    }

    return NextResponse.json({ success: true, wrap: data })
  } catch (err) {
    console.error("[admin-wraps] Unexpected error:", err)
    Sentry.captureException(err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
