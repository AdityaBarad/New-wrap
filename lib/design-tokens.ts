/**
 * Design Token System for the Wrapped Spatial Animation Engine.
 *
 * Each slide owns a `SlideDesignProfile` that drives:
 * - Color palette (bg / ink / accent / glow)
 * - Typography alignment & scale
 * - Spring physics (stiffness / damping / mass)
 * - Spatial enter/exit motion vectors
 * - Parallax layer depths
 * - Scrolling-grid parameters
 */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type SpringConfig = {
  stiffness: number
  damping: number
  mass: number
}

export type SpatialVector = {
  x: number
  y: number
  rotate: number
  scale: number
}

export type ParallaxLayer = {
  /** 0 = background, 5 = foreground chrome */
  depth: number
  /** Horizontal drift range in px on pointer move */
  driftX: number
  /** Vertical drift range in px on pointer move */
  driftY: number
}

export type GridConfig = {
  /** Grid cell size in px */
  size: number
  /** Grid line opacity (0–1) */
  opacity: number
  /** Drift speed in seconds for one full cell-length scroll */
  driftSpeed: number
}

export type HeadingScale = "sm" | "md" | "lg" | "xl"
export type HeadingAlign = "left" | "center"

export type SlideDesignProfile = {
  /* ── Colors ── */
  bg: string
  ink: string
  accent: string
  /** Radial glow overlay color (with alpha) */
  glow: string

  /* ── Typography ── */
  headingAlign: HeadingAlign
  headingScale: HeadingScale

  /* ── Physics ── */
  spring: SpringConfig
  /** Spatial offset applied on enter (initial state) */
  enter: SpatialVector
  /** Spatial offset applied on exit */
  exit: SpatialVector

  /* ── Parallax ── */
  layers: ParallaxLayer[]

  /* ── Grid overlay ── */
  grid: GridConfig
}

/* ------------------------------------------------------------------ */
/* Default layer stack (shared baseline, per-slide override via depth) */
/* ------------------------------------------------------------------ */

const DEFAULT_LAYERS: ParallaxLayer[] = [
  { depth: 0, driftX: 4, driftY: 3 },   // background warp
  { depth: 1, driftX: 8, driftY: 6 },   // grid overlay
  { depth: 2, driftX: 10, driftY: 8 },  // halftone / texture
  { depth: 3, driftX: 14, driftY: 10 }, // content (typography + data)
  { depth: 4, driftX: 20, driftY: 16 }, // foreground particles
  { depth: 5, driftX: 24, driftY: 20 }, // UI chrome
]

const DEFAULT_GRID: GridConfig = {
  size: 44,
  opacity: 0.13,
  driftSpeed: 6,
}

/* ------------------------------------------------------------------ */
/* Helper: build a spatial enter/exit vector for a given direction     */
/* ------------------------------------------------------------------ */

type Direction = "diagonal-right" | "diagonal-left" | "rise" | "drop" | "zoom"

function buildVectors(dir: Direction): { enter: SpatialVector; exit: SpatialVector } {
  switch (dir) {
    case "diagonal-right":
      return {
        enter: { x: 200, y: 60, rotate: 6, scale: 0.85 },
        exit: { x: -200, y: -40, rotate: -4, scale: 0.88 },
      }
    case "diagonal-left":
      return {
        enter: { x: -200, y: 50, rotate: -5, scale: 0.86 },
        exit: { x: 200, y: -50, rotate: 5, scale: 0.87 },
      }
    case "rise":
      return {
        enter: { x: 0, y: 160, rotate: 3, scale: 0.88 },
        exit: { x: 0, y: -160, rotate: -3, scale: 0.9 },
      }
    case "drop":
      return {
        enter: { x: 0, y: -140, rotate: -2, scale: 0.9 },
        exit: { x: 0, y: 140, rotate: 2, scale: 0.88 },
      }
    case "zoom":
      return {
        enter: { x: 0, y: 0, rotate: 8, scale: 0.4 },
        exit: { x: 0, y: 0, rotate: -8, scale: 1.6 },
      }
  }
}

/* ------------------------------------------------------------------ */
/* Per-slide profiles                                                  */
/* ------------------------------------------------------------------ */

