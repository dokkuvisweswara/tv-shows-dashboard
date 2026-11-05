export interface ImageSet { medium: string; original: string }
export interface Rating { average: number | null }
export interface Network { name: string }
export interface Show {
  id: number; name: string; genres: string[]; rating: Rating; image: ImageSet | null;
  summary: string | null; premiered: string | null; ended: string | null; status: string;
  runtime: number | null; language: string | null; officialSite: string | null;
  network: Network | null; webChannel: Network | null; url: string;
}
export interface SearchResult { score: number; show: Show }
export interface CastMember { person: { id: number; name: string; image: ImageSet | null }; character: { name: string } }
