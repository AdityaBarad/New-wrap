"use client"

import { useState } from "react"

import { ArrowUpRight } from "lucide-react"
import { motion } from "@/components/wrapped/motion"
import { Starburst, Checker } from "@/components/wrapped/shapes"
import { Field } from "@/components/wrapped/field"
import { PURPOSES, useWrap } from "@/context/wrap-context"
import { cn } from "@/lib/utils"
import { PhoneVerifier } from "@/components/auth/phone-verifier"
import { trackEvent, identifyUser, updateProfile } from "@/lib/mixpanel"

export function StageOne() {
  const { data, update, submitStage1, loading, error, draftSessionId } = useWrap()
  const [verifierStep, setVerifierStep] = useState<"PHONE" | "CODE">("PHONE")

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
          Your Story, Wrapped
        </div>

        <div className="relative z-10 my-10">
          <h1 className="font-display text-[19vw] font-black uppercase leading-[0.8] tracking-tighter text-ink lg:text-[8rem] xl:text-[9.5rem]">
            <span className="block">Make</span>
            <span className="block italic text-cream">your</span>
            <span className="block">story</span>
            <span className="block text-pink text-stroke-ink">loud.</span>
          </h1>
          <p className="mt-6 max-w-sm text-pretty font-sans text-base font-semibold leading-relaxed text-ink/80">
            Two minutes of inputs. One cinematic, screenshot-bait rollout of your entire story. No chill included.
          </p>
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

            <h2 className="mt-1 font-display text-3xl font-black uppercase leading-none text-foreground md:text-4xl">
              Start your mix
            </h2>

            <div className="mt-6 flex flex-col gap-4">
              <Field
                label="Your Name"
                placeholder="e.g. Alex the Legend"
                value={data.name}
                onChange={(e) => update({ name: e.target.value })}
                disabled={verifierStep === "CODE"}
              />

              {error && (
                <p className="rounded-md border-2 border-orange bg-orange/10 px-3 py-2 font-display text-xs font-bold uppercase text-orange">
                  {error}
                </p>
              )}

              <div>
                <PhoneVerifier 
                  initialPhone={data.phone}
                  buttonText="Start My Mix"
                  disabled={!data.name.trim()}
                  onStepChange={setVerifierStep}
                  onSuccess={(phone) => {
                    update({ phone })
                    
                    // Mixpanel Tracking
                    identifyUser(phone)
                    updateProfile({
                      $name: data.name,
                      $phone: phone,
                    })
                    trackEvent("Lead Form Filled", {
                      draft_session_id: draftSessionId,
                    })

                    submitStage1(phone)
                  }}
                />
              </div>

              <p className="text-center font-sans text-[11px] font-medium text-foreground/40 mt-4">
                By continuing you agree to have the best rollout of the era.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
