"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Music, X, Loader2, Play, Pause } from "lucide-react"
import { useWrap, type SongData } from "@/context/wrap-context"
import YouTube from "react-youtube"

export function SongSelector({ accentColor = "var(--wr-purple)" }: { accentColor?: string }) {
  const { data, update } = useWrap()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SongData[]>([])
  const [loading, setLoading] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)

  // Debounce search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search-song?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const json = await res.json()
          setResults(json.results || [])
        }
      } catch (err) {
        console.error("Search failed", err)
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (song: SongData) => {
    update({ song })
    setQuery("")
    setPlayingId(null) // Stop preview when selected
  }

  return (
    <div className="relative w-full">
      {playingId && (
        <div className="hidden">
          <YouTube
            videoId={playingId}
            opts={{ height: "0", width: "0", playerVars: { autoplay: 1 } }}
            onEnd={() => setPlayingId(null)}
          />
        </div>
      )}

      {data.song ? (
        <div className="mx-auto w-full max-w-sm">
          <div
            className="group relative aspect-video w-full overflow-hidden rounded-2xl border-4 bg-ink shadow-lg transition-transform hover:-translate-y-1"
            style={{ borderColor: accentColor }}
          >
            {/* Background image */}
            <img
              src={data.song.thumbnail}
              alt="Thumbnail"
              className="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-40"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setPlayingId(playingId === data.song!.videoId ? null : data.song!.videoId)
                }}
                className="flex size-14 items-center justify-center rounded-full bg-cream text-ink shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform hover:scale-110 active:scale-95"
              >
                {playingId === data.song.videoId ? (
                  <Pause className="size-6" />
                ) : (
                  <Play className="ml-1 size-6" />
                )}
              </button>

              <div className="mt-4 w-full px-4">
                <p className="truncate font-display text-xl font-black uppercase text-cream drop-shadow-md">
                  {data.song.title}
                </p>
                <p className="truncate font-sans text-sm font-medium text-cream/70 drop-shadow-md">
                  {data.song.artist}
                </p>
              </div>
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => {
                update({ song: null })
                if (playingId === data.song?.videoId) setPlayingId(null)
              }}
              className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-ink/80 text-cream backdrop-blur-sm transition-colors hover:bg-red-500"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-display text-xs font-black uppercase tracking-widest text-foreground/70">
              Search for a track
            </label>
            <p className="mt-1 font-sans text-[11px] font-medium leading-tight text-foreground/50">
              <span className="font-bold text-cream">Tip:</span> Listen to the song first to make sure it's perfect. Avoid music videos with long intro dialogues or sound effects — stick to "Lyrical" videos for the best experience!
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Song title or artist..."
              className="w-full rounded-xl border-2 border-foreground/20 bg-ink/50 py-4 pl-11 pr-11 font-sans text-base font-medium text-foreground placeholder:text-foreground/30 transition-all focus:border-cream focus:outline-none focus:ring-2 focus:ring-cream/20"
            />
            {loading && (
              <Loader2 className="absolute right-4 top-1/2 size-5 -translate-y-1/2 animate-spin text-foreground/40" />
            )}
          </div>

          {/* Inline Results List */}
          {results.length > 0 && (
            <div className="mt-2 flex flex-col gap-2 rounded-xl border-2 border-foreground/10 bg-ink/40 p-2">
              {results.map((song) => (
                <div
                  key={song.videoId}
                  onClick={() => handleSelect(song)}
                  className="group flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 transition-colors hover:bg-foreground/10"
                >
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md shadow-sm">
                    <img src={song.thumbnail} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Music className="size-5 text-cream" />
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <p className="truncate font-sans text-base font-bold text-foreground">{song.title}</p>
                    <p className="truncate font-sans text-xs font-medium text-foreground/60">{song.artist}</p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPlayingId(playingId === song.videoId ? null : song.videoId)
                    }}
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cream text-ink shadow-sm transition-transform hover:scale-110 active:scale-95"
                  >
                    {playingId === song.videoId ? (
                      <Pause className="size-5" />
                    ) : (
                      <Play className="ml-1 size-5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
