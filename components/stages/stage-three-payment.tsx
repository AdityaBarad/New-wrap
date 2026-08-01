"use client"

import { useState } from "react"
import { motion } from "@/components/wrapped/motion"
import { useWrap } from "@/context/wrap-context"
import { useRazorpay } from "react-razorpay"
import { trackEvent, updateProfile, incrementProfile } from "@/lib/mixpanel"

function MiniWrapsyLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <path d="M7 9.5c2.5-1 5.5-.8 7.5.5" stroke="#242424" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M6 12c3-1.2 6.5-.9 9 .5" stroke="#242424" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M5.5 14.5c3.5-1.2 7.5-.8 10.5.5" stroke="#242424" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function StageThreePayment() {
  const { data, wrapSlug, generateWrap, error } = useWrap()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const { Razorpay } = useRazorpay()

  const handlePayment = async (planName: string, price: number) => {
    setLoadingPlan(planName)
    setPaymentError(null)
    
    updateProfile({
      "Journey Stage": "Payment Initiated",
      "Selected Plan": planName,
    })
    trackEvent("Payment Initiated", { plan: planName, price })

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName, wrapSlug }),
      })

      if (!res.ok) throw new Error("Failed to create order")
      const { order, planId } = await res.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: "Wrapsy",
        description: `Payment for ${planName} plan`,
        order_id: order.id,
        handler: async (response: any) => {
          let verificationSuccess = false;
          try {
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
            
            verificationSuccess = true;
            updateProfile({
              "Journey Stage": "Payment Completed",
              "Purchased Plan": planName,
            })
            incrementProfile("Total Spent", price)
            trackEvent("Payment Completed", { plan: planName, price })

            await generateWrap(planName)

            updateProfile({ "Journey Stage": "Wrap Generated Successfully" })
            trackEvent("Wrap Generation Completed", { plan: planName })

          } catch (err: any) {
            if (verificationSuccess) {
              updateProfile({
                "Journey Stage": "Wrap Generation Failed",
                "Generation Error": err.message || "Unknown error",
              })
              trackEvent("Wrap Generation Failed", { plan: planName, error_message: err.message })
            } else {
              updateProfile({
                "Journey Stage": "Payment Verification Failed",
                "Last Error": err.message,
              })
              trackEvent("Payment Verification Failed", { plan: planName, error_message: err.message })
            }
            setPaymentError(err.message || "Payment verification failed")
            setLoadingPlan(null)
          }
        },
        prefill: {
          name: data.name,
          contact: data.phone,
        },
        theme: {
          color: "#242424",
        },
      }

      const rzp = new Razorpay(options)
      rzp.on("payment.failed", (response: any) => {
        updateProfile({
          "Journey Stage": "Payment Failed",
          "Last Error": response.error.description,
        })
        trackEvent("Payment Failed", { plan: planName, error_message: response.error.description })
        
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
    <div className="relative min-h-screen w-full overflow-x-hidden px-4 font-sans" style={{ backgroundColor: "#121212", paddingTop: "64px", paddingBottom: "64px" }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="relative z-10 mx-auto w-full max-w-5xl"
      >
        <div className="text-center" style={{ marginBottom: "64px" }}>
          <h2 className="font-sans text-4xl font-bold tracking-tight md:text-5xl" style={{ color: "#ffffff" }}>
            Choose your Wrapsy plan
          </h2>
          <p className="mx-auto max-w-xl font-sans text-base" style={{ color: "#9ca3af", marginTop: "16px" }}>
            Listen without limits on your phone, speaker, and other devices.
          </p>
        </div>

        {paymentError && (
          <div className="mb-8 rounded-md border border-red-500 bg-red-500/10 p-4 text-center text-sm font-semibold text-red-500">
            {paymentError}
          </div>
        )}
        {error && (
          <div className="mb-8 rounded-md border border-red-500 bg-red-500/10 p-4 text-center text-sm font-semibold text-red-500">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:items-stretch">
          
          {/* Basic Plan */}
          <div className="relative flex w-full max-w-sm flex-col rounded-xl p-5 shadow-xl transition-transform hover:scale-[1.02]" style={{ backgroundColor: "#242424" }}>
            {/* Top Badge */}
            <div className="absolute rounded px-2 py-1 text-xs font-bold" style={{ top: "-12px", left: "16px", backgroundColor: "#ffd2d7", color: "#181818" }}>
              Most Popular
            </div>

            <div className="flex items-center gap-2" style={{ marginTop: "16px", color: "#ffffff" }}>
              <MiniWrapsyLogo className="size-5" />
              <span className="text-sm font-bold">Wrapsy</span>
            </div>
            
            <h3 className="mt-2 text-3xl font-black" style={{ color: "#ffd2d7" }}>Basic</h3>
            
            <div className="mt-2" style={{ color: "#ffffff" }}>
              <div className="font-semibold">₹700</div>
              <div className="text-sm" style={{ color: "#9ca3af" }}>One-time payment</div>
            </div>

            <hr className="my-6 border-0 h-px" style={{ backgroundColor: "#3e3e3e" }} />
            
            <ul className="flex flex-col gap-3 text-sm" style={{ color: "#ffffff" }}>
              <li className="flex items-start gap-2"><span className="mt-1 size-1 shrink-0 rounded-full" style={{ backgroundColor: "#ffffff" }} /> Delivery in 1-2 Days</li>
              <li className="flex items-start gap-2"><span className="mt-1 size-1 shrink-0 rounded-full" style={{ backgroundColor: "#ffffff" }} /> Half Slides Experience</li>
              <li className="flex items-start gap-2"><span className="mt-1 size-1 shrink-0 rounded-full" style={{ backgroundColor: "#ffffff" }} /> Standard Images</li>
              <li className="flex items-start gap-2"><span className="mt-1 size-1 shrink-0 rounded-full" style={{ backgroundColor: "#ffffff" }} /> 6 Months Hosting</li>
              <li className="flex items-start gap-2 opacity-50"><span className="mt-1 size-1 shrink-0 rounded-full" style={{ backgroundColor: "#9ca3af" }} /> No Background Song</li>
            </ul>

            <button
              onClick={() => handlePayment("basic", 700)}
              disabled={!!loadingPlan}
              className="flex w-full items-center justify-center rounded-full text-base font-bold transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
              style={{ backgroundColor: "#ffd2d7", color: "#181818", paddingTop: "16px", paddingBottom: "16px", marginTop: "40px" }}
            >
              {loadingPlan === "basic" ? "Processing..." : "Get Basic"}
            </button>

            <p className="mt-4 text-[11px] leading-tight" style={{ color: "#9ca3af" }}>
              ₹700 one-time payment. Terms apply. Offer available for users generating a new wrap. Standard processing times apply. <span className="underline cursor-pointer">Terms apply.</span>
            </p>
          </div>

          {/* Elite Plan */}
          <div className="relative flex w-full max-w-sm flex-col rounded-xl p-5 shadow-xl transition-transform hover:scale-[1.02]" style={{ backgroundColor: "#242424" }}>
            {/* Top Badge */}
            <div className="absolute rounded px-2 py-1 text-xs font-bold" style={{ top: "-12px", left: "16px", backgroundColor: "#ffc864", color: "#181818" }}>
              Best Value
            </div>

            <div className="flex items-center gap-2" style={{ marginTop: "16px", color: "#ffffff" }}>
              <MiniWrapsyLogo className="size-5" />
              <span className="text-sm font-bold">Wrapsy</span>
            </div>
            
            <h3 className="mt-2 text-3xl font-black" style={{ color: "#ffc864" }}>Elite</h3>
            
            <div className="mt-2" style={{ color: "#ffffff" }}>
              <div className="font-semibold">₹1500</div>
              <div className="text-sm" style={{ color: "#9ca3af" }}>One-time payment</div>
            </div>

            <hr className="my-6 border-0 h-px" style={{ backgroundColor: "#3e3e3e" }} />
            
            <ul className="flex flex-col gap-3 text-sm" style={{ color: "#ffffff" }}>
              <li className="flex items-start gap-2"><span className="mt-1 size-1 shrink-0 rounded-full" style={{ backgroundColor: "#ffffff" }} /> Instant Delivery</li>
              <li className="flex items-start gap-2"><span className="mt-1 size-1 shrink-0 rounded-full" style={{ backgroundColor: "#ffffff" }} /> Full Cinematic Slides</li>
              <li className="flex items-start gap-2"><span className="mt-1 size-1 shrink-0 rounded-full" style={{ backgroundColor: "#ffffff" }} /> All Images Included</li>
              <li className="flex items-start gap-2"><span className="mt-1 size-1 shrink-0 rounded-full" style={{ backgroundColor: "#ffffff" }} /> Background Song Included</li>
              <li className="flex items-start gap-2"><span className="mt-1 size-1 shrink-0 rounded-full" style={{ backgroundColor: "#ffffff" }} /> 1 Year Hosting</li>
              <li className="flex items-start gap-2"><span className="mt-1 size-1 shrink-0 rounded-full" style={{ backgroundColor: "#ffffff" }} /> Priority Support</li>
            </ul>

            <button
              onClick={() => handlePayment("elite", 1500)}
              disabled={!!loadingPlan}
              className="flex w-full items-center justify-center rounded-full text-base font-bold transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
              style={{ backgroundColor: "#ffc864", color: "#181818", paddingTop: "16px", paddingBottom: "16px", marginTop: "40px" }}
            >
              {loadingPlan === "elite" ? "Processing..." : "Get Elite"}
            </button>

            <p className="mt-4 text-[11px] leading-tight" style={{ color: "#9ca3af" }}>
              ₹1500 one-time payment. Priority delivery and full features included. Offer available for users generating a new wrap. <span className="underline cursor-pointer">Terms apply.</span>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  )
}
