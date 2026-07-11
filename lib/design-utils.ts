import type { SlideDesign, ColorName, TypoStyle } from "@/lib/ai-types"

/* ── Color name → CSS variable mapping ── */

const COLOR_MAP: Record<string, string> = {
  green: "var(--wr-green)",
  pink: "var(--wr-pink)",
  yellow: "var(--wr-yellow)",
  ink: "var(--wr-ink)",
  purple: "var(--wr-purple)",
  orange: "var(--wr-orange)",
  cream: "var(--wr-cream)",
}

/** Resolve a color name (from AI) to its CSS variable */
export function c(name: string): string {
  return COLOR_MAP[name] ?? COLOR_MAP.ink
}

/* ── Typography class helpers ── */

const HEADING_BASE =
  "font-display font-black leading-[0.92] tracking-tight text-balance"

const TYPO_CLASSES: Record<TypoStyle, string> = {
  massive:
    `${HEADING_BASE} text-[3.2rem] leading-[0.85] tracking-tighter md:text-7xl xl:text-8xl`,
  elegant:
    `${HEADING_BASE} text-[2.5rem] md:text-5xl xl:text-6xl`,
  rotated:
    `${HEADING_BASE} text-[2.7rem] -rotate-2 md:text-6xl xl:text-7xl`,
  outlined:
    `${HEADING_BASE} text-[2.7rem] md:text-6xl xl:text-7xl`,
}

/** Get heading className for a typography style */
export function typoClass(style: TypoStyle | undefined): string {
  return TYPO_CLASSES[style ?? "massive"]
}

/** Inline style for outlined typography */
export function typoOutlineStyle(
  style: TypoStyle | undefined,
  ink: string,
): React.CSSProperties | undefined {
  if (style !== "outlined") return undefined
  return {
    color: "transparent",
    WebkitTextStroke: `2.5px ${ink}`,
  }
}

/* ── Default design tokens (matches current hardcoded look) ── */

export const DEFAULT_DESIGNS: Record<string, SlideDesign> = {
  intro: {
    bg: "pink",
    ink: "ink",
    accent: "green",
    layout: "split-left",
    bgPattern: "halftone",
    decoration: "none",
    typoStyle: "massive",
  },
  dataHighlight: {
    bg: "ink",
    ink: "green",
    accent: "pink",
    layout: "centered",
    bgPattern: "grid",
    decoration: "cubes",
    typoStyle: "massive",
  },
  topTrack: {
    bg: "purple",
    ink: "yellow",
    accent: "green",
    layout: "split-left",
    bgPattern: "clean",
    decoration: "none",
    typoStyle: "massive",
  },
  receipts: {
    bg: "green",
    ink: "ink",
    accent: "pink",
    layout: "stacked",
    bgPattern: "halftone",
    decoration: "none",
    typoStyle: "elegant",
  },
  versus: {
    bg: "yellow",
    ink: "ink",
    accent: "pink",
    layout: "centered",
    bgPattern: "halftone",
    decoration: "none",
    typoStyle: "massive",
  },
  versusBoard: {
    bg: "orange",
    ink: "ink",
    accent: "purple",
    layout: "stacked",
    bgPattern: "halftone",
    decoration: "none",
    typoStyle: "elegant",
  },
  dashboard: {
    bg: "ink",
    ink: "ink",
    accent: "green",
    layout: "centered",
    bgPattern: "halftone",
    decoration: "none",
    typoStyle: "elegant",
  },
  finale: {
    bg: "ink",
    ink: "cream",
    accent: "green",
    layout: "centered",
    bgPattern: "clean",
    decoration: "none",
    typoStyle: "massive",
  },
}

/** Get design for a slide, with fallback to defaults */
export function getDesign(
  ai: { design?: Record<string, SlideDesign> } | null | undefined,
  slideType: string,
): SlideDesign {
  return ai?.design?.[slideType as keyof typeof ai.design] as SlideDesign ??
    DEFAULT_DESIGNS[slideType] ??
    DEFAULT_DESIGNS.intro
}
