"use client"

import { useState } from "react"
import { buildPages } from "@/components/player/pages"
import { WrapProvider, type WrapData } from "@/context/wrap-context"

const sample: WrapData = {
  name: "Zeynep",
  phone: "000",
  whatsThisFor: "",
  promoCode: "",
  purpose: "life",
  userNames: "Zeynep",
  chatExportName: "",
  vibe: "hyperpop",
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
  const pages = buildPages(sample)
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
