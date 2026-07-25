"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { createClient } from "@/lib/supabase/client"
import type { AiWrapContent } from "@/lib/ai-types"

export type Purpose = "couple" | "travel" | "birthday" | "life" | "group"

export type PurposeMeta = {
  id: Purpose
  label: string
  tag: string
  color: string // css var for accent
}

export const PURPOSES: PurposeMeta[] = [
  { id: "couple", label: "COUPLE / LOVE STORY", tag: "two hearts, one chaos", color: "var(--wr-pink)" },
  { id: "travel", label: "TRAVEL MEMORIES", tag: "passport full of receipts", color: "var(--wr-green)" },
  { id: "birthday", label: "BIRTHDAY SPECIAL", tag: "another lap around the sun", color: "var(--wr-yellow)" },
  { id: "life", label: "PERSONAL LIFE JOURNEY", tag: "the main character era", color: "var(--wr-orange)" },
  { id: "group", label: "GROUP & FAMILY CHAOS", tag: "the group chat unhinged", color: "var(--wr-purple)" },
]

export type LocalPhoto = { name: string; url: string }

export type SongData = { videoId: string; title: string; artist: string; thumbnail: string }

export type WrapData = {
  // Stage 1
  id?: string
  name: string
  phone: string
  whatsThisFor: string
  promoCode: string
  purpose: Purpose | null
  // Stage 2
  userNames: string
  chatExportName: string
  anniversaryDate: string
  destinationCity: string
  travelHours: string
  delusionalHabit: string
  birthYear: string
  photos: LocalPhoto[]
  // AI personalization
  storyParagraph: string
  // Selected song
  song: SongData | null
}

const initialData: WrapData = {
  name: "",
  phone: "",
  whatsThisFor: "",
  promoCode: "",
  purpose: null,
  userNames: "",
  chatExportName: "",
  anniversaryDate: "",
  destinationCity: "",
  travelHours: "",
  delusionalHabit: "",
  birthYear: "",
  photos: [],
  storyParagraph: "",
  song: null,
}

type Stage = 1 | 2 | 3

type WrapContextValue = {
  stage: Stage
  data: WrapData
  loading: boolean
  error: string | null
  aiContent: AiWrapContent | null
  generatedImageUrl: string | null
  aiLoading: boolean
  wrapSlug: string | null
  wrapUrl: string | null
  update: (patch: Partial<WrapData>) => void
  setStage: (s: Stage) => void
  submitStage1: () => Promise<boolean>
  submitStage2: () => Promise<boolean>
  reset: () => void
}

const WrapContext = createContext<WrapContextValue | null>(null)

