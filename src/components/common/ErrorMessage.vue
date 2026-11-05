
<script setup lang="ts">
defineProps<{
  message: string
}>()

const emit = defineEmits<{
  (event: 'retry'): void
}>()
</script>

<template>
  <div class="error-state" role="alert">
    <strong>Something went wrong</strong>

    <p>{{ message }}</p>

    <button
      class="button button-secondary"
      @click="emit('retry')"
    >
      Try again
    </button>
  </div>
</template>
