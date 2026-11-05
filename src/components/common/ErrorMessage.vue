<script setup lang="ts">defineProps<{ message: string }>(); defineEmits<{ retry: [] }>()</script>
<template><div class="error-state" role="alert"><strong>Something went wrong</strong><p>{{ message }}</p><button class="button button-secondary" @click="$emit('retry')">Try again</button></div></template>
