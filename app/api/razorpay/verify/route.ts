import { NextRequest, NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, wrapSlug, planId, amount, planName } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !wrapSlug) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET!

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex")

    if (generated_signature === razorpay_signature) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      // 1. Save payment
      await supabase.from("payments").insert({
        wrap_slug: wrapSlug,
        razorpay_order_id,
        razorpay_payment_id,
        amount,
        status: "successful",
        plan_id: planId,
      })

      // 2. Update wrap with plan and active status
      // Elite -> is_active: true. Basic -> is_active: false (manual activation later)
      const isActive = planName === 'elite'
      
      await supabase
        .from("wraps")
        .update({ plan_id: planId, is_active: isActive })
        .eq("slug", wrapSlug)

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }
  } catch (error) {
    console.error("Razorpay verification error:", error)
    Sentry.captureException(error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
