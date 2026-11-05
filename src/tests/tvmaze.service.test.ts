import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { tvmazeService } from '../services/tvmaze.service'

const show = { id: 1, name: 'Girls' }

describe('tvmazeService', () => {
  const fetchMock = vi.fn()
  beforeEach(() => { vi.stubGlobal('fetch', fetchMock); fetchMock.mockReset() })
  afterEach(() => { vi.unstubAllGlobals() })

  it('fetches the show index', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [show] })
    await expect(tvmazeService.getShows(0)).resolves.toEqual([show])
    expect(fetchMock).toHaveBeenCalledWith('https://api.tvmaze.com/shows?page=0', { signal: undefined })
  })

  it('encodes search terms and forwards the abort signal', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] })
    const controller = new AbortController()
    await tvmazeService.searchShows('girls & guys', controller.signal)
    expect(fetchMock).toHaveBeenCalledWith('https://api.tvmaze.com/search/shows?q=girls%20%26%20guys', { signal: controller.signal })
  })

  it('requests show episodes by show id', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] })
    await tvmazeService.getEpisodes(1)
    expect(fetchMock).toHaveBeenCalledWith('https://api.tvmaze.com/shows/1/episodes', { signal: undefined })
  })

  it('throws a useful error for non-success HTTP responses', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503 })
    await expect(tvmazeService.getShow(1)).rejects.toThrow('TVMaze request failed (503)')
  })

  it('propagates abort errors from fetch', async () => {
    const abortError = new DOMException('Aborted', 'AbortError')
    fetchMock.mockRejectedValue(abortError)
    await expect(tvmazeService.searchShows('girls')).rejects.toBe(abortError)
  })
})
