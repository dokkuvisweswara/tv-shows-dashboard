import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import FeaturedHeroCarousel from '../components/shows/FeaturedHeroCarousel.vue'
import type { Show } from '../types/show.types'
const makeShow = (id: number): Show => ({ id, name: `Featured ${id}`, genres: ['Drama'], rating: { average: 8 }, image: null, summary: null, premiered: '2020-01-01', ended: null, status: 'Running', runtime: 45, language: 'English', officialSite: null, network: null, webChannel: null, url: '' })

describe('FeaturedHeroCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', () => ({ matches: true, addListener: vi.fn(), removeListener: vi.fn() }))
  })
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals() })

  it('renders up to four slides and changes with the next/previous buttons and dots', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/shows/:id', component: { template: '<div />' } }] })
    const wrapper = mount(FeaturedHeroCarousel, { props: { shows: [1, 2, 3, 4, 5].map(makeShow) }, global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Featured 1')
    expect(wrapper.findAll('.hero-dot')).toHaveLength(4)
    await wrapper.get('[aria-label="Next featured show"]').trigger('click')
    expect(wrapper.text()).toContain('Featured 2')
    await wrapper.get('[aria-label="Previous featured show"]').trigger('click')
    expect(wrapper.text()).toContain('Featured 1')
    await wrapper.get('[aria-label="Show 4: Featured 4"]').trigger('click')
    expect(wrapper.text()).toContain('Featured 4')
    wrapper.unmount()
  })

  it('advances automatically after the configured interval', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }))
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/shows/:id', component: { template: '<div />' } }] })
    const wrapper = mount(FeaturedHeroCarousel, { props: { shows: [1, 2].map(makeShow), intervalMs: 1000 }, global: { plugins: [router] } })
    await vi.advanceTimersByTimeAsync(1000)
    expect(wrapper.text()).toContain('Featured 2')
    wrapper.unmount()
  })
})
