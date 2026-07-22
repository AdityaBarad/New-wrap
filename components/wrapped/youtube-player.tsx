"use client"

import { useEffect, useRef, useState } from "react"
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube"

export function YoutubePlayer({ videoId, isPaused = false }: { videoId: string; isPaused?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const playerRef = useRef<any>(null)

  const onReady: YouTubeProps["onReady"] = (event: YouTubeEvent) => {
    playerRef.current = event.target
    // Try to play immediately when ready unless paused
    if (!isPaused) {
      event.target.playVideo()
    }
  }

  const onStateChange: YouTubeProps["onStateChange"] = (event: YouTubeEvent) => {
    // 0 = ended, 1 = playing, 2 = paused, 3 = buffering, 5 = video cued
    if (event.data === 0) {
      // Loop video
      if (!isPaused) {
        event.target.playVideo()
      }
    } else if (event.data === 1) {
      setIsPlaying(true)
    } else if (event.data === 2) {
      setIsPlaying(false)
    }
  }

  // Effect to handle play/pause if needed
  useEffect(() => {
    if (playerRef.current) {
      if (isPaused) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    }
  }, [videoId, isPaused])

  const opts: YouTubeProps["opts"] = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      playsinline: 1, // Crucial for mobile background playback
      rel: 0,
    },
  }

  return (
    <div className="pointer-events-none absolute left-0 top-0 h-0 w-0 opacity-0 overflow-hidden">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
      />
    </div>
  )
}
