/**
 * Types for AI-generated wrap content AND visual design tokens.
 * The AI returns both personalized text + a unique design config per slide.
 */

/* ── Design token enums ── */

export type ColorName = "green" | "pink" | "yellow" | "ink" | "purple" | "orange"
export type LayoutVariant = "split-left" | "split-right" | "centered" | "stacked"
export type BgPattern = "halftone" | "grid" | "dots" | "gradient" | "noise" | "clean"
export type DecorationStyle = "cubes" | "circles" | "stars" | "lines" | "none"
export type TypoStyle = "massive" | "elegant" | "rotated" | "outlined"

/** Visual design tokens for a single slide */
export type SlideDesign = {
  bg: ColorName
  ink: ColorName
  accent: ColorName
  layout: LayoutVariant
  bgPattern: BgPattern
  decoration: DecorationStyle
  typoStyle: TypoStyle
}

/* ── Specific Slide Data Payloads ── */

export type IntroPayload = { kicker: string; lines: [string, string, string]; sub: string }
export type DataHighlightPayload = { kicker: string; label: string; note: string; valueOverride?: number }
export type TopTrackPayload = { kicker: string; artistLine: string; anthemTitleOverride?: string }
export type ReceiptsPayload = { title: string; rows: { label: string; value: string }[] }
export type VersusPayload = { kicker: string; left: string; right: string; leagueTitle: string }
export type VersusBoardPayload = { kicker: string; title: string; games: { team1: string; team2: string; competition: string }[] }
export type DashboardPayload = { topArtists: string[]; topSongs: string[]; topGenre: string }
export type FinalePayload = { tagline: string }

export type ThreadPayload = {
  kicker: string
  messages: { sender: "me" | "them"; text: string }[]
  footerNote: string
}
export type RadarPayload = {
  title: string
  traits: { label: string; value: number }[] // value 0-100
  verdict: string
}
export type QuotePayload = {
  quote: string
  author: string
}
export type PolaroidPayload = {
  kicker: string
  captions: string[] // handwritten captions for photos
}
export type RoastPayload = {
  title: string
  roastLines: string[]
}
export type AwardPayload = {
  awardName: string
  recipientCategory: string
  reason: string
}

/* ── The Dynamic Slide Union ── */

export type SlideData =
  | { type: "intro"; design: SlideDesign; content: IntroPayload }
  | { type: "dataHighlight"; design: SlideDesign; content: DataHighlightPayload }
  | { type: "topTrack"; design: SlideDesign; content: TopTrackPayload }
  | { type: "receipts"; design: SlideDesign; content: ReceiptsPayload }
  | { type: "versus"; design: SlideDesign; content: VersusPayload }
  | { type: "versusBoard"; design: SlideDesign; content: VersusBoardPayload }
  | { type: "dashboard"; design: SlideDesign; content: DashboardPayload }
  | { type: "finale"; design: SlideDesign; content: FinalePayload }
  | { type: "thread"; design: SlideDesign; content: ThreadPayload }
  | { type: "radar"; design: SlideDesign; content: RadarPayload }
  | { type: "quote"; design: SlideDesign; content: QuotePayload }
  | { type: "polaroid"; design: SlideDesign; content: PolaroidPayload }
  | { type: "roast"; design: SlideDesign; content: RoastPayload }
  | { type: "award"; design: SlideDesign; content: AwardPayload }

/** The complete JSON schema returned by Gemini */
export type AiWrapContent = {
  slides: SlideData[]
}
