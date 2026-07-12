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
  anthemTitle: string
  anniversaryDate: string
  destinationCity: string
  travelHours: string
  delusionalHabit: string
  birthYear: string
  photos: LocalPhoto[]
  // AI personalization
  storyParagraph: string
}

const initialData: WrapData = {
  name: "",
  phone: "",
  whatsThisFor: "",
  promoCode: "",
  purpose: null,
  userNames: "",
  chatExportName: "",
  anthemTitle: "",
  anniversaryDate: "",
  destinationCity: "",
  travelHours: "",
  delusionalHabit: "",
  birthYear: "",
  photos: [],
  storyParagraph: "",
}

type Stage = 1 | 2 | 3

type WrapContextValue = {
  stage: Stage
  data: WrapData
  loading: boolean
  error: string | null
  aiContent: AiWrapContent | null
  aiLoading: boolean
  update: (patch: Partial<WrapData>) => void
  setStage: (s: Stage) => void
  submitStage1: () => Promise<boolean>
  submitStage2: () => Promise<boolean>
  reset: () => void
}

const WrapContext = createContext<WrapContextValue | null>(null)

export function WrapProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>(1)
  const [data, setData] = useState<WrapData>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiContent, setAiContent] = useState<AiWrapContent | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const update = useCallback((patch: Partial<WrapData>) => {
    setData((d) => ({ ...d, ...patch }))
  }, [])

  const reset = useCallback(() => {
    setData(initialData)
    setStage(1)
    setError(null)
    setAiContent(null)
    setAiLoading(false)
  }, [])

  /** Call the Gemini API route to generate personalized wrap content */
  const generateAiContent = useCallback(async (wrapData: WrapData): Promise<AiWrapContent> => {
    setAiLoading(true)
    try {
      const res = await fetch("/api/generate-wrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: wrapData.purpose,
          userNames: wrapData.userNames,
          anthemTitle: wrapData.anthemTitle,
          anniversaryDate: wrapData.anniversaryDate,
          destinationCity: wrapData.destinationCity,
          travelHours: wrapData.travelHours,
          delusionalHabit: wrapData.delusionalHabit,
          birthYear: wrapData.birthYear,
          storyParagraph: wrapData.storyParagraph,
          photoCount: wrapData.photos.length,
        }),
      })

      if (!res.ok) {
        throw new Error(`AI generation failed with status ${res.status}`)
      }

      const json = await res.json()
      return json.content as AiWrapContent
    } catch (err) {
      throw new Error(`AI generation failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setAiLoading(false)
    }
  }, [])

  const submitStage1 = useCallback(async () => {
    setError(null)
    if (!data.name.trim() || !data.phone.trim() || !data.purpose) {
      setError("Drop your name, number, and pick a vibe first.")
      return false
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: row, error: err } = await supabase
        .from("leads")
        .insert({
          name: data.name,
          phone: data.phone,
          whats_this_for: data.whatsThisFor || null,
          promo_code: data.promoCode || null,
          purpose: data.purpose,
          stage: 1,
        })
        .select("id")
        .single()

      if (err) throw err
      update({ id: row.id as string })
      setStage(2)
      return true
    } catch (e) {
      console.log("[v0] submitStage1 error:", e)
      setError("Something broke syncing your data. Try again.")
      return false
    } finally {
      setLoading(false)
    }
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
        anthem_title: data.anthemTitle || null,
        anniversary_date: data.anniversaryDate || null,
        destination_city: data.destinationCity || null,
        travel_hours: data.travelHours || null,
        delusional_habit: data.delusionalHabit || null,
        birth_year: data.birthYear || null,
        photos: data.photos.map((p) => p.name),
        stage: 3,
        updated_at: new Date().toISOString(),
      }
      if (data.id) {
        const { error: err } = await supabase.from("leads").update(payload).eq("id", data.id)
        if (err) throw err
      }

      const content = await generateAiContent(data)
      setAiContent(content)

      setStage(3)
      return true
    } catch (e) {
      console.log("[v0] submitStage2 error:", e)
      setError("AI generation failed. Please try again.")
      return false
    } finally {
      setLoading(false)
      setAiLoading(false)
    }
  }, [data, generateAiContent])

  const value = useMemo<WrapContextValue>(
    () => ({ stage, data, loading, error, aiContent, aiLoading, update, setStage, submitStage1, submitStage2, reset }),
    [stage, data, loading, error, aiContent, aiLoading, update, submitStage1, submitStage2, reset],
  )

  return <WrapContext.Provider value={value}>{children}</WrapContext.Provider>
}

export function useWrap() {
  const ctx = useContext(WrapContext)
  if (!ctx) throw new Error("useWrap must be used within WrapProvider")
  return ctx
}
