import { mount, flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import EpisodeCarousel from '../components/episodes/EpisodeCarousel.vue'
import { tvmazeService } from '../services/tvmaze.service'
import type { Episode } from '../types/episode.types'

vi.mock('../services/tvmaze.service', () => ({ tvmazeService: { getEpisodes: vi.fn() } }))
const episode = (id: number, season: number, number: number, name: string): Episode => ({ id, season, number, name, airdate: '2020-01-01', airtime: '', runtime: 42, summary: '<p>Episode summary</p>', image: null, rating: { average: 8 } })

describe('EpisodeCarousel', () => {
  beforeEach(() => vi.clearAllMocks())

  it('loads episodes, sorts by season/episode and filters by selected season', async () => {
    vi.mocked(tvmazeService.getEpisodes).mockResolvedValue([episode(3, 2, 1, 'Season 2'), episode(2, 1, 2, 'Episode 2'), episode(1, 1, 1, 'Episode 1')])
    const wrapper = mount(EpisodeCarousel, { props: { showId: 1 } })
    await flushPromises()
    expect(wrapper.text()).toContain('Episode 1')
    expect(wrapper.text()).toContain('Episode 2')
    // Both seasons should remain available in the dropdown.
  expect(wrapper.get('#season-select').text()).toContain('Season 2')

  // Initially, Season 1 should be selected.
  expect((wrapper.get('#season-select').element as HTMLSelectElement).value).toBe('1')
    await wrapper.get('#season-select').setValue(2)
    expect(wrapper.text()).toContain('Season 2')
    expect(wrapper.text()).not.toContain('Episode 1')
  })

  it('shows an empty state when a show has no episodes', async () => {
    vi.mocked(tvmazeService.getEpisodes).mockResolvedValue([])
    const wrapper = mount(EpisodeCarousel, { props: { showId: 99 } })
    await flushPromises()
    expect(wrapper.text()).toContain('No episodes available')
  })

  it('shows an error state when the episodes request fails', async () => {
    vi.mocked(tvmazeService.getEpisodes).mockRejectedValue(new Error('API unavailable'))
    const wrapper = mount(EpisodeCarousel, { props: { showId: 99 } })
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toContain('API unavailable')
  })
})
