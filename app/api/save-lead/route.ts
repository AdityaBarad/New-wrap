import { NextRequest, NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"
import { createClient } from "@supabase/supabase-js"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export async function POST(req: NextRequest) {
  try {
    const { name, phone } = await req.json()
    
    if (phone) {
      Sentry.setUser({ id: phone })
    }
    
    if (!name || !phone) {
      return NextResponse.json({ error: "Name and Phone are required" }, { status: 400 })
    }

    const supabase = getSupabase()

    // Upsert the user to ensure they exist
    const { data, error } = await supabase
      .from("users")
      .upsert({ phone, name }, { onConflict: "phone" })
      .select()
      .single()

    if (error) {
      console.error("[save-lead] DB upsert error:", error)
      Sentry.captureException(new Error(`Supabase Error [save-lead]: ${error.message || JSON.stringify(error)}`))
      return NextResponse.json({ error: "Failed to save lead" }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: data })
  } catch (err) {
    console.error("[save-lead] Unexpected error:", err)
    Sentry.captureException(err)
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 })
  }
}
