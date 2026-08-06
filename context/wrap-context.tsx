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
  // Plan type
  isBasicPlan?: boolean
  // Draft Slug
  slug?: string
  // DB Card Color
  cardColor?: string
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

type Stage = 1 | 2 | 3 | 4

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
  draftSessionId: string
  update: (patch: Partial<WrapData>) => void
  setStage: (s: Stage) => void
  submitStage1: () => Promise<boolean>
  submitStage2: () => Promise<boolean>
  generateWrap: (planName: string) => Promise<boolean>
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
  const [draftSessionId] = useState<string>(() => crypto.randomUUID())

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
    if (!data.name.trim() || !phoneToUse.trim()) {
      setError("Drop your name and number first.")
      return false
    }
    
    setLoading(true)
    try {
      const res = await fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, phone: phoneToUse }),
      })
      if (!res.ok) throw new Error("Failed to save lead")
      
      if (verifiedPhone) {
        update({ phone: verifiedPhone })
      }
      setStage(2)
      setLoading(false)
      return true
    } catch (e) {
      console.error("[save-lead] error:", e)
      setError("Failed to save your details. Please try again.")
      setLoading(false)
      return false
    }
  }, [data, update])

  const submitStage2 = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/save-draft-wrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wrapData: data }),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.details ? JSON.stringify(errData.details) : "Failed to save draft")
      }
      const { slug } = await res.json()
      setWrapSlug(slug)
      update({ slug })
      setStage(3)
      setLoading(false)

      // Track event with new wrap slug
      import("@/lib/mixpanel").then(({ trackEvent }) => {
        trackEvent("Memory Deposit Completed", {
          wrap_slug: slug,
          draft_session_id: draftSessionId,
          purpose: data.purpose,
          promo_code: data.promoCode,
          whats_this_for: data.whatsThisFor,
          story_length: data.storyParagraph?.length || 0,
          photo_count: (data.photos || []).filter(Boolean).length,
          has_custom_song: !!data.songUrl,
          destination: data.destinationCity,
        })
      })

      return true
    } catch (e) {
      console.error("[save-draft] error:", e)
      setError("Failed to save your details. Please try again.")
      setLoading(false)
      return false
    }
  }, [data, update])

  const generateWrap = useCallback(async (planName: string) => {
    setError(null)
    setStage(4) // Move to Stage 4 which will render the loading screen and basic success
    setLoading(true)
    setAiLoading(true)

    try {
      const content = await generateAiContent(data)
      setAiContent(content)

      // Fetch the image while the loading screen is still active
      let personalityBlobUrl: string | null = null
      if ((content as any).personalityCard?.imagePrompt) {
        try {
          const res = await fetch("/api/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: (content as any).personalityCard.imagePrompt }),
          })

          if (res.ok) {
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            setGeneratedImageUrl(url)
            personalityBlobUrl = url
          } else {
            console.error("Failed to generate image in generateWrap")
          }
        } catch (err) {
          console.error("Error generating image in generateWrap", err)
        }
      }

      // Save wrap to Supabase and wait for it
      try {
        let personalityImageBase64: string | null = null
        if (personalityBlobUrl) {
          try {
            personalityImageBase64 = await blobUrlToBase64(personalityBlobUrl)
          } catch (e) {
            console.error("[save-wrap] Failed to convert personality image:", e)
          }
        }

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
            wrapData: data,
            aiContent: content,
            personalityImageBase64,
            photos: photosBase64.filter(Boolean),
          }),
        })

        if (saveRes.ok) {
          const { slug, url } = await saveRes.json()
          console.log("[save-wrap] Wrap updated!", url)
          
          import("@/lib/mixpanel").then(({ trackEvent }) => {
            trackEvent("Wrap Generation Completed", { plan: planName, wrap_slug: slug, draft_session_id: draftSessionId })
          })

          if (planName === "elite") {
            // Short delay to allow Mixpanel to flush before unloading page
            await new Promise((resolve) => setTimeout(resolve, 500))
            window.location.href = `/wrap/${slug}`
            return new Promise(() => {}) // Hang the promise forever while redirecting
          } else {
            // For basic plan, stop loading and show basic success screen (which is Stage 4 without aiLoading)
            setAiLoading(false)
            setLoading(false)
            return true
          }
        } else {
          console.error("[save-wrap] Failed to save wrap:", saveRes.status)
          throw new Error("Failed to save final wrap.")
        }
      } catch (e) {
        console.error("[save-wrap] Error saving wrap:", e)
        throw new Error("Error saving final wrap.")
      }

      setLoading(false)
      setAiLoading(false)
      return true
    } catch (e) {
      console.error("[generateWrap] error:", e)
      setError("AI generation failed. Please try again.")
      setLoading(false)
      setAiLoading(false)
      throw e
    }
  }, [data, generateAiContent])

  const value = useMemo<WrapContextValue>(
    () => ({ stage, data, loading, error, aiContent, generatedImageUrl, aiLoading, wrapSlug, wrapUrl, draftSessionId, update, setStage, submitStage1, submitStage2, generateWrap, reset }),
    [stage, data, loading, error, aiContent, generatedImageUrl, aiLoading, wrapSlug, wrapUrl, draftSessionId, update, submitStage1, submitStage2, generateWrap, reset],
  )

  return <WrapContext.Provider value={value}>{children}</WrapContext.Provider>
}

export function useWrap() {
  const ctx = useContext(WrapContext)
  if (!ctx) throw new Error("useWrap must be used within WrapProvider")
  return ctx
}
