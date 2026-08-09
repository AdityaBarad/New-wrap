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
    value: string | number
    label: string
    note: string
  }
  highlightCard: {
    kicker: string
    title: string
    subtitle: string
  }
  topListTitle: string
  topList: string[]
  statProfile: {
    name: string
    stat1Label: string
    stat1Value: string
    stat2Label: string
    stat2Value: string
    stat3Label: string
    stat3Value: string
    stat4Label: string
    stat4Value: string
  }
  globalFootprint: {
    title: string
    description1: string
    description2: string
  }
  photoRanking: {
    title: string
    items: string[]
  }
  blockRanking: {
    title: string
    items: string[]
  }
  summaryDashboard: {
    list1Title: string
    list1: string[]
    list2Title: string
    list2: string[]
    list3Title: string
    list3: string[]
    bottomMetric: string
    bottomMetricLabel: string
  }
  finale: {
    title: string
    tagline: string
    metricValue: string
    metricLabel: string
    topPercent: string
    topPercentLabel: string
  }
  personalityCard: {
    title: string
    description: string
    imagePrompt: string
  }
}
