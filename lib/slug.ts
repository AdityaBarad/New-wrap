/**
 * Generate a URL-friendly slug from a name.
 * Format: {sanitized-name}-{6-char-random} → e.g. "zeynep-x7k9m2"
 */
export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 15)

  const random = Math.random().toString(36).substring(2, 8)
  return `${base || "wrap"}-${random}`
}
