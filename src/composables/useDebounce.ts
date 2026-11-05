import { onUnmounted, ref, watch, type Ref } from 'vue'

/** Returns a ref that updates only after the source has stayed unchanged for `delay` ms. */
export function useDebounce<T>(source: Ref<T>, delay = 350) {
  const debounced = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | undefined
  watch(source, (value) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { debounced.value = value }, delay)
  })
  onUnmounted(() => { if (timer) clearTimeout(timer) })
  return debounced
}
