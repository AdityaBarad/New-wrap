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

export const VIBES = [
  { id: "hyperpop", label: "HYPERPOP OVERDRIVE", color: "var(--wr-pink)" },
  { id: "lofi", label: "LATE NIGHT LO-FI", color: "var(--wr-purple)" },
  { id: "stadium", label: "STADIUM ANTHEM", color: "var(--wr-green)" },
  { id: "ystep", label: "Y2K DANCE STEP", color: "var(--wr-yellow)" },
  { id: "cinema", label: "CINEMATIC SCORE", color: "var(--wr-orange)" },
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
  vibe: string
  anthemTitle: string
  anniversaryDate: string
  destinationCity: string
  travelHours: string
  delusionalHabit: string
  birthYear: string
  photos: LocalPhoto[]
}

const initialData: WrapData = {
  name: "",
  phone: "",
  whatsThisFor: "",
  promoCode: "",
  purpose: null,
  userNames: "",
  chatExportName: "",
  vibe: "",
  anthemTitle: "",
  anniversaryDate: "",
  destinationCity: "",
  travelHours: "",
  delusionalHabit: "",
  birthYear: "",
  photos: [],
}

type Stage = 1 | 2 | 3

type WrapContextValue = {
  stage: Stage
  data: WrapData
  loading: boolean
  error: string | null
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

  const update = useCallback((patch: Partial<WrapData>) => {
    setData((d) => ({ ...d, ...patch }))
  }, [])

  const reset = useCallback(() => {
    setData(initialData)
    setStage(1)
    setError(null)
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
    try {
      const supabase = createClient()
      const payload = {
        user_names: data.userNames || null,
        chat_export_name: data.chatExportName || null,
        vibe: data.vibe || null,
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
      setStage(3)
      return true
    } catch (e) {
      console.log("[v0] submitStage2 error:", e)
      // Don't hard-block the experience if the update fails — still let them play
      setStage(3)
      return true
    } finally {
      setLoading(false)
    }
  }, [data])

  const value = useMemo<WrapContextValue>(
    () => ({ stage, data, loading, error, update, setStage, submitStage1, submitStage2, reset }),
    [stage, data, loading, error, update, submitStage1, submitStage2, reset],
  )

  return <WrapContext.Provider value={value}>{children}</WrapContext.Provider>
}

export function useWrap() {
  const ctx = useContext(WrapContext)
  if (!ctx) throw new Error("useWrap must be used within WrapProvider")
  return ctx
}
