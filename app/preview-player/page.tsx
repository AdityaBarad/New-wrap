"use client"

import dynamic from "next/dynamic"

const PreviewPlayerClient = dynamic(() => import("./preview-player-client"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0b0b0b] text-white">
      <p className="font-display text-lg">Loading preview...</p>
    </div>
  ),
})

export default function PreviewPlayer() {
  return <PreviewPlayerClient />
}
