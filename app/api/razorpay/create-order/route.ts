import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { createClient } from "@supabase/supabase-js"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
  try {
    const { planName, wrapSlug } = await req.json()

    if (!planName || !wrapSlug) {
      return NextResponse.json({ error: "Missing plan or wrap slug" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    // Fetch plan details
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("name", planName)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const amountInPaise = Math.round(plan.price * 100)

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${wrapSlug}`,
    })

    return NextResponse.json({ order, planId: plan.id })
  } catch (error) {
    console.error("Razorpay order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
