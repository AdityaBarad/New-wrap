import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateSlug } from "@/lib/slug"

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

    // 3. Insert wrap row into database as draft
    const { error: dbError } = await supabase.from("wraps").insert({
      phone: wrapData.phone,
      slug,
      name: wrapData.name,
      purpose: wrapData.purpose,
      user_names: wrapData.userNames || null,
      anniversary_date: wrapData.anniversaryDate || null,
      destination_city: wrapData.destinationCity || null,
      travel_hours: wrapData.travelHours || null,
      delusional_habit: wrapData.delusionalHabit || null,
      birth_year: wrapData.birthYear || null,
      story_paragraph: wrapData.storyParagraph || null,
      status: "draft",
      is_active: false // By default inactive, elite will make it active
    })

    if (dbError) {
      console.error("[save-draft] DB insert error:", dbError)
      return NextResponse.json({ error: "Failed to save draft", details: dbError }, { status: 500 })
    }

    return NextResponse.json({ slug })
  } catch (err: any) {
    console.error("[save-draft] Unexpected error:", err)
    return NextResponse.json({ error: "Failed to save draft", details: err.message || err }, { status: 500 })
  }
}
