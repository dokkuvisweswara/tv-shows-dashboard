<script setup lang="ts">
import { ref } from 'vue'
import type { Show } from '../../types/show.types'
import ShowCard from './ShowCard.vue'

defineProps<{ genre: string; shows: Show[] }>()
const rail = ref<HTMLElement | null>(null)

function scrollRail(direction: -1 | 1) {
  if (!rail.value) return
  rail.value.scrollBy({ left: direction * Math.max(rail.value.clientWidth * 0.8, 300), behavior: 'smooth' })
}
</script>

<template>
  <section class="genre-section" :aria-label="`${genre} shows`">
    <div class="section-heading">
      <div>
        <h2>{{ genre }}</h2>
      </div>
      <div class="genre-heading-actions">
        <!-- <span class="section-hint">Top rated first <span>↗</span></span> -->
        <div class="rail-arrows" :aria-label="`${genre} carousel controls`">
          <button type="button" aria-label="Scroll shows left" @click="scrollRail(-1)">‹</button>
          <button type="button" aria-label="Scroll shows right" @click="scrollRail(1)">›</button>
        </div>
      </div>
    </div>
    <div ref="rail" class="show-rail">
      <ShowCard v-for="show in shows.slice(0, 18)" :key="show.id" :show="show" />
    </div>
  </section>
</template>
