<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { tvmazeService } from '../../services/tvmaze.service'
import type { Episode } from '../../types/episode.types'
import { cleanSummary } from '../../utils/show.utils'

const props = defineProps<{ showId: number }>()
const episodes = ref<Episode[]>([])
const loading = ref(false)
const error = ref('')
const selectedSeason = ref(1)
const rail = ref<HTMLElement | null>(null)
let controller: AbortController | undefined

const seasons = computed(() => [...new Set(episodes.value.map((episode) => episode.season))].sort((a, b) => a - b))
const visibleEpisodes = computed(() => episodes.value.filter((episode) => episode.season === selectedSeason.value))

function scrollRail(direction: -1 | 1) {
  rail.value?.scrollBy({ left: direction * Math.max(rail.value.clientWidth * 0.8, 280), behavior: 'smooth' })
}
function formatDate(value: string | null) {
  if (!value) return 'Air date unavailable'
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

watch(() => props.showId, async (id) => {
  controller?.abort()
  controller = new AbortController()
  const requestController = controller
  loading.value = true
  error.value = ''
  episodes.value = []
  try {
    const data = await tvmazeService.getEpisodes(id, requestController.signal)
    episodes.value = data.slice().sort((a, b) => a.season - b.season || (a.number ?? 0) - (b.number ?? 0))
    selectedSeason.value = seasons.value[0] ?? 1
  } catch (cause) {
    if (cause instanceof Error && cause.name === 'AbortError') return
    error.value = cause instanceof Error ? cause.message : 'Unable to load episodes.'
  } finally {
    if (!requestController.signal.aborted) loading.value = false
  }
}, { immediate: true })
onUnmounted(() => controller?.abort())
</script>

<template>
  <section class="episodes-section" aria-labelledby="episodes-title">
    <div class="section-heading episode-heading">
      <div><span class="eyebrow">THE COMPLETE GUIDE</span><h2 id="episodes-title">Episodes <span class="count">{{ episodes.length }}</span></h2></div>
      <div v-if="seasons.length" class="episode-heading-actions">
        <label class="sr-only" for="season-select">Choose season</label>
        <select id="season-select" v-model.number="selectedSeason" class="season-select">
          <option v-for="season in seasons" :key="season" :value="season">Season {{ season === 0 ? 'Specials' : season }}</option>
        </select>
        <div class="rail-arrows">
          <button type="button" aria-label="Scroll episodes left" @click="scrollRail(-1)">‹</button>
          <button type="button" aria-label="Scroll episodes right" @click="scrollRail(1)">›</button>
        </div>
      </div>
    </div>
    <div v-if="loading" class="loading-state" aria-live="polite"><span class="spinner"/><span>Loading episodes…</span></div>
    <div v-else-if="error" class="error-state" role="alert"><strong>Episodes unavailable</strong><p>{{ error }}</p></div>
    <div v-else-if="!episodes.length" class="empty-state"><h3>No episodes available</h3><p>TVMaze has not listed episodes for this show yet.</p></div>
    <div v-else ref="rail" class="episode-rail" aria-label="Episodes in selected season">
      <article v-for="episode in visibleEpisodes" :key="episode.id" class="episode-card">
        <div class="episode-image-wrap">
          <img v-if="episode.image?.medium" :src="episode.image.medium" :alt="`${episode.name} episode still`" loading="lazy" />
          <div v-else class="episode-image-placeholder"><span>F.</span></div>
          <span class="episode-number">S{{ String(episode.season).padStart(2, '0') }} · E{{ episode.number == null ? '—' : String(episode.number).padStart(2, '0') }}</span>
        </div>
        <div class="episode-card-copy">
          <h3>{{ episode.name }}</h3>
          <p class="episode-meta">{{ formatDate(episode.airdate) }}<span v-if="episode.runtime"> · {{ episode.runtime }} min</span></p>
          <p v-if="episode.summary" class="episode-summary">{{ cleanSummary(episode.summary) }}</p>
          <p v-else class="episode-summary episode-no-summary">Episode description unavailable.</p>
        </div>
      </article>
    </div>
    <p class="tvmaze-credit">Episode information provided by <a href="https://www.tvmaze.com/" target="_blank" rel="noopener noreferrer">TVmaze</a>.</p>
  </section>
</template>
