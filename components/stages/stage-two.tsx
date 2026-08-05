"use client"

import { ArrowUpRight, Sparkles } from "lucide-react"
import { motion } from "@/components/wrapped/motion"
import { cn } from "@/lib/utils"
import { Starburst } from "@/components/wrapped/shapes"
import { Field } from "@/components/wrapped/field"
import { SinglePhotoDropzone } from "@/components/wrapped/dropzone"
import { SongSelector } from "@/components/wrapped/song-selector"
import { PURPOSES, useWrap } from "@/context/wrap-context"
import { AiLoading } from "@/components/stages/ai-loading"

export function StageTwo() {
  const { data, update, submitStage2, loading, aiLoading, error } = useWrap()
  const purpose = data.purpose ?? "life"
  const meta = PURPOSES.find((p) => p.id === purpose)!

  // Show the cinematic loading screen while AI is generating
  if (aiLoading) {
    return <AiLoading accentColor={meta.color} />
  }

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
            Step 02 / Memory Deposit
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
          {/* wrap config */}
          <div className="flex flex-col gap-4 mb-8">
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
          </div>

          <div className="mb-6 flex items-center gap-3">
            <div className="h-1 flex-1 bg-foreground/10" />
            <span className="font-display text-xs font-black uppercase tracking-widest" style={{ color: meta.color }}>
              Details
            </span>
            <div className="h-1 flex-1 bg-foreground/10" />
          </div>

          {/* universal */}
          <div className="flex flex-col gap-4">
            <Field
              label="User Names"
              placeholder={purpose === "couple" ? "e.g. Sam & Riley" : "who's starring in this?"}
              value={data.userNames}
              onChange={(e) => update({ userNames: e.target.value })}
            />
          </div>

          {/* conditional divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-1 flex-1 bg-foreground/10" />
            <span className="font-display text-xs font-black uppercase tracking-widest" style={{ color: meta.color }}>
              {meta.label}
            </span>
            <div className="h-1 flex-1 bg-foreground/10" />
          </div>

          {/* conditional fields */}
          <div className="flex flex-col gap-4">
            {purpose === "couple" && (
              <div className="grid grid-cols-1 gap-4">
                <Field
                  label="Anniversary / First Date"
                  type="date"
                  value={data.anniversaryDate}
                  onChange={(e) => update({ anniversaryDate: e.target.value })}
                />
              </div>
            )}

            {purpose === "travel" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Ultimate Destination City"
                  placeholder="e.g. Tokyo"
                  value={data.destinationCity}
                  onChange={(e) => update({ destinationCity: e.target.value })}
                />
                <Field
                  label="Total Flight / Roadtrip Hours"
                  type="number"
                  placeholder="e.g. 142"
                  value={data.travelHours}
                  onChange={(e) => update({ travelHours: e.target.value })}
                />
              </div>
            )}

            {(purpose === "birthday" || purpose === "life" || purpose === "group") && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label={purpose === "group" ? "Group Inside Joke Word" : "Ultimate Delusional Habit / Inside Joke"}
                  placeholder="the word only YOU get"
                  value={data.delusionalHabit}
                  onChange={(e) => update({ delusionalHabit: e.target.value })}
                />
                <Field
                  label="Year of Birth"
                  type="number"
                  placeholder="e.g. 1999"
                  value={data.birthYear}
                  onChange={(e) => update({ birthYear: e.target.value })}
                />
              </div>
            )}

            <div>
              <span className="mb-2 block font-display text-[11px] font-black uppercase tracking-widest text-foreground/75">
                5 slides images (Upload a unique photo for each slide)
              </span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <SinglePhotoDropzone
                  label="1. Intro Slide"
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
                  label="2. Song Reveal"
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
                  label="3. Artist Stats"
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
                  label="4. Top Track"
                  photo={data.photos?.[3]}
                  accentColor={meta.color}
                  onChange={(photo) => {
                    const copy = [...(data.photos || [])]
                    copy[3] = photo
                    update({ photos: copy })
                  }}
                  onRemove={() => {
                    const copy = [...(data.photos || [])]
                    delete copy[3]
                    update({ photos: copy })
                  }}
                />
                <SinglePhotoDropzone
                  label="5. Dashboard"
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
              </div>
            </div>
          </div>

          {/* ────── YOUR STORY paragraph ────── */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-1 flex-1 bg-foreground/10" />
            <span className="flex items-center gap-1.5 font-display text-xs font-black uppercase tracking-widest" style={{ color: meta.color }}>
              <Sparkles className="size-3.5" />
              AI Personalization
            </span>
            <div className="h-1 flex-1 bg-foreground/10" />
          </div>

          <div className="mb-6">
            <SongSelector accentColor={meta.color} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-display text-xs font-black uppercase tracking-widest text-foreground/70">
              Tell us your story
              <span className="ml-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal" style={{ backgroundColor: meta.color, color: "var(--wr-ink)" }}>
                powers AI ✨
              </span>
            </label>
            <p className="font-sans text-[11px] font-medium text-foreground/40 leading-relaxed">
              Write a paragraph about your story — the chaos, the wins, the late nights, the inside jokes. The more detail you share, the more personalized and unhinged your wrap gets.
            </p>
            <textarea
              value={data.storyParagraph}
              onChange={(e) => update({ storyParagraph: e.target.value })}
              placeholder={
                purpose === "couple"
                  ? "Tell us about your relationship — how you met, your funniest moments, that one argument about where to eat, the trip that almost broke you, the song you can't stop playing together..."
                  : purpose === "travel"
                    ? "Tell us about your travels — the best sunset, the worst airport, the food that changed your life, the hostel story you keep retelling, the city that stole your heart..."
                    : purpose === "birthday"
                      ? "Tell us about your story — the glow up, the chaos, the friendships that hit different, the moment you peaked, the late night that became legendary..."
                      : purpose === "group"
                        ? "Tell us about your squad — the inside jokes, the group chat drama, the trip that almost ended friendships, the person who always shows up late..."
                        : "Tell us about your story — the highs, the lows, the unhinged moments, the growth, the people who made it worth it, the main character moments..."
              }
              rows={5}
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
                  <Sparkles className="size-2.5" />
                  AI ready
                </span>
              )}
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-md border-2 border-orange bg-orange/10 px-3 py-2 font-display text-xs font-bold uppercase text-orange">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              submitStage2()
            }}
            disabled={loading}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-green px-7 py-4 font-display text-base font-black uppercase tracking-wide text-ink transition-transform hover:-rotate-1 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving Details..." : (
              <>
                <Sparkles className="size-4" />
                Proceed to Payment
              </>
            )}
            <ArrowUpRight className="size-5 transition-transform group-hover:rotate-45" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
