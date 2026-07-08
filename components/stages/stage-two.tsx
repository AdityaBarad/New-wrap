"use client"

import { ArrowUpRight } from "lucide-react"
import { motion } from "@/components/wrapped/motion"
import { Starburst } from "@/components/wrapped/shapes"
import { Field } from "@/components/wrapped/field"
import { PhotoDropzone, TxtDropzone } from "@/components/wrapped/dropzone"
import { PURPOSES, VIBES, useWrap } from "@/context/wrap-context"
import { cn } from "@/lib/utils"

export function StageTwo() {
  const { data, update, submitStage2, loading, error } = useWrap()
  const purpose = data.purpose ?? "life"
  const meta = PURPOSES.find((p) => p.id === purpose)!

  const photoMax = purpose === "travel" ? 8 : 5

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
          {/* universal */}
          <div className="flex flex-col gap-4">
            <Field
              label="User Names"
              placeholder={purpose === "couple" ? "e.g. Sam & Riley" : "who's starring in this?"}
              value={data.userNames}
              onChange={(e) => update({ userNames: e.target.value })}
            />
            <TxtDropzone fileName={data.chatExportName} onChange={(name) => update({ chatExportName: name })} />

            {/* vibe cards */}
            <div>
              <span className="mb-2 block font-display text-xs font-black uppercase tracking-widest text-foreground/70">
                Sonic Vibe
              </span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {VIBES.map((v) => {
                  const active = data.vibe === v.id
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => update({ vibe: v.id })}
                      className={cn(
                        "rounded-md border-2 px-3 py-3 text-left font-display text-xs font-black uppercase leading-tight transition-all",
                        active ? "-rotate-1 scale-[1.03] border-ink text-ink" : "border-foreground/20 text-foreground hover:border-cream",
                      )}
                      style={active ? { backgroundColor: v.color } : undefined}
                    >
                      {v.label}
                    </button>
                  )
                })}
              </div>
            </div>
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Our Anthem Song Title"
                  placeholder="the song that's YOURS"
                  value={data.anthemTitle}
                  onChange={(e) => update({ anthemTitle: e.target.value })}
                />
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

            <PhotoDropzone
              max={photoMax}
              photos={data.photos}
              onChange={(photos) => update({ photos })}
              label={
                purpose === "couple"
                  ? "5 Shared Couple Pictures"
                  : purpose === "travel"
                    ? "8 Travel Landscape Pictures"
                    : "5 Candid Portrait Pictures"
              }
            />
          </div>

          {error && (
            <p className="mt-4 rounded-md border-2 border-orange bg-orange/10 px-3 py-2 font-display text-xs font-bold uppercase text-orange">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={submitStage2}
            disabled={loading}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-green px-7 py-4 font-display text-base font-black uppercase tracking-wide text-ink transition-transform hover:-rotate-1 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Building..." : "Generate Full Experience"}
            <ArrowUpRight className="size-5 transition-transform group-hover:rotate-45" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
