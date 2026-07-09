/**
 * The JSON schema returned by Gemini for personalized wrap content.
 * Each key maps to one of the 8 wrap slides.
 */

export type AiWrapContent = {
  intro: {
    kicker: string
    lines: [string, string, string]
    sub: string
  }
  dataHighlight: {
    kicker: string
    label: string
    note: string
  }
  topTrack: {
    kicker: string
    artistLine: string
  }
  receipts: {
    title: string
    rows: { label: string; value: string }[]
  }
  versus: {
    kicker: string
    left: string
    right: string
    leagueTitle: string
  }
  versusBoard: {
    kicker: string
    title: string
    games: { team1: string; team2: string; competition: string }[]
  }
  dashboard: {
    topArtists: string[]
    topSongs: string[]
    topGenre: string
  }
  finale: {
    tagline: string
  }
}
