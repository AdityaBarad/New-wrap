import type { WrapData } from "@/context/wrap-context"

/** Deterministic hash so the same inputs always give the same "stats". */
function seedFrom(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function fmt(n: number) {
  return n.toLocaleString("en-US")
}

export type WrapStats = {
  firstName: string
  rand: () => number
  int: (min: number, max: number) => number
  pick: <T>(arr: T[]) => T
  // headline metrics
  minutesLived: number
  topPercent: number
  streakDays: number
  wordsYapped: number
  photosCount: number
  nightOwlPct: number
}

export function buildStats(data: WrapData): WrapStats {
  const key = [data.name, data.phone, data.purpose, data.userNames].join("|")
  const rand = mulberry(seedFrom(key || "wrapped"))
  const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)]
  const firstName = (data.name || data.userNames || "You").trim().split(/\s+/)[0]

  return {
    firstName,
    rand,
    int,
    pick,
    minutesLived: int(320000, 528000),
    topPercent: int(1, 9),
    streakDays: int(120, 364),
    wordsYapped: int(180000, 940000),
    photosCount: Math.max(data.photos.length, int(340, 2100)),
    nightOwlPct: int(58, 92),
  }
}
