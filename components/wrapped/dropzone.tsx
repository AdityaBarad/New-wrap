"use client"

import { useRef, useState } from "react"
import { Upload, X, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LocalPhoto } from "@/context/wrap-context"

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
      next.push({ name: f.name, url: URL.createObjectURL(f) })
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

export function TxtDropzone({
  fileName,
  onChange,
}: {
  fileName: string
  onChange: (name: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)

  function handle(files: FileList | null) {
    const f = files?.[0]
    if (f) onChange(f.name)
  }

  return (
    <div>
      <span className="mb-1.5 flex items-baseline justify-between font-display text-xs font-black uppercase tracking-widest text-foreground/70">
        WhatsApp Chat Export
        <span className="text-[10px] text-foreground/40">.txt</span>
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
          handle(e.dataTransfer.files)
        }}
        className={cn(
          "flex w-full items-center gap-3 rounded-md border-2 border-dashed px-4 py-4 text-left transition-colors",
          drag ? "border-pink bg-pink/10" : fileName ? "border-green" : "border-foreground/25 hover:border-cream",
        )}
      >
        <FileText className={cn("size-6", fileName ? "text-green" : "text-pink")} />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-sm font-black uppercase text-foreground">
            {fileName || "Drop your chat .txt"}
          </span>
          <span className="block font-sans text-xs text-foreground/40">
            {fileName ? "Locked and loaded" : "Export from WhatsApp → attach here"}
          </span>
        </span>
      </button>
      <input ref={inputRef} type="file" accept=".txt,text/plain" hidden onChange={(e) => handle(e.target.files)} />
    </div>
  )
}
