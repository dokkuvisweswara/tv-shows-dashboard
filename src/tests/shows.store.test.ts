import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { tvmazeService } from '../services/tvmaze.service'
import { useShowsStore } from '../stores/shows.store'
import type { Show } from '../types/show.types'

vi.mock('../services/tvmaze.service', () => ({ tvmazeService: {
  getShows: vi.fn(), getShow: vi.fn(), getCast: vi.fn(), searchShows: vi.fn(), getEpisodes: vi.fn()
} }))
const makeShow = (id: number, name = `Show ${id}`): Show => ({ id, name, genres: ['Drama'], rating: { average: 8 }, image: null, summary: null, premiered: null, ended: null, status: 'Running', runtime: null, language: null, officialSite: null, network: null, webChannel: null, url: '' })

describe('shows Pinia store', () => {
  beforeEach(() => { setActivePinia(createPinia()); vi.clearAllMocks() })

  it('loads shows and exposes genre groups', async () => {
    vi.mocked(tvmazeService.getShows).mockResolvedValue([makeShow(1)])
    const store = useShowsStore()
    await store.fetchShows()
    expect(store.shows).toHaveLength(1)
    expect(store.genres.Drama[0].name).toBe('Show 1')
    expect(store.loading).toBe(false)
  })

  it('does not fetch the show index again when data is already loaded', async () => {
    vi.mocked(tvmazeService.getShows).mockResolvedValue([makeShow(1)])
    const store = useShowsStore()
    await store.fetchShows(); await store.fetchShows()
    expect(tvmazeService.getShows).toHaveBeenCalledTimes(1)
  })

  it('stores show details and cast together', async () => {
    const cast = [{ person: { id: 10, name: 'Actor', image: null }, character: { name: 'Role' } }]
    vi.mocked(tvmazeService.getShow).mockResolvedValue(makeShow(2))
    vi.mocked(tvmazeService.getCast).mockResolvedValue(cast)
    const store = useShowsStore()
    await store.fetchShow(2)
    expect(store.selectedShow?.id).toBe(2)
    expect(store.cast).toEqual(cast)
    expect(store.detailLoading).toBe(false)
  })

  it('captures API errors for the home screen', async () => {
    vi.mocked(tvmazeService.getShows).mockRejectedValue(new Error('Network unavailable'))
    const store = useShowsStore()
    await store.fetchShows()
    expect(store.error).toBe('Network unavailable')
    expect(store.loading).toBe(false)
  })

  it('maps TVMaze search results to shows and clears results for blank input', async () => {
    vi.mocked(tvmazeService.searchShows).mockResolvedValue([{ score: 1, show: makeShow(3, 'Girls') }])
    const store = useShowsStore()
    await store.search('girls')
    expect(store.searchResults.map(item => item.name)).toEqual(['Girls'])
    await store.search('  ')
    expect(store.searchResults).toEqual([])
    expect(tvmazeService.searchShows).toHaveBeenCalledTimes(1)
  })
})
