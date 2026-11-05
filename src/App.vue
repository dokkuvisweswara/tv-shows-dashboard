
<template>
  <div class="app-shell">
    <AppHeader />

    <RouterView />

    <footer class="footer">
      <RouterLink to="/" class="brand footer-brand">
        <span class="brand-mark">F</span>
        frame<span class="brand-dot">.</span>
      </RouterLink>

      <span>Made for the love of good stories.</span>
      <span>DATA BY TVMAZE</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/common/AppHeader.vue'
</script>
