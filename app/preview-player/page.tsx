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
  intro: { 
    kicker: "Now streaming", 
    lines: ["The", "main character", "universe"], 
    sub: "Your year had range. Villain arc, glow up, redemption. All of it. Wrapped." 
  },
  share: {
    title: "Share your unhinged era",
    hashtag: "#YourLifeWrapped"
  },
  dataHighlight: { 
    kicker: "Time on the clock", 
    label: "Day streak", 
    note: "And a documented top 3% level of chaos this year alone." 
  },
  topTrack: { 
    kicker: "Your top track", 
    title: "Anti-Hero", 
    artistLine: "the soundtrack of your villain arc" 
  },
  globalArtistsTitle: "Your Main Character Influences",
  globalArtists: ["You", "Your best friend", "Your therapist", "Your bed", "Your morning coffee"],
  artistStats: {
    name: "You",
    streams: "420.6",
    hours: "69.4",
    listeners: "100",
    countries: "42"
  },
  worldCitizen: {
    title: "Mr. Worldwide",
    description1: "When it comes to your chaos, borders disappear.",
    description2: "Your delusions have traveled to {count} countries.",
    countriesCount: 42,
    artists: [
      { name: "Artist 1", country: "USA" },
      { name: "Artist 2", country: "Japan" },
      { name: "Artist 3", country: "Germany" },
      { name: "Artist 4", country: "UK" },
      { name: "Artist 5", country: "South Korea" },
      { name: "Artist 6", country: "France" }
    ]
  },
  dashboard: { 
    topArtistsTitle: "Your Holy Trinity (Plus Two)",
    topArtists: ["You", "Your best friend", "Your therapist", "Your bed", "Your morning coffee"], 
    topSongs: ["That one song", "The other one", "The deep cut", "The happy song", "The sad song"], 
    topGenresTitle: "Your Chaotic Vibes",
    topGenres: ["Chaotic Soft Pop", "Bed Rotting Lofi", "Panic Pop", "Manifestation Core", "Coffee Shop Jazz"],
    minutesListened: "69,420"
  },
  finale: { 
    title: "Your 2025 Era",
    tagline: "Your year is officially wrapped. Your year. Unhinged.",
    minutesLived: "525,600",
    minutesLabel: "min lived",
    topPercent: "1",
    topPercentLabel: "main character"
  },
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
