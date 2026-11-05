import type { CastMember, SearchResult, Show } from '../types/show.types'
import type { Episode } from '../types/episode.types'

const API_BASE = 'https://api.tvmaze.com'

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { signal })
  if (!response.ok) {
    throw new Error(`TVMaze request failed (${response.status}). Please try again.`)
  }
  return response.json() as Promise<T>
}

export const tvmazeService = {
  getShows: (page = 0, signal?: AbortSignal) => request<Show[]>(`/shows?page=${page}`, signal),
  getShow: (id: number, signal?: AbortSignal) => request<Show>(`/shows/${id}`, signal),
  getEpisodes: (id: number, signal?: AbortSignal) => request<Episode[]>(`/shows/${id}/episodes`, signal),
  searchShows: (query: string, signal?: AbortSignal) =>
    request<SearchResult[]>(`/search/shows?q=${encodeURIComponent(query)}`, signal),
  getCast: (id: number, signal?: AbortSignal) => request<CastMember[]>(`/shows/${id}/cast`, signal)
}
