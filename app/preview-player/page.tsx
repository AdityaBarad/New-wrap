"use client"

import { useState } from "react"
import { buildPages } from "@/components/player/pages"
import { WrapProvider, type WrapData } from "@/context/wrap-context"
import type { AiWrapContent } from "@/lib/ai-types"

const sample: WrapData = {
  name: "Zeynep",
  phone: "000",
  whatsThisFor: "",
  promoCode: "",
  purpose: "life",
  userNames: "Zeynep",
  chatExportName: "",
  anthemTitle: "Anti-Hero",
  anniversaryDate: "",
  destinationCity: "Tokyo",
  travelHours: "220",
  delusionalHabit: "manifesting",
  birthYear: "1999",
  photos: [
    { name: "1", url: "/wrapped-portrait-1.png" },
    { name: "2", url: "/wrapped-portrait-2.png" },
    { name: "3", url: "/wrapped-portrait-3.png" },
  ],
  storyParagraph: "",
}

const mockAi: AiWrapContent = {
  intro: { kicker: "Now streaming", lines: ["The", "main character", "universe"], sub: "Your year had range. Villain arc, glow up, redemption. All of it. Wrapped." },
  dataHighlight: { kicker: "Time on the clock", label: "Day streak", note: "And a documented top 3% level of chaos this year alone." },
  topTrack: { kicker: "Your top track", artistLine: "the soundtrack of your villain arc" },
  receipts: { title: "Life wrapped", rows: [{ label: "Words yapped", value: "482,109" }, { label: "Texted first", value: "73%" }, { label: "Double texts", value: "847" }, { label: "Night owl", value: "84%" }] },
  versus: { kicker: "Most watched league", left: "Main character", right: "Supporting role", leagueTitle: "The Drama League" },
  versusBoard: { kicker: "The matchups", title: "Top games", games: [{ team1: "Monday mood", team2: "Friday energy", competition: "Weekly showdown" }, { team1: "Brunch plans", team2: "Actual wake-up time", competition: "Weekend battle" }, { team1: "Gym goals", team2: "Couch comfort", competition: "Daily struggle" }, { team1: "Sleep schedule", team2: "Late night doomscroll", competition: "Nightly routine" }] },
  dashboard: { topArtists: ["You", "Your best friend", "Your therapist"], topSongs: ["That one song", "The other one", "The deep cut"], topGenre: "Chaotic Soft Pop" },
  finale: { tagline: "Your year is officially wrapped. Your year. Unhinged." },
}

export default function PreviewPlayer() {
  return (
    <WrapProvider>
      <PreviewInner />
    </WrapProvider>
  )
}

function PreviewInner() {
  const [i, setI] = useState(0)
  const pages = buildPages(sample, mockAi)
  const page = pages[i]
  return (
    <div className="fixed inset-0 bg-ink">
      <div className="absolute inset-0" style={{ backgroundColor: page.bg }}>
        {page.node}
      </div>
      <div className="absolute bottom-2 left-1/2 z-50 flex -translate-x-1/2 gap-1">
        {pages.map((_, n) => (
          <button
            key={n}
            onClick={() => setI(n)}
            className={`size-3 rounded-full border border-white ${n === i ? "bg-white" : "bg-transparent"}`}
          />
        ))}
      </div>
    </div>
  )
}
