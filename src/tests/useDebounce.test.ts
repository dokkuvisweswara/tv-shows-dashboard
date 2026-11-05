import { defineComponent, h, nextTick, ref, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from '../composables/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('updates only after the source remains unchanged for the delay', async () => {
    let source!: Ref<string>
    let debounced!: Ref<string>
    const wrapper = mount(defineComponent({ setup() { source = ref(''); debounced = useDebounce(source, 300); return () => h('div', debounced.value) } }))
    source.value = 'g'; await nextTick(); vi.advanceTimersByTime(200)
    source.value = 'gi'; await nextTick(); vi.advanceTimersByTime(299)
    expect(debounced.value).toBe('')
    vi.advanceTimersByTime(1)
    expect(debounced.value).toBe('gi')
    wrapper.unmount()
  })

  it('cleans up the pending timer when its owner unmounts', async () => {
    const callback = vi.fn()
    const wrapper = mount(defineComponent({ setup() { const source = ref(''); const debounced = useDebounce(source, 100); return () => { callback(debounced.value); return h('div') } } }))
    wrapper.unmount()
    vi.advanceTimersByTime(200)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
