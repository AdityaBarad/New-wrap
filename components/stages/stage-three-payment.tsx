"use client"

import { useState } from "react"
import { motion } from "@/components/wrapped/motion"
import { useWrap } from "@/context/wrap-context"
import { useRazorpay } from "react-razorpay"
import { Check, Sparkles } from "lucide-react"

export function StageThreePayment() {
  const { data, wrapSlug, generateWrap, error } = useWrap()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const { Razorpay } = useRazorpay()

  const handlePayment = async (planName: string, price: number) => {
    setLoadingPlan(planName)
    setPaymentError(null)

    try {
      // 1. Create Order
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName, wrapSlug }),
      })

      if (!res.ok) throw new Error("Failed to create order")
      const { order, planId } = await res.json()

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: "Spotify Wrap",
        description: `Payment for ${planName} plan`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                wrapSlug,
                planId,
                planName,
                amount: order.amount / 100,
              }),
            })

            if (!verifyRes.ok) throw new Error("Payment verification failed")
            
            // 4. Trigger AI Generation
            await generateWrap(planName)
          } catch (err: any) {
            setPaymentError(err.message || "Payment verification failed")
            setLoadingPlan(null)
          }
        },
        prefill: {
          name: data.name,
          contact: data.phone,
        },
        theme: {
          color: "#9333EA", // purple
        },
      }

      const rzp = new Razorpay(options)
      rzp.on("payment.failed", (response: any) => {
        setPaymentError(response.error.description)
        setLoadingPlan(null)
      })
      rzp.open()
    } catch (err: any) {
      setPaymentError(err.message || "Failed to initialize payment")
      setLoadingPlan(null)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-ink px-4 py-12 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="relative z-10 mx-auto w-full max-w-4xl"
      >
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border-2 border-cream/20 bg-cream/10 px-4 py-1.5 font-display text-xs font-black uppercase tracking-widest text-cream">
            Step 03 / Choose Your Vibe
          </span>
          <h2 className="mt-6 font-display text-4xl font-black uppercase tracking-tighter text-foreground md:text-6xl">
            Select your <span className="text-purple">Wrap Plan</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-lg font-medium text-foreground/60">
            Choose how you want to experience your personalized AI Wrap.
          </p>
        </div>

        {paymentError && (
          <div className="mb-8 rounded-lg border-2 border-orange bg-orange/10 p-4 text-center font-display text-sm font-bold uppercase text-orange">
            {paymentError}
          </div>
        )}
        {error && (
          <div className="mb-8 rounded-lg border-2 border-orange bg-orange/10 p-4 text-center font-display text-sm font-bold uppercase text-orange">
            {error}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {/* Basic Plan */}
          <div className="relative flex flex-col rounded-3xl border-4 border-foreground/10 bg-card p-8 transition-colors hover:border-foreground/20">
            <h3 className="font-display text-2xl font-black uppercase text-foreground">Basic Plan</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-5xl font-black text-foreground">₹700</span>
            </div>
            
            <ul className="my-8 flex flex-col gap-4 font-sans text-sm font-medium text-foreground/80">
              <li className="flex items-center gap-3"><Check className="size-5 text-green" /> Delivery in 1-2 Days</li>
              <li className="flex items-center gap-3"><Check className="size-5 text-green" /> Half Slides Experience</li>
              <li className="flex items-center gap-3"><Check className="size-5 text-green" /> Standard Images</li>
              <li className="flex items-center gap-3"><Check className="size-5 text-green" /> 6 Months Hosting</li>
              <li className="flex items-center gap-3 opacity-40"><Check className="size-5" /> No Background Song</li>
            </ul>

            <button
              onClick={() => handlePayment("basic", 700)}
              disabled={!!loadingPlan}
              className="mt-auto flex w-full items-center justify-center rounded-xl bg-foreground/10 px-6 py-4 font-display text-sm font-black uppercase tracking-wide text-foreground transition-colors hover:bg-foreground/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingPlan === "basic" ? "Processing..." : "Select Basic"}
            </button>
          </div>

          {/* Elite Plan */}
          <div className="relative flex flex-col rounded-3xl border-4 border-purple bg-card p-8 shadow-[8px_8px_0_0_var(--wr-purple)]">
            <div className="absolute -top-4 right-8 inline-flex items-center gap-1 rounded-full bg-purple px-3 py-1 font-display text-xs font-black uppercase tracking-wider text-white">
              <Sparkles className="size-3" /> Recommended
            </div>
            <h3 className="font-display text-2xl font-black uppercase text-foreground">Elite Plan</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-5xl font-black text-purple">₹1500</span>
            </div>
            
            <ul className="my-8 flex flex-col gap-4 font-sans text-sm font-bold text-foreground/90">
              <li className="flex items-center gap-3"><Check className="size-5 text-purple" /> Instant Delivery</li>
              <li className="flex items-center gap-3"><Check className="size-5 text-purple" /> Full Cinematic Slides</li>
              <li className="flex items-center gap-3"><Check className="size-5 text-purple" /> All Images Included</li>
              <li className="flex items-center gap-3"><Check className="size-5 text-purple" /> Background Song Included</li>
              <li className="flex items-center gap-3"><Check className="size-5 text-purple" /> 1 Year Hosting</li>
              <li className="flex items-center gap-3"><Check className="size-5 text-purple" /> Priority Support</li>
            </ul>

            <button
              onClick={() => handlePayment("elite", 1500)}
              disabled={!!loadingPlan}
              className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-purple px-6 py-4 font-display text-sm font-black uppercase tracking-wide text-white transition-transform hover:-rotate-1 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingPlan === "elite" ? "Processing..." : (
                <>
                  <Sparkles className="size-4" />
                  Get Elite Experience
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
