<script setup lang="ts">
import { onMounted } from "vue";
import { useShowsStore } from "../stores/shows.store";
import LoadingSpinner from "../components/common/LoadingSpinner.vue";
import ErrorMessage from "../components/common/ErrorMessage.vue";
import GenreSection from "../components/shows/GenreSection.vue";
import ShowCard from "../components/shows/ShowCard.vue";
import FeaturedHeroCarousel from "../components/shows/FeaturedHeroCarousel.vue";
import { sortByRating } from "../utils/show.utils";
const store = useShowsStore();
onMounted(() => store.fetchShows());
</script>
<template>
  <main>
    <section v-if="store.loading"><LoadingSpinner /></section>
    <ErrorMessage
      v-else-if="store.error"
      :message="store.error"
      @retry="store.fetchShows()"
    />
    <template v-else-if="store.shows.length">
      <FeaturedHeroCarousel :shows="sortByRating(store.shows).slice(0, 4)" />
      <GenreSection
        v-for="(shows, genre) in store.genres"
        :key="genre"
        :genre="genre"
        :shows="shows"
      />
    </template>
  </main>
</template>