/** Convert a blob: URL to a base64 data URL string. */
async function blobUrlToBase64(blobUrl: string): Promise<string> {
  const res = await fetch(blobUrl)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export function WrapProvider({
  children,
  initialWrapData,
  initialAiContent,
  initialImageUrl,
  initialWrapSlug,
  initialWrapUrl,
}: {
  children: ReactNode
  initialWrapData?: WrapData
  initialAiContent?: AiWrapContent | null
  initialImageUrl?: string | null
  initialWrapSlug?: string | null
  initialWrapUrl?: string | null
}) {
  const [stage, setStage] = useState<Stage>(initialWrapData && initialAiContent ? 3 : 1)
  const [data, setData] = useState<WrapData>(initialWrapData || initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiContent, setAiContent] = useState<AiWrapContent | null>(initialAiContent || null)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(initialImageUrl || null)
  const [aiLoading, setAiLoading] = useState(false)
  const [wrapSlug, setWrapSlug] = useState<string | null>(initialWrapSlug || null)
  const [wrapUrl, setWrapUrl] = useState<string | null>(initialWrapUrl || null)

  const update = useCallback((patch: Partial<WrapData>) => {
    setData((d) => ({ ...d, ...patch }))
  }, [])

  const reset = useCallback(() => {
    setData(initialData)
    setStage(1)
    setError(null)
    setAiContent(null)
    setGeneratedImageUrl(null)
    setAiLoading(false)
    setWrapSlug(null)
    setWrapUrl(null)
  }, [])

  /** Call the Gemini API route to generate personalized wrap content */
  const generateAiContent = useCallback(async (wrapData: WrapData): Promise<AiWrapContent> => {
    try {
      const res = await fetch("/api/generate-wrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: wrapData.purpose,
          userNames: wrapData.userNames,
          anniversaryDate: wrapData.anniversaryDate,
          destinationCity: wrapData.destinationCity,
          travelHours: wrapData.travelHours,
          delusionalHabit: wrapData.delusionalHabit,
          birthYear: wrapData.birthYear,
          storyParagraph: wrapData.storyParagraph,
          photoCount: wrapData.photos.length,
          song: wrapData.song ? `${wrapData.song.title} by ${wrapData.song.artist}` : null,
        }),
      })

      if (!res.ok) {
        throw new Error(`AI generation failed with status ${res.status}`)
      }

      const json = await res.json()
      return json.content as AiWrapContent
    } catch (err) {
      throw new Error(`AI generation failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }, [])

  const submitStage1 = useCallback(async (verifiedPhone?: string) => {
    setError(null)
    const phoneToUse = verifiedPhone || data.phone
    if (!data.name.trim() || !phoneToUse.trim() || !data.purpose) {
      setError("Drop your name, number, and pick a vibe first.")
      return false
    }
    if (verifiedPhone) {
      update({ phone: verifiedPhone })
    }
    setStage(2)
    return true
  }, [data, update])

  const submitStage2 = useCallback(async () => {
    setError(null)
    setLoading(true)
    setAiLoading(true)

    try {
      const supabase = createClient()
      const payload = {
        user_names: data.userNames || null,
        chat_export_name: data.chatExportName || null,
        anniversary_date: data.anniversaryDate || null,
        destination_city: data.destinationCity || null,
        travel_hours: data.travelHours || null,
        delusional_habit: data.delusionalHabit || null,
        birth_year: data.birthYear || null,
        photos: data.photos.map((p) => p.name),
        stage: 3,
        updated_at: new Date().toISOString(),
      }
      // (Removed legacy leads update)

      const content = await generateAiContent(data)
      setAiContent(content)

      // Fetch the image while the loading screen is still active
      let personalityBlobUrl: string | null = null
      if ((content as any).personalityCard?.imagePrompt) {
        try {
          const res = await fetch("/api/generate-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: (content as any).personalityCard.imagePrompt }),
          })

          if (res.ok) {
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            setGeneratedImageUrl(url)
            personalityBlobUrl = url
          } else {
            console.error("Failed to generate image in submitStage2")
          }
        } catch (err) {
          console.error("Error generating image in submitStage2", err)
        }
      }

      // Save wrap to Supabase and wait for it
      try {
        // Convert personality image blob to base64
        let personalityImageBase64: string | null = null
        if (personalityBlobUrl) {
          try {
            personalityImageBase64 = await blobUrlToBase64(personalityBlobUrl)
          } catch (e) {
            console.error("[save-wrap] Failed to convert personality image:", e)
          }
        }

        // Convert photos to base64
        const photosBase64 = await Promise.all(
          data.photos.map(async (photo) => {
            try {
              const base64 = await blobUrlToBase64(photo.url)
              return { name: photo.name, base64 }
            } catch {
              return null
            }
          })
        )

        const saveRes = await fetch("/api/save-wrap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadId: data.id || null,
            wrapData: data,
            aiContent: content,
            personalityImageBase64,
            photos: photosBase64.filter(Boolean),
          }),
        })

        if (saveRes.ok) {
          const { slug, url } = await saveRes.json()
          console.log("[save-wrap] Wrap saved!", url)
          // Redirect the user immediately to the saved wrap URL
          window.location.href = `/wrap/${slug}`
          // Do NOT clear loading state here so it doesn't flash the create page during redirect
          return new Promise(() => {}) // Hang the promise forever while redirecting
        } else {
          console.error("[save-wrap] Failed to save wrap:", saveRes.status)
          // Fallback to local stage 3 if saving fails
          setStage(3)
        }
      } catch (e) {
        console.error("[save-wrap] Error saving wrap:", e)
        // Fallback to local stage 3 if saving fails
        setStage(3)
      }

      // Only clear loading state if we are falling back to local display
      setLoading(false)
      setAiLoading(false)
      return true
    } catch (e) {
      console.log("[v0] submitStage2 error:", e)
      setError("AI generation failed. Please try again.")
      setLoading(false)
      setAiLoading(false)
      return false
    }
  }, [data, generateAiContent])

  const value = useMemo<WrapContextValue>(
    () => ({ stage, data, loading, error, aiContent, generatedImageUrl, aiLoading, wrapSlug, wrapUrl, update, setStage, submitStage1, submitStage2, reset }),
    [stage, data, loading, error, aiContent, generatedImageUrl, aiLoading, wrapSlug, wrapUrl, update, submitStage1, submitStage2, reset],
  )

  return <WrapContext.Provider value={value}>{children}</WrapContext.Provider>
}

export function useWrap() {
  const ctx = useContext(WrapContext)
  if (!ctx) throw new Error("useWrap must be used within WrapProvider")
  return ctx
}
