<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Show } from '../../types/show.types'

const props = defineProps<{ shows: Show[]; intervalMs?: number }>()
const activeIndex = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const featuredShows = computed(() => props.shows.slice(0, 4))
const activeShow = computed(() => featuredShows.value[activeIndex.value])
const backgroundImage = computed(() => activeShow.value?.image?.original ?? activeShow.value?.image?.medium ?? '')
const summary = computed(() => (activeShow.value?.summary ?? 'Discover the story, explore the episodes and find your next favourite show.')
  .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())

function stopAutoplay() {
  if (timer) clearInterval(timer)
  timer = undefined
}

function startAutoplay() {
  stopAutoplay()
  if (featuredShows.value.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % featuredShows.value.length
  }, props.intervalMs ?? 5000)
}

function selectSlide(index: number) {
  activeIndex.value = index
  startAutoplay()
}

function previousSlide() {
  activeIndex.value = (activeIndex.value - 1 + featuredShows.value.length) % featuredShows.value.length
  startAutoplay()
}

function nextSlide() {
  activeIndex.value = (activeIndex.value + 1) % featuredShows.value.length
  startAutoplay()
}

watch(featuredShows, (shows) => {
  if (activeIndex.value >= shows.length) activeIndex.value = 0
  startAutoplay()
})

onMounted(startAutoplay)
onUnmounted(stopAutoplay)
</script>

<template>
  <section v-if="activeShow" class="featured-hero" aria-label="Featured TV shows"
    @mouseenter="stopAutoplay" @mouseleave="startAutoplay"
    @focusin="stopAutoplay" @focusout="startAutoplay">
    <Transition name="hero-fade" mode="out-in">
      <div :key="activeShow.id" class="featured-hero-background"
        :style="backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : undefined" aria-hidden="true" />
    </Transition>
    <div class="featured-hero-overlay" />
    <div class="featured-hero-content" :key="`content-${activeShow.id}`">
      <h1>{{ activeShow.name }}</h1>
      <div class="featured-hero-meta">
        <span class="hero-rating">★ {{ activeShow.rating.average?.toFixed(1) ?? 'N/A' }}</span>
        <span v-for="genre in activeShow.genres.slice(0, 3)" :key="genre">{{ genre }}</span>
        <span v-if="activeShow.premiered">{{ activeShow.premiered.slice(0, 4) }}</span>
      </div>
      <p>{{ summary }}</p>
      <RouterLink :to="`/shows/${activeShow.id}`" class="button button-primary">View details <span aria-hidden="true">↗</span></RouterLink>
    </div>
    <div class="featured-hero-controls" aria-label="Choose featured show">
      <div class="hero-arrow-controls">
        <button type="button" class="hero-arrow" aria-label="Previous featured show" @click="previousSlide">‹</button>
        <button type="button" class="hero-arrow" aria-label="Next featured show" @click="nextSlide">›</button>
      </div>
      <span class="hero-control-label">{{ String(activeIndex + 1).padStart(2, '0') }} <span>/</span> {{ String(featuredShows.length).padStart(2, '0') }}</span>
      <div class="hero-dots" role="group" aria-label="Featured slides">
        <button v-for="(show, index) in featuredShows" :key="show.id" type="button" class="hero-dot"
          :class="{ active: activeIndex === index }" :aria-label="`Show ${index + 1}: ${show.name}`"
          :aria-pressed="activeIndex === index" @click="selectSlide(index)" />
      </div>
    </div>
  </section>
</template>
