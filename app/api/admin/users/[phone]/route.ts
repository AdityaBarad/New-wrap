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
  props: { params: Promise<{ phone: string }> }
) {
  try {
    const params = await props.params
    const { phone } = params
    const body = await req.json()
    
    if (!phone) {
      return NextResponse.json({ error: "Phone parameter is required" }, { status: 400 })
    }

    const { called, call_status, admin_notes } = body

    const supabase = getSupabase()
    
    const { data, error } = await supabase
      .from("users")
      .update({
        called,
        call_status,
        admin_notes
      })
      .eq("phone", decodeURIComponent(phone))
      .select()
      .single()

    if (error) {
      console.error("[admin-users] DB update error:", error)
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: data })
  } catch (err) {
    console.error("[admin-users] Unexpected error:", err)
    Sentry.captureException(err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
