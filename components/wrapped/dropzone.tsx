"use client"

import { useRef, useState } from "react"
import { Loader2, Upload, X, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { type LocalPhoto, useWrap, uploadBlobToSupabase } from "@/context/wrap-context"

export function PhotoDropzone({
  max,
  photos,
  onChange,
  label,
}: {
  max: number
  photos: LocalPhoto[]
  onChange: (photos: LocalPhoto[]) => void
  label: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)

  function addFiles(files: FileList | null) {
    if (!files) return
    const next: LocalPhoto[] = []
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) continue
      next.push({ name: f.name, url: URL.createObjectURL(f), file: f })
    }
    onChange([...photos, ...next].slice(0, max))
  }

  function remove(idx: number) {
    onChange(photos.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <span className="mb-1.5 flex items-baseline justify-between font-display text-xs font-black uppercase tracking-widest text-foreground/70">
        {label}
        <span className="text-[10px] text-foreground/40">
          {photos.length}/{max}
        </span>
      </span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          addFiles(e.dataTransfer.files)
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-6 transition-colors",
          drag ? "border-green bg-green/10" : "border-foreground/25 hover:border-cream",
        )}
      >
        <Upload className="size-6 text-green" />
        <span className="font-display text-sm font-black uppercase text-foreground">Drop photos here</span>
        <span className="font-sans text-xs text-foreground/40">or click to browse · up to {max}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => addFiles(e.target.files)}
      />

      {photos.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {photos.map((p, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-md border-2 border-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url || "/placeholder.svg"} alt={p.name} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute right-1 top-1 rounded-full bg-ink/80 p-0.5 text-cream opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Remove ${p.name}`}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function SinglePhotoDropzone({
  photo,
  onChange,
  onRemove,
  label,
  accentColor,
  slideLayout,
  size,
}: {
  photo: LocalPhoto | undefined
  onChange: (photo: LocalPhoto) => void
  onRemove: () => void
  label?: string
  accentColor?: string
  slideLayout?: "intro" | "song" | "stats" | "dashboard" | "quirks" | "toplist" | "globe"
  size?: "normal" | "small"
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const { draftSessionId } = useWrap()

  async function addFiles(files: FileList | null) {
    const f = files?.[0]
    if (f && f.type.startsWith("image/")) {
      setIsUploading(true)
      const previewUrl = URL.createObjectURL(f)
      
      // Upload directly to draft folder
      const path = `drafts/${draftSessionId}/photo-${Date.now()}`
      const url = await uploadBlobToSupabase(previewUrl, "wrap-assets", path, f)
      
      if (url) {
        onChange({ name: f.name, url, file: f })
      } else {
        alert("Failed to upload image. Please try again.")
      }
      setIsUploading(false)
    }
  }

  return (
    <div>
      {(label || slideLayout) && (
        <span className={cn("mb-1.5 flex items-baseline font-display text-[11px] font-black uppercase tracking-wider text-foreground/70 relative group", label ? "justify-between" : "justify-end")}>
          {label && <span>{label}</span>}
          {slideLayout && (
            <button
              type="button"
              className="cursor-help text-foreground/40 hover:text-foreground relative"
              onMouseEnter={() => setShowPreview(true)}
              onMouseLeave={() => setShowPreview(false)}
              onClick={() => setShowPreview(!showPreview)}
            >
              <Info className="size-3.5" />
              <div 
                className={cn(
                  "pointer-events-none absolute bottom-full z-50 mb-2 transition-opacity",
                  label ? "left-1/2 -translate-x-1/2" : "right-0 translate-x-1/4",
                  showPreview ? "opacity-100" : "opacity-0"
                )}
              >
                <SlideWireframe type={slideLayout} color={accentColor} />
              </div>
            </button>
          )}
        </span>
      )}
      
      {photo || isUploading ? (
        <div className="relative aspect-square w-full overflow-hidden rounded-md border-2 border-ink group bg-ink/10">
          {isUploading ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink">
              <Loader2 className="size-6 animate-spin opacity-50" />
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Uploading</span>
            </div>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo!.url} alt={photo!.name} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={onRemove}
                className="absolute right-1 top-1 rounded-full bg-ink/80 p-1 text-cream hover:bg-ink transition-colors"
                aria-label="Remove image"
              >
                <X className="size-3.5" />
              </button>
            </>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDrag(false)
            addFiles(e.dataTransfer.files)
          }}
          className={cn(
            "flex aspect-square w-full flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors",
            size === "small" ? "p-1 gap-0.5" : "px-2 py-4 gap-1.5",
            drag ? "border-green bg-green/10" : "border-foreground/25 hover:border-cream",
          )}
          style={{ borderColor: drag ? accentColor : undefined }}
        >
          <Upload className={cn("text-foreground/40", size === "small" ? "size-3 sm:size-4" : "size-5")} style={{ color: accentColor }} />
          {size !== "small" && (
            <span className="font-display text-[10px] font-black uppercase text-foreground/60">Click / Drop</span>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => addFiles(e.target.files)}
      />
    </div>
  )
}

function SlideWireframe({ type, color }: { type: string; color?: string }) {
  const highlight = color || "#18ddec"
  
  if (type === "intro") {
    return (
      <div className="flex aspect-[9/16] w-24 flex-col bg-white border-2 border-ink rounded-md overflow-hidden shadow-xl">
        <div className="h-[65%] w-full" style={{ backgroundColor: highlight }} />
        <div className="flex-1 bg-[var(--wr-ink,#050505)] p-2 flex flex-col gap-1.5 justify-center">
          <div className="h-1.5 w-3/4 rounded-full bg-white/20" />
          <div className="h-1.5 w-1/2 rounded-full bg-white/20" />
        </div>
      </div>
    )
  }
  if (type === "song") {
    return (
      <div className="flex aspect-[9/16] w-24 flex-col items-center justify-center border-2 border-ink rounded-md overflow-hidden shadow-xl" style={{ backgroundColor: highlight }}>
        <div className="size-10 rounded-full border-2 border-white/30 bg-[var(--wr-ink,#050505)]/50 flex items-center justify-center">
          <div className="size-2 rounded-full bg-white/80" />
        </div>
        <div className="mt-4 flex flex-col items-center gap-1.5 w-full px-4">
          <div className="h-2 w-full rounded-full bg-[var(--wr-ink,#050505)]/30" />
          <div className="h-1.5 w-1/2 rounded-full bg-[var(--wr-ink,#050505)]/30" />
        </div>
      </div>
    )
  }
  if (type === "stats") {
    return (
      <div className="flex aspect-[9/16] w-24 flex-col bg-[var(--wr-ink,#050505)] border-2 border-ink rounded-md overflow-hidden shadow-xl">
        <div className="h-[45%] w-full" style={{ backgroundColor: highlight }} />
        <div className="flex-1 p-2 grid grid-cols-2 grid-rows-2 gap-1.5">
          <div className="rounded-sm bg-white/10" />
          <div className="rounded-sm bg-white/10" />
          <div className="rounded-sm bg-white/10" />
          <div className="rounded-sm bg-white/10" />
        </div>
      </div>
    )
  }
  if (type === "dashboard") {
    return (
      <div className="flex aspect-[9/16] w-24 flex-col bg-[var(--wr-ink,#050505)] border-2 border-ink rounded-md overflow-hidden shadow-xl p-2 justify-between">
        <div className="flex justify-between items-start">
          <div className="h-3 w-8 rounded-full bg-white/20" />
          <div className="size-8 rounded-md" style={{ backgroundColor: highlight }} />
        </div>
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="h-1.5 w-full bg-white/10 rounded-full" />
          <div className="h-1.5 w-4/5 bg-white/10 rounded-full" />
          <div className="h-1.5 w-3/4 bg-white/10 rounded-full" />
          <div className="h-1.5 w-full bg-white/10 rounded-full" />
        </div>
        <div className="h-4 w-full bg-white/20 rounded-sm mt-auto" />
      </div>
    )
  }
  if (type === "quirks") {
    return (
      <div className="flex aspect-[9/16] w-24 flex-col items-center justify-center bg-white border-2 border-ink rounded-md overflow-hidden shadow-xl p-2">
        <div className="h-2 w-3/4 rounded-full bg-[var(--wr-ink,#050505)]/20 mb-3" />
        <div className="size-12 rounded-full" style={{ backgroundColor: highlight }} />
        <div className="h-2 w-1/2 rounded-full bg-[var(--wr-ink,#050505)]/20 mt-3" />
      </div>
    )
  }
  if (type === "toplist") {
    return (
      <div className="flex aspect-[9/16] w-24 flex-col bg-[#95eab1] border-2 border-ink rounded-md overflow-hidden shadow-xl p-2 gap-1.5 justify-center">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[var(--wr-ink,#050505)]/20" />
            <div className="size-4 rounded-sm" style={{ backgroundColor: highlight }} />
            <div className="h-1 flex-1 bg-[var(--wr-ink,#050505)]/20 rounded-full" />
          </div>
        ))}
      </div>
    )
  }
  if (type === "globe") {
    return (
      <div className="flex aspect-[9/16] w-24 flex-col items-center justify-center bg-[#2D8C7E] border-2 border-ink rounded-md overflow-hidden shadow-xl relative">
        <div className="size-10 rounded-full border-2 border-white/20 bg-[var(--wr-ink,#050505)]/20" />
        <div className="absolute top-4 left-2 size-4 rotate-12 border-2 border-white/20 shadow-sm rounded-sm" style={{ backgroundColor: highlight }} />
        <div className="absolute bottom-6 right-2 size-5 -rotate-6 border-2 border-white/20 shadow-sm rounded-sm" style={{ backgroundColor: highlight }} />
        <div className="absolute top-8 right-1 size-3 rotate-45 border-2 border-white/20 shadow-sm rounded-sm" style={{ backgroundColor: highlight }} />
      </div>
    )
  }
  return null
}
