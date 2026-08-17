import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { slug, password } = body

    if (!slug || password === undefined) {
      return NextResponse.json(
        { error: "Slug and password are required" },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Fetch the stored password for the given slug
    const { data: wrap, error: dbError } = await supabase
      .from("wraps")
      .select("password")
      .eq("slug", slug)
      .single()

    if (dbError || !wrap) {
      return NextResponse.json(
        { error: "Wrap not found" },
        { status: 404 }
      )
    }

    // Compare the provided password with the stored password
    if (wrap.password === password) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      )
    }
  } catch (err) {
    console.error("[verify-password] Unexpected error:", err)
    return NextResponse.json(
      { error: "Failed to verify password" },
      { status: 500 }
    )
  }
}
