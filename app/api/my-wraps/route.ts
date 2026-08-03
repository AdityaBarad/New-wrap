import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(req: Request) {
  try {
    const { phone } = await req.json()

    if (!phone || typeof phone !== "string") {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    const supabase = getSupabase()

    // Fetch wraps associated with this phone number
    const { data: wraps, error } = await supabase
      .from("wraps")
      .select("slug, name, purpose, created_at, personality_image_url, photo_urls, user_names")
      .eq("phone", phone)
      .eq("status", "generated")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[my-wraps] Error fetching wraps:", error)
      return NextResponse.json({ error: "Failed to fetch wraps" }, { status: 500 })
    }

    return NextResponse.json({ wraps })
  } catch (err) {
    console.error("[my-wraps] Unexpected error:", err)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
