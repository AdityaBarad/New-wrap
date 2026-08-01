"use client"

import { ArrowUpRight } from "lucide-react"
import { motion } from "@/components/wrapped/motion"
import { Starburst, Checker } from "@/components/wrapped/shapes"
import { Field } from "@/components/wrapped/field"
import { PURPOSES, useWrap } from "@/context/wrap-context"
import { cn } from "@/lib/utils"
import { PhoneVerifier } from "@/components/auth/phone-verifier"
import { trackEvent, identifyUser, updateProfile } from "@/lib/mixpanel"

export function StageOne() {
  const { data, update, submitStage1, loading, error } = useWrap()

  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      {/* LEFT — branding panel */}
      <section className="relative flex flex-col justify-between overflow-hidden border-b-4 border-ink bg-green px-6 py-10 md:px-10 lg:border-b-0 lg:border-r-4">
        <Starburst
          className="pointer-events-none absolute -right-24 -top-24 size-80 opacity-30"
          color="var(--wr-ink)"
          spikes={16}
          spin
        />
        <div className="relative z-10 flex items-center gap-2 font-display text-sm font-black uppercase tracking-widest text-ink">
          <span className="rounded-full bg-ink px-3 py-1 text-cream">★ 2026</span>
          Your Life, Wrapped
        </div>

        <div className="relative z-10 my-10">
          <h1 className="font-display text-[19vw] font-black uppercase leading-[0.8] tracking-tighter text-ink lg:text-[8rem] xl:text-[9.5rem]">
            <span className="block">Make</span>
            <span className="block italic text-cream">your</span>
            <span className="block">year</span>
            <span className="block text-pink text-stroke-ink">loud.</span>
          </h1>
          <p className="mt-6 max-w-sm text-pretty font-sans text-base font-semibold leading-relaxed text-ink/80">
            Two minutes of inputs. One cinematic, screenshot-bait rollout of your entire year. No chill included.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-display text-sm font-black uppercase text-ink/70">
          <span>4.2M+ wraps</span>
          <span>190M memories</span>
          <span>Free · Instant</span>
        </div>
      </section>

      {/* RIGHT — onboarding form */}
      <section className="relative flex items-center justify-center overflow-y-auto bg-ink px-6 py-12 md:px-10">
        <Starburst
          className="pointer-events-none absolute -left-20 bottom-10 size-56 opacity-20"
          color="var(--wr-purple)"
          spikes={12}
        />
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="relative rounded-2xl border-4 border-cream bg-card p-6 shadow-[8px_8px_0_0_var(--wr-purple)] md:p-8">
            <Checker className="absolute right-5 top-5 size-8" color="var(--wr-yellow)" />
            <p className="font-display text-xs font-black uppercase tracking-widest text-green">Step 01 / Lead Capture</p>
            <h2 className="mt-1 font-display text-3xl font-black uppercase leading-none text-foreground md:text-4xl">
              Start your mix
            </h2>

            <div className="mt-6 flex flex-col gap-4">
              <Field
                label="Your Name"
                placeholder="e.g. Alex the Legend"
                value={data.name}
                onChange={(e) => update({ name: e.target.value })}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="What's this for?"
                  optional
                  placeholder="a gift, a flex..."
                  value={data.whatsThisFor}
                  onChange={(e) => update({ whatsThisFor: e.target.value })}
                />
                <Field
                  label="Promo / Referral"
                  optional
                  placeholder="WRAP2026"
                  value={data.promoCode}
                  onChange={(e) => update({ promoCode: e.target.value })}
                />
              </div>

              {/* Purpose pills */}
              <div>
                <span className="mb-2 block font-display text-xs font-black uppercase tracking-widest text-foreground/70">
                  Pick your purpose
                </span>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {PURPOSES.map((p) => {
                    const active = data.purpose === p.id
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => update({ purpose: p.id })}
                        className={cn(
                          "group relative overflow-hidden rounded-md border-2 px-3 py-2.5 text-left font-display text-xs font-black uppercase leading-tight tracking-wide transition-all",
                          active
                            ? "-rotate-1 scale-[1.02] border-ink text-ink"
                            : "border-foreground/20 text-foreground hover:border-cream",
                        )}
                        style={active ? { backgroundColor: p.color } : undefined}
                      >
                        {p.label}
                        <span
                          className={cn(
                            "mt-0.5 block font-sans text-[10px] font-semibold normal-case tracking-normal",
                            active ? "text-ink/70" : "text-foreground/40",
                          )}
                        >
                          {p.tag}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {error && (
                <p className="rounded-md border-2 border-orange bg-orange/10 px-3 py-2 font-display text-xs font-bold uppercase text-orange">
                  {error}
                </p>
              )}

              <div className="mt-4 border-t-2 border-cream/10 pt-6">
                <span className="mb-4 block text-center font-display text-xs font-black uppercase tracking-widest text-cream">
                  Verify & Continue
                </span>
                <PhoneVerifier 
                  initialPhone={data.phone}
                  buttonText="Start My Mix"
                  disabled={!data.name.trim() || !data.purpose}
                  disabledMessage="Drop your name and pick a vibe first."
                  onSuccess={(phone) => {
                    update({ phone })
                    
                    // Mixpanel Tracking
                    identifyUser(phone)
                    updateProfile({
                      $name: data.name,
                      Phone: phone,
                      Purpose: data.purpose,
                      "Journey Stage": "Lead Form Filled",
                    })
                    trackEvent("Lead Form Filled", {
                      purpose: data.purpose,
                      promo_code: data.promoCode,
                      whats_this_for: data.whatsThisFor,
                    })

                    submitStage1(phone)
                  }}
                />
              </div>

              <p className="text-center font-sans text-[11px] font-medium text-foreground/40 mt-4">
                By continuing you agree to have the best rollout of the year.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
