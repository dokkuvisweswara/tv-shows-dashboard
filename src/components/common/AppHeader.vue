<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
function openSearch() { router.push({ name: 'search' }) }
</script>
<template>
  <header class="topbar">
    <RouterLink class="brand" to="/" aria-label="Frame home"><span class="brand-mark">F</span> frame<span class="brand-dot">.</span></RouterLink>
    <nav aria-label="Main navigation"><RouterLink to="/" class="nav-link">Discover</RouterLink></nav>
    <button type="button" class="header-search-trigger" aria-label="Open TV show search" @click="openSearch"><span aria-hidden="true">⌕</span><span class="header-search-label">Search shows</span></button>
  </header>
</template>
