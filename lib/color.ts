export const SPOTIFY_COLORS = [
  "#ff6666", "#ff8a8a", "#ffa1a1", "#ff4da8", "#ff66b3",
  "#ff99cc", "#ffb3e6", "#e60073", "#ff4d4d", "#ff6a13",
  "#ff876a", "#ff9640", "#ffb366", "#ffcc99", "#ffdb4d",
  "#ffe854", "#ffff66", "#c4f033", "#a6ff4d", "#ccff99",
  "#21e065", "#3de3a3", "#4de3a8", "#66ffcc", "#00e673",
  "#33cc33", "#4dd2ff", "#66c2ff", "#7ac5ff", "#99ddff",
  "#3399ff", "#0073e6", "#4d4dff", "#7b2ff2", "#9933ff",
  "#b366ff", "#cca3ff", "#d6a3ff", "#e6ccff", "#ff33cc",
  "#ff66d9", "#ff99e6", "#cc0099", "#ff5050", "#ff9999",
  "#ffd480", "#80ffaa", "#80bfff", "#d279d2", "#e6b3b3"
]

export function getCardColor(slug: string) {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash)
  }
  return SPOTIFY_COLORS[Math.abs(hash) % SPOTIFY_COLORS.length]
}
