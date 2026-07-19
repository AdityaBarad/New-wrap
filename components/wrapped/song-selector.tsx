"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Music, X, Loader2 } from "lucide-react"
import { useWrap, type SongData } from "@/context/wrap-context"

export function SongSelector({ accentColor = "var(--wr-purple)" }: { accentColor?: string }) {
  const { data, update } = useWrap()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SongData[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounce search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search-song?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const json = await res.json()
          setResults(json.results || [])
          setOpen(true)
        }
      } catch (err) {
        console.error("Search failed", err)
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (song: SongData) => {
    update({ song })
    setQuery("")
    setOpen(false)
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="mb-2 block font-display text-xs font-black uppercase tracking-widest text-foreground/70">
        Theme Song
      </label>
      
      {data.song ? (
        <div 
          className="flex items-center gap-4 rounded-xl border-2 p-3 transition-all"
          style={{ borderColor: accentColor, backgroundColor: `${accentColor}11` }}
        >
          <img src={data.song.thumbnail} alt="Thumbnail" className="h-12 w-16 rounded object-cover shadow-sm" />
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-sans text-sm font-bold text-foreground">{data.song.title}</p>
            <p className="truncate font-sans text-xs font-medium text-foreground/60">{data.song.artist}</p>
          </div>
          <button 
            type="button" 
            onClick={() => update({ song: null })}
            className="rounded-full p-2 hover:bg-foreground/10 transition-colors"
          >
            <X className="size-4 text-foreground/60" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if (!open && e.target.value.trim()) setOpen(true)
            }}
            onFocus={() => {
              if (results.length > 0) setOpen(true)
            }}
            placeholder="Search for a song..."
            className="w-full rounded-lg border-2 border-foreground/20 bg-ink/50 py-3 pl-10 pr-10 font-sans text-sm font-medium text-foreground placeholder:text-foreground/30 transition-all focus:border-cream focus:outline-none focus:ring-2 focus:ring-cream/20"
          />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 size-4 animate-spin text-foreground/40" />
          )}
        </div>
      )}

      {/* Dropdown */}
      {open && results.length > 0 && !data.song && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border-2 border-foreground/10 bg-ink shadow-xl">
          {results.map((song) => (
            <button
              key={song.videoId}
              type="button"
              onClick={() => handleSelect(song)}
              className="flex w-full items-center gap-3 border-b border-foreground/5 p-3 text-left transition-colors hover:bg-foreground/5 last:border-b-0"
            >
              <img src={song.thumbnail} alt="" className="h-10 w-14 rounded object-cover" />
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-sans text-sm font-bold text-foreground">{song.title}</p>
                <p className="truncate font-sans text-xs text-foreground/60">{song.artist}</p>
              </div>
              <Music className="size-4 text-foreground/20" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