export const SLIDE_PROFILES: Record<string, SlideDesignProfile> = {
  /* S1 — IntroUniverse: the hero cover */
  s1: {
    bg: "var(--wr-pink)",
    ink: "var(--wr-ink)",
    accent: "var(--wr-yellow)",
    glow: "rgba(255, 77, 168, 0.18)",
    headingAlign: "left",
    headingScale: "xl",
    spring: { stiffness: 260, damping: 26, mass: 0.9 },
    ...buildVectors("diagonal-right"),
    layers: DEFAULT_LAYERS,
    grid: { ...DEFAULT_GRID, opacity: 0 }, // no grid on intro
  },

  /* S2 — DataHighlight: kinetic grid + count-up */
  s2: {
    bg: "var(--wr-ink)",
    ink: "var(--wr-green)",
    accent: "var(--wr-pink)",
    glow: "rgba(33, 224, 101, 0.12)",
    headingAlign: "center",
    headingScale: "xl",
    spring: { stiffness: 220, damping: 22, mass: 1 },
    ...buildVectors("rise"),
    layers: DEFAULT_LAYERS,
    grid: { size: 44, opacity: 0.14, driftSpeed: 6 },
  },

  /* S3 — TopTrack: typography wall + vinyl */
  s3: {
    bg: "var(--wr-purple)",
    ink: "var(--wr-yellow)",
    accent: "var(--wr-green)",
    glow: "rgba(123, 47, 242, 0.2)",
    headingAlign: "left",
    headingScale: "lg",
    spring: { stiffness: 280, damping: 24, mass: 0.85 },
    ...buildVectors("diagonal-left"),
    layers: DEFAULT_LAYERS,
    grid: { ...DEFAULT_GRID, opacity: 0 },
  },

  /* S4 — Receipts: staggered leaderboard */
  s4: {
    bg: "var(--wr-green)",
    ink: "var(--wr-ink)",
    accent: "var(--wr-pink)",
    glow: "rgba(33, 224, 101, 0.15)",
    headingAlign: "left",
    headingScale: "md",
    spring: { stiffness: 240, damping: 24, mass: 0.95 },
    ...buildVectors("drop"),
    layers: DEFAULT_LAYERS,
    grid: { ...DEFAULT_GRID, opacity: 0.08 },
  },

  /* S5 — VersusLeague: crashing headline */
  s5: {
    bg: "var(--wr-yellow)",
    ink: "var(--wr-ink)",
    accent: "var(--wr-pink)",
    glow: "rgba(228, 255, 49, 0.14)",
    headingAlign: "center",
    headingScale: "lg",
    spring: { stiffness: 300, damping: 20, mass: 0.8 },
    ...buildVectors("diagonal-right"),
    layers: DEFAULT_LAYERS,
    grid: { ...DEFAULT_GRID, opacity: 0 },
  },

  /* S6 — VersusBoard: ranked matchups */
  s6: {
    bg: "var(--wr-orange)",
    ink: "var(--wr-ink)",
    accent: "var(--wr-purple)",
    glow: "rgba(255, 106, 19, 0.16)",
    headingAlign: "left",
    headingScale: "md",
    spring: { stiffness: 260, damping: 26, mass: 0.9 },
    ...buildVectors("diagonal-left"),
    layers: DEFAULT_LAYERS,
    grid: { ...DEFAULT_GRID, opacity: 0.06 },
  },

  /* S7 — Dashboard: festival ticket */
  s7: {
    bg: "var(--wr-ink)",
    ink: "var(--wr-ink)",
    accent: "var(--wr-green)",
    glow: "rgba(238, 238, 228, 0.06)",
    headingAlign: "center",
    headingScale: "sm",
    spring: { stiffness: 200, damping: 20, mass: 1.1 },
    ...buildVectors("rise"),
    layers: DEFAULT_LAYERS,
    grid: { ...DEFAULT_GRID, opacity: 0 },
  },

  /* S8 — Finale: share card + kaleidoscope */
  s8: {
    bg: "var(--wr-ink)",
    ink: "var(--wr-cream)",
    accent: "var(--wr-green)",
    glow: "rgba(255, 77, 168, 0.1)",
    headingAlign: "center",
    headingScale: "md",
    spring: { stiffness: 260, damping: 26, mass: 0.9 },
    ...buildVectors("zoom"),
    layers: DEFAULT_LAYERS,
    grid: { ...DEFAULT_GRID, opacity: 0 },
  },
}

/* ------------------------------------------------------------------ */
/* AI override merge                                                   */
/* ------------------------------------------------------------------ */

export type SlideDesignOverride = Partial<{
  bg: string
  ink: string
  accent: string
  glow: string
  spring: Partial<SpringConfig>
  headingAlign: HeadingAlign
  headingScale: HeadingScale
}>

/**
 * Merge an AI-supplied override into a base profile.
 * Unknown keys are silently dropped for forward-compat.
 */
export function resolveTheme(
  base: SlideDesignProfile,
  override?: SlideDesignOverride | null,
): SlideDesignProfile {
  if (!override) return base
  return {
    ...base,
    ...(override.bg && { bg: override.bg }),
    ...(override.ink && { ink: override.ink }),
    ...(override.accent && { accent: override.accent }),
    ...(override.glow && { glow: override.glow }),
    ...(override.headingAlign && { headingAlign: override.headingAlign }),
    ...(override.headingScale && { headingScale: override.headingScale }),
    ...(override.spring && {
      spring: { ...base.spring, ...override.spring },
    }),
  }
}

/**
 * Get the profile for a slide key, falling back to s1 defaults.
 */
export function getSlideProfile(key: string): SlideDesignProfile {
  return SLIDE_PROFILES[key] ?? SLIDE_PROFILES.s1
}
