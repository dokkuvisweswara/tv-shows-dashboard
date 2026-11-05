<script setup lang="ts">
import type { Show } from '../../types/show.types'
import { cleanSummary, ratingValue } from '../../utils/show.utils'
defineProps<{ show: Show; featured?: boolean }>()
</script>
<template><RouterLink :to="`/shows/${show.id}`" class="show-card" :class="{ featured }" :aria-label="`${show.name}, rating ${ratingValue(show) || 'not rated'}`">
  <div class="poster-wrap"><img v-if="show.image?.medium" :src="show.image.medium" :alt="`${show.name} poster`" loading="lazy" /><div v-else class="poster-placeholder">{{ show.name.slice(0, 1) }}</div><span class="rating"><span>★</span> {{ ratingValue(show) ? ratingValue(show).toFixed(1) : 'NR' }}</span><span class="card-open" aria-hidden="true">↗</span></div>
  <div class="card-copy"><h3>{{ show.name }}</h3><p>{{ show.premiered?.slice(0, 4) || 'Year unknown' }} <span>·</span> {{ show.genres?.[0] || 'TV' }}</p></div>
</RouterLink></template>
