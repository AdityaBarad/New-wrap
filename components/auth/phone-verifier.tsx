"use client"

import { useState, useEffect, useRef } from "react"
import { auth } from "@/lib/firebase"
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Phone, ShieldCheck, Loader2 } from "lucide-react"

type PhoneVerifierProps = {
  onSuccess: (phone: string) => void
  initialPhone?: string
  buttonText?: string
  disabled?: boolean
  disabledMessage?: string
  onStepChange?: (step: "PHONE" | "CODE") => void
}

const COUNTRY_CODES = [
  { code: "+1", country: "US/CA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+55", country: "BR", flag: "🇧🇷" },
  { code: "+52", country: "MX", flag: "🇲🇽" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
  { code: "+60", country: "MY", flag: "🇲🇾" },
  { code: "+62", country: "ID", flag: "🇮🇩" },
  { code: "+63", country: "PH", flag: "🇵🇭" },
  { code: "+27", country: "ZA", flag: "🇿🇦" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+82", country: "KR", flag: "🇰🇷" },
]

export function PhoneVerifier({ 
  onSuccess, 
  initialPhone = "", 
  buttonText = "Send Code",
  disabled = false,
  disabledMessage = "Please complete the required fields first.",
  onStepChange
}: PhoneVerifierProps) {
  const [countryCode, setCountryCode] = useState("+91")
  const [phoneNumber, setPhoneNumber] = useState(initialPhone.replace(/\D/g, ""))
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE")
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const recaptchaContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Setup invisible reCAPTCHA on mount
    if (!window.recaptchaVerifier && recaptchaContainerRef.current) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved
        },
      })
    }

    return () => {
      // Cleanup
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = undefined
      }
    }
  }, [])

  useEffect(() => {
    onStepChange?.(step === "OTP" ? "CODE" : "PHONE")
  }, [step, onStepChange])

  const fullPhone = `${countryCode}${phoneNumber.replace(/\D/g, "")}`

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber.trim()) return

    // Basic format check (Firebase requires strict E.164 format: +1234567890 without spaces)
    const digitsOnly = fullPhone.replace(/\D/g, "")
    const formattedPhone = `+${digitsOnly}`
    
    if (digitsOnly.length < 8) {
      setError("Number is too short.")
      return
    }

    setLoading(true)
    setError(null)

    // --- DUMMY BYPASS FOR DEVELOPMENT ---
    if (digitsOnly.includes("1234567890")) {
      setTimeout(() => {
        setConfirmationResult({} as any) // Fake confirmation result
        setStep("OTP")
        setLoading(false)
      }, 500)
      return
    }
    // ------------------------------------

    try {
      if (!window.recaptchaVerifier) throw new Error("reCAPTCHA not initialized")
      const appVerifier = window.recaptchaVerifier
      
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier)
      setConfirmationResult(result)
      setStep("OTP")
    } catch (err: any) {
      console.error("SMS Error:", err)
      setError(err.message || "Failed to send SMS. Ensure number includes country code.")
      // Reset reCAPTCHA if it failed
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((widgetId) => {
          grecaptcha.reset(widgetId)
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim() || !confirmationResult) return

    setLoading(true)
    setError(null)

    // --- DUMMY BYPASS FOR DEVELOPMENT ---
    const digitsOnly = fullPhone.replace(/\D/g, "")
    if (digitsOnly.includes("1234567890")) {
      setTimeout(() => {
        if (otp === "000000") {
          onSuccess(`+${digitsOnly}`)
        } else {
          setError("Invalid dummy code. Use 000000.")
        }
        setLoading(false)
      }, 500)
      return
    }
    // ------------------------------------

    try {
      await confirmationResult.confirm(otp)
      // Success! Pass the strictly formatted phone number up to the parent component
      onSuccess(`+${digitsOnly}`)
    } catch (err: any) {
      console.error("OTP Error:", err)
      setError("Invalid code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div ref={recaptchaContainerRef} id="recaptcha-container"></div>
      
      <AnimatePresence mode="wait">
        {step === "PHONE" ? (
          <motion.form
            key="phone-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleSendCode}
            className="flex flex-col gap-4"
          >
            <div className="relative flex w-full rounded-md border-2 border-foreground/20 bg-ink transition-colors focus-within:border-green">
              <div className="relative flex items-center border-r-2 border-foreground/20">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  disabled={loading}
                  className="h-full bg-transparent py-3 pl-4 pr-2 font-sans text-base font-bold text-foreground outline-none focus:text-green cursor-pointer"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={`${c.code}-${c.country}`} value={c.code} className="bg-ink text-foreground font-sans">
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
              </div>
              
              <input
                type="tel"
                placeholder="98765 43210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                className="w-full appearance-none bg-transparent py-3 pl-4 pr-4 font-sans text-base font-medium tracking-wide text-foreground outline-none placeholder:text-foreground/30"
                disabled={loading}
              />
            </div>
            

            {error && <p className="text-center font-sans text-xs font-bold text-orange">{error}</p>}


            <button
              type="submit"
              disabled={loading || !phoneNumber.trim() || disabled}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-cream px-6 py-4 font-display text-sm font-black uppercase tracking-widest text-ink transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : buttonText}
              {!loading && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="otp-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleVerifyOtp}
            className="flex flex-col gap-4"
          >
            <div className="text-center mb-2">
              <p className="font-sans text-sm text-foreground/70">
                Code sent to <span className="font-bold text-foreground">{fullPhone}</span>
              </p>
              <button 
                type="button" 
                onClick={() => setStep("PHONE")}
                className="text-xs text-green font-bold mt-1 hover:underline"
              >
                Change Number
              </button>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <ShieldCheck className="size-5 text-foreground/40" />
              </div>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full rounded-md border-2 border-foreground/20 bg-ink py-3 pl-12 pr-6 font-sans text-center text-lg font-bold tracking-[0.2em] text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-green focus:bg-ink"
                disabled={loading}
              />
            </div>

            {error && <p className="text-center font-sans text-xs font-bold text-orange">{error}</p>}

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-green px-6 py-4 font-display text-sm font-black uppercase tracking-widest text-ink transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : "Verify & Continue"}
              {!loading && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
