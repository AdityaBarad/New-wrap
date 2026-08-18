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

    const { wrap_title, purpose, photo_urls, is_active, ai_content } = body

    const supabase = getSupabase()
    
    const { data, error } = await supabase
      .from("wraps")
      .update({
        wrap_title,
        purpose,
        photo_urls,
        is_active,
        ai_content
      })
      .eq("slug", slug)
      .select()
      .single()

    if (error) {
      console.error("[admin-wraps] DB update error:", error)
      return NextResponse.json({ error: "Failed to update wrap" }, { status: 500 })
    }

    return NextResponse.json({ success: true, wrap: data })
  } catch (err) {
    console.error("[admin-wraps] Unexpected error:", err)
    Sentry.captureException(err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
