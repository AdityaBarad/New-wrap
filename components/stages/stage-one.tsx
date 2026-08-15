"use client"

import { useState, useEffect } from "react"

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
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    const savedPhone = localStorage.getItem("verified_phone")
    const savedName = localStorage.getItem("wrap_name")
    if (savedPhone && savedName && !data.phone && !data.name) {
      update({ phone: savedPhone, name: savedName })
      setHasSession(true)
    }
  }, [data.phone, data.name, update])

  const handleSessionContinue = () => {
    identifyUser(data.phone)
    updateProfile({ $name: data.name, $phone: data.phone })
    trackEvent("Lead Form Filled", { draft_session_id: draftSessionId, returning_user: true })
    submitStage1(data.phone)
  }

  const clearSession = () => {
    localStorage.removeItem("verified_phone")
    localStorage.removeItem("wrap_name")
    update({ phone: "", name: "" })
    setHasSession(false)
  }

  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      {/* LEFT — branding panel */}
      <section className="relative flex flex-col justify-between overflow-hidden border-b-4 border-ink bg-green px-6 py-6 md:px-10 lg:border-b-0 lg:border-r-4 lg:py-10">
        <Starburst
          className="pointer-events-none absolute -right-24 -top-24 size-64 opacity-30 lg:size-80"
          color="var(--wr-ink)"
          spikes={16}
          spin
        />
        <div className="relative z-10 flex items-center gap-2 font-display text-xs font-black uppercase tracking-widest text-ink lg:text-sm">
          <span className="rounded-full bg-ink px-3 py-1 text-cream">★ 2026</span>
          Your Story, Wrapped
        </div>

        <div className="relative z-10 my-6 lg:my-10">
          <h1 className="font-display text-[15vw] font-black uppercase leading-[0.85] tracking-tighter text-ink sm:text-[19vw] lg:text-[8rem] xl:text-[9.5rem]">
            <span className="block">Make</span>
            <span className="block italic text-cream">your</span>
            <span className="block">story</span>
            <span className="block text-pink text-stroke-ink">loud.</span>
          </h1>
          <p className="mt-4 max-w-sm text-pretty font-sans text-sm font-semibold leading-relaxed text-ink/80 lg:mt-6 lg:text-base">
            Two minutes of inputs. One cinematic, screenshot-bait rollout of your entire story. No chill included.
          </p>
        </div>


      </section>

      {/* RIGHT — onboarding form */}
      <section className="relative flex items-center justify-center overflow-y-auto bg-ink px-6 py-8 md:px-10 lg:py-12">
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
              {!hasSession && (
                <Field
                  label="Your Name"
                  placeholder="e.g. Alex the Legend"
                  value={data.name}
                  onChange={(e) => update({ name: e.target.value })}
                  disabled={verifierStep === "CODE"}
                />
              )}



              {error && (
                <p className="rounded-md border-2 border-orange bg-orange/10 px-3 py-2 font-display text-xs font-bold uppercase text-orange">
                  {error}
                </p>
              )}

              <div>
                {hasSession ? (
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={handleSessionContinue}
                      disabled={loading || !data.name.trim()}
                      className="group flex flex-col w-full items-center justify-center gap-0.5 rounded-full bg-cream px-6 py-3 font-display text-sm font-black uppercase tracking-widest text-ink transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Loading...</span>
                      ) : (
                        <>
                          <span>Continue as {data.name || "User"}</span>
                          <span className="font-sans text-[10px] font-bold text-ink/60 normal-case tracking-widest">
                            {data.phone}
                          </span>
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      onClick={clearSession}
                      className="text-xs text-foreground/50 font-medium text-center hover:text-foreground hover:underline"
                    >
                      Not you? Change details
                    </button>
                  </div>
                ) : (
                  <PhoneVerifier 
                    initialPhone={data.phone}
                    buttonText="Start My Mix"
                    disabled={!data.name.trim()}
                    onStepChange={setVerifierStep}
                    onSuccess={(phone) => {
                      update({ phone })
                      localStorage.setItem("wrap_name", data.name)
                      
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
                )}
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
