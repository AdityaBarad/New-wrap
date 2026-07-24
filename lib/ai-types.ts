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
  share: {
    title: string
    hashtag: string
  }
  dataHighlight: {
    kicker: string
    label: string
    note: string
  }
  topTrack: {
    kicker: string
    title: string
    artistLine: string
  }
  globalArtistsTitle: string
  globalArtists: string[]
  artistStats: {
    name: string
    streams: string
    hours: string
    listeners: string
    countries: string
  }
  worldCitizen: {
    title: string
    description1: string
    description2: string
    countriesCount: number
    artists: { name: string; country: string }[]
  }
  dashboard: {
    topArtistsTitle: string
    topArtists: string[]
    topSongs: string[]
    topGenresTitle: string
    topGenres: string[]
    minutesListened: string
  }
  finale: {
    title: string
    tagline: string
    minutesLived: string
    minutesLabel: string
    topPercent: string
    topPercentLabel: string
  }
  personalityCard: {
    title: string
    description: string
    imagePrompt: string
  }
}
