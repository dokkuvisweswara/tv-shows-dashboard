import type { ImageSet, Rating } from './show.types'

export interface Episode {
  id: number
  name: string
  season: number
  number: number | null
  airdate: string | null
  airtime: string | null
  runtime: number | null
  summary: string | null
  image: ImageSet | null
  rating: Rating
}
