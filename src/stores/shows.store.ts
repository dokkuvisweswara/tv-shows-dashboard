import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { tvmazeService } from "../services/tvmaze.service";
import { groupShowsByGenre } from "../utils/show.utils";
import type { CastMember, Show } from "../types/show.types";
export const useShowsStore = defineStore("shows", () => {
  const shows = ref<Show[]>([]);
  const selectedShow = ref<Show | null>(null);
  const cast = ref<CastMember[]>([]);
  const loading = ref(false);
  const detailLoading = ref(false);
  const error = ref("");
  const detailError = ref("");
  const searchResults = ref<Show[]>([]);
  const searchLoading = ref(false);
  const genres = computed(() => groupShowsByGenre(shows.value));
  async function fetchShows() {
    if (shows.value.length) return;
    loading.value = true;
    error.value = "";
    try {
      shows.value = await tvmazeService.getShows(0);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Unable to load shows.";
    } finally {
      loading.value = false;
    }
  }
  async function fetchShow(id: number) {
    detailLoading.value = true;
    detailError.value = "";
    selectedShow.value = null;
    cast.value = [];
    try {
      const [show, people] = await Promise.all([
        tvmazeService.getShow(id),
        tvmazeService.getCast(id),
      ]);
      selectedShow.value = show;
      cast.value = people;
    } catch (e) {
      detailError.value =
        e instanceof Error ? e.message : "Unable to load show details.";
    } finally {
      detailLoading.value = false;
    }
  }
  async function search(query: string) {
    if (!query.trim()) {
      searchResults.value = [];
      return;
    }
    searchLoading.value = true;
    try {
      searchResults.value = (await tvmazeService.searchShows(query)).map(
        (item) => item.show,
      );
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Search failed.";
      searchResults.value = [];
    } finally {
      searchLoading.value = false;
    }
  }
  return {
    shows,
    selectedShow,
    cast,
    loading,
    detailLoading,
    error,
    detailError,
    searchResults,
    searchLoading,
    genres,
    fetchShows,
    fetchShow,
    search,
  };
});
