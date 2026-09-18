"use client"

import { useEffect, useState, useRef } from "react"

/**
 * Preloads an array of image URLs into the browser cache.
 * Returns { loaded, total, allLoaded } so the UI can optionally
 * gate transitions until images are ready.
 *
 * Uses `new Image()` which downloads each image in the background.
 * Once downloaded, the browser cache will serve them instantly
 * when an <img> tag later references the same URL.
 */
export function useImagePreloader(urls: string[]) {
  const [loaded, setLoaded] = useState(0)
  const [allLoaded, setAllLoaded] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    // Filter out empty strings and duplicates
    const unique = [...new Set(urls.filter(Boolean))]
    const total = unique.length

    if (total === 0) {
      setAllLoaded(true)
      return
    }

    // Avoid re-running if we already started with the same set
    if (startedRef.current) return
    startedRef.current = true

    let count = 0

    const onComplete = () => {
      count++
      setLoaded(count)
      if (count >= total) {
        setAllLoaded(true)
      }
    }

    unique.forEach((url) => {
      const img = new Image()
      // crossOrigin matches what the slide components use
      img.crossOrigin = "anonymous"
      img.onload = onComplete
      img.onerror = onComplete // Count errors as "done" so we don't hang forever
      img.src = url
    })
  }, [urls])

  return {
    loaded,
    total: urls.filter(Boolean).length,
    allLoaded,
  }
}
