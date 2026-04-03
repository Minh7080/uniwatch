export const REDDIT_BASE = "https://reddit.com"

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

export function formatScore(score: number | null): string {
  if (score === null) return "–"
  if (Math.abs(score) >= 1000) return `${(score / 1000).toFixed(1)}k`
  return String(score)
}

export const isValidThumbnail = (url: string | null): url is string =>
  !!url &&
  url !== "self" &&
  url !== "default" &&
  url !== "nsfw" &&
  url !== "spoiler" &&
  url.startsWith("http")
