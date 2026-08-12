"use client"

import { useRef, useState } from "react"
import { Loader2, Upload, X } from "lucide-react"
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
}: {
  photo: LocalPhoto | undefined
  onChange: (photo: LocalPhoto) => void
  onRemove: () => void
  label: string
  accentColor?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
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
      <span className="mb-1.5 flex items-baseline justify-between font-display text-[11px] font-black uppercase tracking-wider text-foreground/70">
        {label}
      </span>
      
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
            "flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed px-2 py-4 transition-colors",
            drag ? "border-green bg-green/10" : "border-foreground/25 hover:border-cream",
          )}
          style={{ borderColor: drag ? accentColor : undefined }}
        >
          <Upload className="size-5 text-foreground/40" style={{ color: accentColor }} />
          <span className="font-display text-[10px] font-black uppercase text-foreground/60">Click / Drop</span>
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
