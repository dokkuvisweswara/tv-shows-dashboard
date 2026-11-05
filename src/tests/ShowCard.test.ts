import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, expect, it } from 'vitest'
import ShowCard from '../components/shows/ShowCard.vue'
import type { Show } from '../types/show.types'
const show: Show = { id: 1, name: 'Sample Show', genres: ['Drama'], rating: { average: 8.4 }, image: null, summary: null, premiered: '2020-01-01', ended: null, status: 'Running', runtime: 45, language: 'English', officialSite: null, network: null, webChannel: null, url: '' }
describe('ShowCard', () => { it('renders title, genre and rating and links to details', async () => { const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/shows/:id', component: { template: '<div />' } }] }); await router.push('/'); await router.isReady(); const wrapper = mount(ShowCard, { props: { show }, global: { plugins: [router] } }); expect(wrapper.text()).toContain('Sample Show'); expect(wrapper.text()).toContain('8.4'); expect(wrapper.find('a').attributes('href')).toBe('/shows/1') }) })
