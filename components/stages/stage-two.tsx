"use client"

import { useState } from "react"
import { ArrowUpRight, Sparkles, ArrowRight, ArrowLeft } from "lucide-react"
import { motion } from "@/components/wrapped/motion"
import { AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Starburst } from "@/components/wrapped/shapes"
import { Field } from "@/components/wrapped/field"
import { SinglePhotoDropzone } from "@/components/wrapped/dropzone"
import { SongSelector } from "@/components/wrapped/song-selector"
import { PURPOSES, useWrap } from "@/context/wrap-context"
import { AiLoading } from "@/components/stages/ai-loading"
import { trackEvent } from "@/lib/mixpanel"

const STORY_SUGGESTIONS: Record<string, string[]> = {
  couple: [
    "How they (or you) first met — the real, unedited version.",
    "The exact moment it was clear this was love.",
    "The most frequent, ridiculous argument (e.g., AC temperature).",
    "That one inside joke nobody else understands.",
    "The weirdest habit they have that is secretly loved.",
    "A memorable disaster date that everyone laughs about now.",
    "The go-to takeout order when everyone is lazy.",
    "The song that's always playing in the car.",
    "Who always says 'sorry' first after a fight.",
    "The most delusional thing they (or you) both believe.",
    "Their most iconic red flag that was cheerfully ignored.",
    "The best trip or vacation taken together."
  ],
  travel: [
    "The most chaotic thing that happened at the airport.",
    "That one meal everyone still dreams about.",
    "The time someone got incredibly lost and how they survived.",
    "The local phrase that kept being mispronounced.",
    "The biggest cultural shock experienced.",
    "That one tourist trap someone fell for.",
    "The most breathtaking view of the entire trip.",
    "A hilarious miscommunication with a local.",
    "The thing that was forgotten and had to be bought.",
    "The best hidden gem discovered by accident.",
    "How many times someone almost missed a train or flight.",
    "The funniest thing someone in the group did."
  ],
  birthday: [
    "Their (or your) absolute peak moment from the last year.",
    "The most unhinged decision they/you made recently.",
    "Their current hyper-fixation or obsession.",
    "The most played song or artist of the year.",
    "A lesson learned the hard way.",
    "The silliest thing they/you spent money on.",
    "Their most frequently used phrase or slang.",
    "The funniest text message sent or received.",
    "A new habit picked up (good or bad).",
    "The best night out from this year.",
    "The most chaotic era from the past 12 months.",
    "What they/you are most delusional about right now."
  ],
  group: [
    "The inside joke that always derails the group chat.",
    "Who is the 'mom' of the group and who is the 'liability'.",
    "The most chaotic trip or night out you all shared.",
    "The argument that still hasn't been resolved.",
    "The worst advice someone gave in the group chat.",
    "Who always cancels plans at the last minute.",
    "The most iconic quote someone said this year.",
    "Who has the worst taste in partners/food.",
    "A shared enemy or mutual annoyance everyone has.",
    "The time everyone collectively panicked about something.",
    "Who takes the longest to get ready.",
    "The most memorable meal you all had together."
  ],
  life: [
    "Their (or your) main character moment of the year.",
    "The era they/you are currently in (e.g., 'villain era').",
    "The most questionable late-night purchase.",
    "The lie they/you tell themselves the most.",
    "Their weirdest hyper-fixation.",
    "The food they/you couldn't stop eating this year.",
    "The most dramatic reaction to a minor inconvenience.",
    "The biggest 'delusion' that actually came true.",
    "The habit sworn to be dropped but wasn't.",
    "Their/your favorite outfit or style phase.",
    "The funniest thing done completely alone.",
    "The best boundary set for themselves/yourself."
  ]
}

const TITLE_SUGGESTIONS: Record<string, string> = {
  couple: "e.g. Our 1 Year Anniversary",
  travel: "e.g. Euro Trip 2024",
  birthday: "e.g. Alex's 25th Birthday",
  group: "e.g. The Vegas Trip",
  life: "e.g. My Life Wrapped or Sarah Era"
}

const NAME_SUGGESTIONS: Record<string, string> = {
  couple: "e.g. Sam & Riley",
  travel: "e.g. Maya & Jake",
  birthday: "e.g. Alex",
  group: "e.g. The Boyz",
  life: "e.g. Sarah"
}

