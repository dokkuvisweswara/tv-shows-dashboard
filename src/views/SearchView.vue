<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { tvmazeService } from "../services/tvmaze.service";
import type { Show } from "../types/show.types";
import { useDebounce } from "../composables/useDebounce";
import ShowCard from "../components/shows/ShowCard.vue";
import LoadingSpinner from "../components/common/LoadingSpinner.vue";

const route = useRoute();
const router = useRouter();
const query = ref(String(route.query.q ?? ""));
const debouncedQuery = useDebounce(query, 350);
const results = ref<Show[]>([]);
const loading = ref(false);
const error = ref("");
let controller: AbortController | undefined;
const normalizedQuery = computed(() => debouncedQuery.value.trim());

watch(
  () => route.query.q,
  (value) => {
    const next = String(value ?? "");
    if (next !== query.value) query.value = next;
  },
);

watch(
  normalizedQuery,
  async (term) => {
    controller?.abort();
    const requestController = new AbortController();
    controller = requestController;
    error.value = "";
    if (!term) {
      results.value = [];
      loading.value = false;
      return;
    }
    loading.value = true;
    try {
      const response = await tvmazeService.searchShows(
        term,
        requestController.signal,
      );
      if (!requestController.signal.aborted)
        results.value = response.map((item) => item.show);
    } catch (cause) {
      if (cause instanceof Error && cause.name === "AbortError") return;
      if (!requestController.signal.aborted) {
        error.value =
          cause instanceof Error
            ? cause.message
            : "Search failed. Please try again.";
        results.value = [];
      }
    } finally {
      if (!requestController.signal.aborted) loading.value = false;
    }
  },
  { immediate: true },
);

watch(query, (value) => {
  const q = value.trim();
  router.replace({ name: "search", query: q ? { q } : {} });
});

function clearSearch() {
  query.value = "";
}
onUnmounted(() => controller?.abort());
</script>

<template>
  <main class="page-shell search-page">
    <!-- <span class="eyebrow">THE FRAME FINDER</span> -->
    <h1>Search <em>stories.</em></h1>
    <form class="large-search" role="search" @submit.prevent>
      <span aria-hidden="true">⌕</span>
      <label class="sr-only" for="show-search-input"
        >Search TV shows by name</label
      >
      <input
        id="show-search-input"
        v-model="query"
        autofocus
        placeholder="Try a title, e.g. Girls"
        autocomplete="off"
      />
      <button
        v-if="query"
        type="button"
        class="search-clear"
        aria-label="Clear search"
        @click="clearSearch"
      >
        ×
      </button>
    </form>
    <p class="results-label" v-if="query.trim()">
      RESULTS FOR “{{ query.trim() }}”
    </p>
    <LoadingSpinner v-if="loading" />
    <div v-else-if="error" class="error-state" role="alert">
      <strong>Search couldn't be completed</strong>
      <p>{{ error }}</p>
    </div>
    <div v-else-if="results.length" class="results-grid">
      <ShowCard v-for="show in results" :key="show.id" :show="show" />
    </div>
    <div v-else-if="normalizedQuery" class="empty-state">
      <span>◌</span>
      <h2>No shows found</h2>
      <p>Try another title or check the spelling.</p>
    </div>
    <div v-else class="empty-state">
      <!-- <span>⌕</span> -->
      <h2>What are you in the mood for?</h2>
      <p>Search for a show by its name.</p>
    </div>
  </main>
</template>
