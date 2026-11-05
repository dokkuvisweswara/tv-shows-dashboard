import { describe, expect, it } from 'vitest'
import { cleanSummary, groupShowsByGenre, sortByRating } from '../utils/show.utils'
import type { Show } from '../types/show.types'
const makeShow = (id: number, name: string, rating: number | null, genres: string[]): Show => ({ id, name, rating: { average: rating }, genres, image: null, summary: null, premiered: null, ended: null, status: 'Ended', runtime: null, language: null, officialSite: null, network: null, webChannel: null, url: '' })
describe('show utilities', () => {
  it('sorts shows by rating without mutating the source', () => { const input = [makeShow(1, 'A', 7, []), makeShow(2, 'B', 9, [])]; expect(sortByRating(input).map(s => s.name)).toEqual(['B', 'A']); expect(input[0].name).toBe('A') })
  it('puts unrated shows last and uses name as a tie-breaker', () => { expect(sortByRating([makeShow(1, 'Zed', null, []), makeShow(2, 'Alpha', 8, []), makeShow(3, 'Beta', 8, [])]).map(s => s.name)).toEqual(['Alpha', 'Beta', 'Zed']) })
  it('groups shows under every genre and sorts each group', () => { const groups = groupShowsByGenre([makeShow(1, 'Drama A', 7, ['Drama', 'Comedy']), makeShow(2, 'Drama B', 9, ['Drama'])]); expect(groups.Drama.map(s => s.name)).toEqual(['Drama B', 'Drama A']); expect(groups.Comedy).toHaveLength(1) })
  it('strips HTML from summaries', () => { expect(cleanSummary('<p>Hello <b>world</b></p>')).toBe('Hello world') })
})