export function StageTwo() {
  const { data, update, submitStage2, loading, aiLoading, error, draftSessionId } = useWrap()
  const purpose = data.purpose ?? "life"
  const meta = PURPOSES.find((p) => p.id === purpose)!
  const [subStep, setSubStep] = useState(1)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [step1Error, setStep1Error] = useState<string | null>(null)
  const [step3Error, setStep3Error] = useState<string | null>(null)

  // Show the cinematic loading screen while AI is generating
  if (aiLoading) {
    return <AiLoading accentColor={meta.color} />
  }

  // Common properties sent with every step event
  const getCommonEventProps = () => ({
    draft_session_id: draftSessionId,
    name: data.name,
    phone: data.phone,
    purpose: data.purpose,
    wrap_title: data.wrapTitle,
    user_names: data.userNames,
    whats_this_for: data.whatsThisFor,
    has_password: data.hasPassword,
  })

  const handleNext = () => {
    if (subStep === 1) {
      if (!data.wrapTitle || data.wrapTitle.trim() === "") {
        setStep1Error("Wrap Title is required.")
        return
      }
      if (!data.userNames || data.userNames.trim() === "") {
        setStep1Error("User Names is required.")
        return
      }
      if (!data.purpose) {
        setStep1Error("Please select a purpose.")
        return
      }
      if (data.hasPassword) {
        if (!data.password || data.password.trim() === "") {
          setStep1Error("Password cannot be empty.")
          return
        }
        if (data.password !== confirmPassword) {
          setStep1Error("Passwords do not match.")
          return
        }
      }

      // Track: Basic Info step completed
      trackEvent("Step 1 - Basic Info Completed", {
        ...getCommonEventProps(),
      })
    }
    if (subStep === 3) {
      const requiredIndices = [0, 1, 2, 4, 13, 5, 6, 7, 8, 9, 10, 11, 12]
      const missingPhotos = requiredIndices.filter(i => !data.photos?.[i])
      if (missingPhotos.length > 0) {
        setStep3Error("Please upload all required photos before proceeding.")
        return
      }

      // Track: Photos uploaded step completed
      trackEvent("Step 2 - Photos Uploaded", {
        ...getCommonEventProps(),
        photo_count: (data.photos || []).filter(Boolean).length,
        anniversary_date: data.anniversaryDate,
        where_did_you_meet: data.whereDidYouMeet,
        location_visited: data.locationVisited,
        trip_start_date: data.tripStartDate,
        birth_year: data.birthYear,
        number_of_people: data.numberOfPeople,
      })
    }
    if (subStep === 4) {
      // Track: Song selected step completed
      trackEvent("Step 3 - Song Selected", {
        ...getCommonEventProps(),
        photo_count: (data.photos || []).filter(Boolean).length,
        song_title: data.song?.title || null,
        song_artist: data.song?.artist || null,
        has_song: !!data.song,
        anniversary_date: data.anniversaryDate,
        where_did_you_meet: data.whereDidYouMeet,
        location_visited: data.locationVisited,
        trip_start_date: data.tripStartDate,
        birth_year: data.birthYear,
        number_of_people: data.numberOfPeople,
      })
    }
    setStep1Error(null)
    setStep3Error(null)
    setSubStep(s => Math.min(5, s + 1))
  }
  const handlePrev = () => setSubStep(s => Math.max(1, s - 1))

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-ink px-4 py-12 md:px-8">
      <Starburst
        className="pointer-events-none absolute -right-28 top-10 size-80 opacity-20"
        color={meta.color}
        spikes={16}
        spin
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="relative z-10 mx-auto w-full max-w-3xl"
      >
        {/* header */}
        <div className="mb-8">
          <span
            className="inline-block -rotate-2 rounded-full border-2 border-ink px-4 py-1.5 font-display text-xs font-black uppercase tracking-widest text-ink"
            style={{ backgroundColor: meta.color }}
          >
            Memory Deposit ({subStep}/5)
          </span>
          <h2 className="mt-4 font-display text-5xl font-black uppercase leading-[0.85] tracking-tighter text-foreground md:text-7xl">
            Feed the
            <span className="block italic" style={{ color: meta.color }}>
              machine.
            </span>
          </h2>
          <p className="mt-3 max-w-lg font-sans text-base font-medium text-foreground/60">
            {meta.label} selected. Drop the raw materials — we&apos;ll turn your chaos into a cinematic rollout.
          </p>
        </div>

        <div className="rounded-2xl border-4 border-cream bg-card p-6 shadow-[8px_8px_0_0_var(--wr-purple)] md:p-8">
          <AnimatePresence mode="wait">
            {subStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-3">
                  <div className="h-1 flex-1 bg-foreground/10" />
                  <span className="font-display text-xs font-black uppercase tracking-widest" style={{ color: meta.color }}>
                    Basic Info
                  </span>
                  <div className="h-1 flex-1 bg-foreground/10" />
                </div>

                {/* Purpose pills */}
                <div>
                  <span className="mb-2 block font-display text-xs font-black uppercase tracking-widest text-foreground/70">
                    Pick your purpose *
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

                <div className="grid grid-cols-1 gap-4">
                  <Field
                    label="Wrap Title *"
                    placeholder={TITLE_SUGGESTIONS[purpose] || "e.g. Our 1 Year Anniversary"}
                    value={data.wrapTitle}
                    onChange={(e) => update({ wrapTitle: e.target.value })}
                  />
                  <Field
                    label="User Names *"
                    placeholder={NAME_SUGGESTIONS[purpose] || "The names that will be shown in the wrap.  Example - Sam, Sam & Lily"}
                    value={data.userNames}
                    onChange={(e) => update({ userNames: e.target.value })}
                  />
                  <Field
                    label="What's this for?"
                    optional
                    placeholder="a gift, a flex..."
                    value={data.whatsThisFor}
                    onChange={(e) => update({ whatsThisFor: e.target.value })}
                  />
                </div>

                {/* Password Protection */}
                <div className="rounded-xl border-2 border-foreground/10 bg-foreground/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block font-display text-xs font-black uppercase tracking-widest text-foreground">
                        Password Protection
                      </span>
                      <p className="mt-1 font-sans text-[11px] font-medium text-foreground/50">
                        Require a password to view this wrap.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        update({ hasPassword: !data.hasPassword })
                        if (data.hasPassword) {
                          update({ password: "" })
                          setConfirmPassword("")
                          setStep1Error(null)
                        }
                      }}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        data.hasPassword ? "bg-green" : "bg-foreground/20"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          data.hasPassword ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>

                  <AnimatePresence>
                    {data.hasPassword && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Field
                            label="Password"
                            type="password"
                            placeholder="Enter password"
                            value={data.password || ""}
                            onChange={(e) => update({ password: e.target.value })}
                          />
                          <Field
                            label="Confirm Password"
                            type="password"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {step1Error && (
                  <p className="mt-2 text-xs font-semibold text-red-500">{step1Error}</p>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 rounded-full bg-cream px-6 py-3 font-display text-sm font-black uppercase tracking-widest text-ink transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Next <ArrowRight className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {subStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-3">
                  <div className="h-1 flex-1 bg-foreground/10" />
                  <span className="font-display text-xs font-black uppercase tracking-widest" style={{ color: meta.color }}>
                    Context Details
                  </span>
                  <div className="h-1 flex-1 bg-foreground/10" />
                </div>

                {/* conditional fields */}
                <div className="flex flex-col gap-4 min-h-[200px]">
                  {purpose === "couple" && (
                    <div className="grid grid-cols-1 gap-4">
                      <Field
                        label="Anniversary / First Date"
                        type="date"
                        optional
                        value={data.anniversaryDate}
                        onChange={(e) => update({ anniversaryDate: e.target.value })}
                      />
                      <Field
                        label="Where did you meet?"
                        placeholder="e.g. Hinge, college party..."
                        optional
                        value={data.whereDidYouMeet}
                        onChange={(e) => update({ whereDidYouMeet: e.target.value })}
                      />
                    </div>
                  )}

                  {purpose === "travel" && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        label="Location Visited"
                        placeholder="e.g. Tokyo"
                        optional
                        value={data.locationVisited}
                        onChange={(e) => update({ locationVisited: e.target.value })}
                      />
                      <Field
                        label="Trip Start Date"
                        type="date"
                        optional
                        value={data.tripStartDate}
                        onChange={(e) => update({ tripStartDate: e.target.value })}
                      />
                    </div>
                  )}

                  {(purpose === "birthday" || purpose === "life") && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        label="Year of Birth"
                        type="number"
                        placeholder="e.g. 1999"
                        value={data.birthYear}
                        onChange={(e) => update({ birthYear: e.target.value })}
                      />
                    </div>
                  )}

                  {purpose === "group" && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        label="Number of People"
                        type="number"
                        placeholder="e.g. 4"
                        optional
                        value={data.numberOfPeople}
                        onChange={(e) => update({ numberOfPeople: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center gap-2 rounded-full border-2 border-foreground/20 px-6 py-3 font-display text-sm font-black uppercase tracking-widest text-foreground transition-all hover:border-cream"
                  >
                    <ArrowLeft className="size-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 rounded-full bg-cream px-6 py-3 font-display text-sm font-black uppercase tracking-widest text-ink transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Next <ArrowRight className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {subStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-3">
                  <div className="h-1 flex-1 bg-foreground/10" />
                  <span className="font-display text-xs font-black uppercase tracking-widest" style={{ color: meta.color }}>
                    Visual Deposit
                  </span>
                  <div className="h-1 flex-1 bg-foreground/10" />
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <div className="mb-2">
                      <span className="block font-display text-[11px] font-black uppercase tracking-widest text-foreground/75">
                        Your Main Photos
                      </span>
                      <p className="mt-1 font-sans text-[10px] font-medium text-foreground/40 leading-relaxed">
                        Note: Your images will be cropped and displayed exactly as you see them in the square preview boxes below.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                      <SinglePhotoDropzone
                        label="01"
                        slideLayout="intro"
                        photo={data.photos?.[0]}
                        accentColor={meta.color}
                        onChange={(photo) => {
                          const copy = [...(data.photos || [])]
                          copy[0] = photo
                          update({ photos: copy })
                        }}
                        onRemove={() => {
                          const copy = [...(data.photos || [])]
                          delete copy[0]
                          update({ photos: copy })
                        }}
                      />
                      <SinglePhotoDropzone
                        label="02"
                        slideLayout="song"
                        photo={data.photos?.[1]}
                        accentColor={meta.color}
                        onChange={(photo) => {
                          const copy = [...(data.photos || [])]
                          copy[1] = photo
                          update({ photos: copy })
                        }}
                        onRemove={() => {
                          const copy = [...(data.photos || [])]
                          delete copy[1]
                          update({ photos: copy })
                        }}
                      />
                      <SinglePhotoDropzone
                        label="03"
                        slideLayout="stats"
                        photo={data.photos?.[2]}
                        accentColor={meta.color}
                        onChange={(photo) => {
                          const copy = [...(data.photos || [])]
                          copy[2] = photo
                          update({ photos: copy })
                        }}
                        onRemove={() => {
                          const copy = [...(data.photos || [])]
                          delete copy[2]
                          update({ photos: copy })
                        }}
                      />
                      <SinglePhotoDropzone
                        label="04"
                        slideLayout="dashboard"
                        photo={data.photos?.[4]}
                        accentColor={meta.color}
                        onChange={(photo) => {
                          const copy = [...(data.photos || [])]
                          copy[4] = photo
                          update({ photos: copy })
                        }}
                        onRemove={() => {
                          const copy = [...(data.photos || [])]
                          delete copy[4]
                          update({ photos: copy })
                        }}
                      />
                      <SinglePhotoDropzone
                        label="05"
                        slideLayout="quirks"
                        photo={data.photos?.[13]}
                        accentColor={meta.color}
                        onChange={(photo) => {
                          const copy = [...(data.photos || [])]
                          copy[13] = photo
                          update({ photos: copy })
                        }}
                        onRemove={() => {
                          const copy = [...(data.photos || [])]
                          delete copy[13]
                          update({ photos: copy })
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <span className="mb-2 block font-display text-[11px] font-black uppercase tracking-widest text-foreground/75">
                      Top List Images (These photos will appear small)
                    </span>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
                      {[5, 6, 7, 8, 9].map((index) => (
                        <SinglePhotoDropzone
                          key={index}
                          size="small"
                          slideLayout="toplist"
                          photo={data.photos?.[index]}
                          accentColor={meta.color}
                          onChange={(photo) => {
                            const copy = [...(data.photos || [])]
                            copy[index] = photo
                            update({ photos: copy })
                          }}
                          onRemove={() => {
                            const copy = [...(data.photos || [])]
                            delete copy[index]
                            update({ photos: copy })
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="mb-2 block font-display text-[11px] font-black uppercase tracking-widest text-foreground/75">
                      Globe Images (These photos will appear small)
                    </span>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-8 lg:grid-cols-10">
                      {[10, 11, 12].map((index) => (
                        <SinglePhotoDropzone
                          key={index}
                          size="small"
                          slideLayout="globe"
                          photo={data.photos?.[index]}
                          accentColor={meta.color}
                          onChange={(photo) => {
                            const copy = [...(data.photos || [])]
                            copy[index] = photo
                            update({ photos: copy })
                          }}
                          onRemove={() => {
                            const copy = [...(data.photos || [])]
                            delete copy[index]
                            update({ photos: copy })
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {step3Error && (
                  <p className="mt-2 text-center text-xs font-semibold text-red-500">{step3Error}</p>
                )}

                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center gap-2 rounded-full border-2 border-foreground/20 px-6 py-3 font-display text-sm font-black uppercase tracking-widest text-foreground transition-all hover:border-cream"
                  >
                    <ArrowLeft className="size-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 rounded-full bg-cream px-6 py-3 font-display text-sm font-black uppercase tracking-widest text-ink transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Next <ArrowRight className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {subStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-3">
                  <div className="h-1 flex-1 bg-foreground/10" />
                  <span className="flex items-center gap-1.5 font-display text-xs font-black uppercase tracking-widest" style={{ color: meta.color }}>
                    Soundtrack
                  </span>
                  <div className="h-1 flex-1 bg-foreground/10" />
                </div>

                <div className="min-h-[300px]">
                  <SongSelector accentColor={meta.color} />
                </div>

                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center gap-2 rounded-full border-2 border-foreground/20 px-6 py-3 font-display text-sm font-black uppercase tracking-widest text-foreground transition-all hover:border-cream"
                  >
                    <ArrowLeft className="size-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 rounded-full bg-cream px-6 py-3 font-display text-sm font-black uppercase tracking-widest text-ink transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Next <ArrowRight className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {subStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-3">
                  <div className="h-1 flex-1 bg-foreground/10" />
                  <span className="flex items-center gap-1.5 font-display text-xs font-black uppercase tracking-widest" style={{ color: meta.color }}>
                    AI Personalization
                  </span>
                  <div className="h-1 flex-1 bg-foreground/10" />
                </div>

                <div className="flex flex-col gap-4 min-h-[300px]">
                  <div>
                    <label className="font-display text-xs font-black uppercase tracking-widest text-foreground/70">
                      Tell us your story
                      <span className="ml-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal" style={{ backgroundColor: meta.color, color: "var(--wr-ink)" }}>
                        powers AI ✨
                      </span>
                    </label>
                    <p className="mt-1 font-sans text-[11px] font-medium text-foreground/40 leading-relaxed">
                      Enter your story in bullet points (minimum 10 points). The more detail you share, the more personalized and unhinged your wrap gets.
                    </p>
                  </div>

                  <div className="rounded-xl border-2 border-foreground/10 bg-foreground/5 p-4">
                    <span className="mb-3 flex items-center gap-2 font-display text-[10px] font-black uppercase tracking-widest" style={{ color: meta.color }}>
                      <Sparkles className="size-3" /> Things you could mention:
                    </span>
                    <ul className="grid max-h-[160px] grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-foreground/20">
                      {(STORY_SUGGESTIONS[purpose] || STORY_SUGGESTIONS.life).map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[11px] font-medium text-foreground/60">
                          <span className="mt-0.5 block size-1.5 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
                          <span className="leading-tight">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-2">
                    <textarea
                      value={data.storyParagraph}
                      onChange={(e) => update({ storyParagraph: e.target.value })}
                      placeholder="Start typing your story here..."
                      rows={6}
                      className="w-full resize-none rounded-lg border-2 border-foreground/20 bg-ink/50 px-4 py-3 font-sans text-sm font-medium text-foreground placeholder:text-foreground/30 transition-all focus:border-cream focus:outline-none focus:ring-2 focus:ring-cream/20"
                      style={{
                        boxShadow: data.storyParagraph ? `0 0 0 1px ${meta.color}44, 0 4px 20px ${meta.color}11` : undefined,
                        borderColor: data.storyParagraph ? meta.color : undefined,
                      }}
                      maxLength={1500}
                    />
                    <div className="flex items-center justify-between">
                      <p className="font-sans text-[10px] font-medium text-foreground/30">
                        {data.storyParagraph.length} / 1,500 characters
                      </p>
                      {data.storyParagraph.length > 50 && (
                        <span className="flex items-center gap-1 rounded-full px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>
                          AI ready
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="rounded-md border-2 border-orange bg-orange/10 px-3 py-2 font-display text-xs font-bold uppercase text-orange">
                    {error}
                  </p>
                )}

                <div className="mt-4 flex flex-col sm:flex-row justify-between gap-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center justify-center gap-2 rounded-full border-2 border-foreground/20 px-6 py-4 sm:py-3 font-display text-sm font-black uppercase tracking-widest text-foreground transition-all hover:border-cream"
                  >
                    <ArrowLeft className="size-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => submitStage2()}
                    disabled={loading}
                    className="group flex items-center justify-center gap-2 rounded-full bg-green px-7 py-4 sm:py-3 font-display text-sm font-black uppercase tracking-wide text-ink transition-transform hover:-rotate-1 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Generating Wrap..." : (
                      <>
                        Generate Wrap
                      </>
                    )}
                    <ArrowUpRight className="size-5 transition-transform group-hover:rotate-45" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
