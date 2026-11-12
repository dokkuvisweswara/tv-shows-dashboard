import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SearchView from '../views/SearchView.vue'
import { tvmazeService } from '../services/tvmaze.service'
import type { Show } from '../types/show.types'

vi.mock('../services/tvmaze.service', () => ({ tvmazeService: { searchShows: vi.fn() } }))
const show: Show = { id: 7, name: 'Girls', genres: ['Drama'], rating: { average: 7.4 }, image: null, summary: null, premiered: null, ended: null, status: 'Ended', runtime: null, language: null, officialSite: null, network: null, webChannel: null, url: '' }
const routes = [{ path: '/search', name: 'search', component: SearchView }]

async function mountSearch(query = '') {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push({ name: 'search', query: query ? { q: query } : {} })
  await router.isReady()
  const wrapper = mount(SearchView, { global: { plugins: [router], stubs: { ShowCard: { props: ['show'], template: '<article class="result-card">{{ show.name }}</article>' }, LoadingSpinner: { template: '<div class="loading">Loading</div>' } } } })
  return { wrapper, router }
}

describe('SearchView', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.clearAllMocks() })
  afterEach(() => vi.useRealTimers())

  it('debounces input before calling TVMaze and renders returned shows', async () => {
    vi.mocked(tvmazeService.searchShows).mockResolvedValue([{ score: 1, show }])
    const { wrapper } = await mountSearch()
    await wrapper.get('#show-search-input').setValue('girls')
    await vi.advanceTimersByTimeAsync(349)
    expect(tvmazeService.searchShows).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    await flushPromises()
    expect(tvmazeService.searchShows).toHaveBeenCalledWith('girls', expect.any(AbortSignal))
    expect(wrapper.text()).toContain('Girls')
    wrapper.unmount()
  })

  it('shows an empty state when the API returns no matches', async () => {
    vi.mocked(tvmazeService.searchShows).mockResolvedValue([])
    const { wrapper } = await mountSearch('unknown')
    await vi.advanceTimersByTimeAsync(350)
    await flushPromises()
    expect(wrapper.text()).toContain('No shows found')
    wrapper.unmount()
  })

  it('aborts the previous request when a new debounced query starts', async () => {
    let firstSignal: AbortSignal | undefined
    vi.mocked(tvmazeService.searchShows).mockImplementation((_query, signal) => {
      if (!firstSignal) firstSignal = signal
      return new Promise(() => {})
    })
    const { wrapper } = await mountSearch('girls')
    await vi.advanceTimersByTimeAsync(350)
    await flushPromises()
    const firstRequestAborted: boolean = firstSignal?.aborted ?? false
    expect(firstRequestAborted).toBe(false)
    await wrapper.get('#show-search-input').setValue('friends')
    await vi.advanceTimersByTimeAsync(350)
    await flushPromises()
    expect(firstSignal?.aborted).toBe(true)
    wrapper.unmount()
  })

  it('clears the query and removes results', async () => {
    const { wrapper } = await mountSearch('girls')
    await wrapper.get('[aria-label="Clear search"]').trigger('click')
    expect((wrapper.get('#show-search-input').element as HTMLInputElement).value).toBe('')
    wrapper.unmount()
  })
})
