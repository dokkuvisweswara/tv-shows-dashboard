import type { Show } from '../types/show.types'
export function ratingValue(show: Show): number { return show.rating?.average ?? 0 }
export function sortByRating(shows: Show[]): Show[] {
  return [...shows].sort((a, b) => ratingValue(b) - ratingValue(a) || a.name.localeCompare(b.name))
}
export function groupShowsByGenre(shows: Show[]): Record<string, Show[]> {
  const groups: Record<string, Show[]> = {}
  for (const show of shows) for (const genre of show.genres ?? []) (groups[genre] ??= []).push(show)
  for (const genre of Object.keys(groups)) groups[genre] = sortByRating(groups[genre])
  return Object.fromEntries(Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)))
}
export function cleanSummary(summary: string | null): string {
  return (summary ?? 'No summary is available for this show.').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}
