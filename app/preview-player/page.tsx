"use client"

import { useEffect } from "react"
import { WrapProvider, useWrap, type WrapData } from "@/context/wrap-context"
import { StageThree } from "@/components/stages/stage-three"

/**
 * Preview page that renders the full spatial slide engine
 * with sample data for development & design QA.
 *
 * Uses the same StageThree player component (with spatial
 * transitions, shared elements, parallax layers) so the
 * preview is identical to what users see in production.
 */

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
  storyParagraph: "",
}

/**
 * Inner component that auto-advances the context to stage 3
 * so the WrapProvider renders the player immediately.
 */
function PreviewInner() {
  const { setStage, update } = useWrap()

  useEffect(() => {
    update(sample)
    setStage(3)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <StageThree />
}

export default function PreviewPlayer() {
  return (
    <WrapProvider>
      <PreviewInner />
    </WrapProvider>
  )
}
