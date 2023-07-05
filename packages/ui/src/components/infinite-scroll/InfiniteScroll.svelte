<script lang="ts">
  import { onDestroy, createEventDispatcher, onMount } from 'svelte'

  export let threshold = 5

  const dispatch = createEventDispatcher()
  let component: HTMLElement
  let scrollableParent: HTMLElement | null
  let resizeObserver: ResizeObserver

  const onResize = () => {
    assignScrollableParent()
  }

  window.addEventListener('resize', onResize)

  const findParentWithScroll = (
    component: HTMLElement | null
  ): HTMLElement | null => {
    if (component) {
      const element: HTMLElement | null = component.parentElement
      if (
        element &&
        element.clientHeight < element.scrollHeight &&
        getComputedStyle(element).overflowY !== 'hidden'
      ) {
        return element
      }
      return findParentWithScroll(element)
    }
    return null
  }

  const assignScrollableParent = () => {
    scrollableParent = findParentWithScroll(component)
    scrollableParent?.addEventListener('scroll', onScroll)
  }

  onMount(() => {
    assignScrollableParent()
    resizeObserver = new ResizeObserver(() => {
      assignScrollableParent()
    })

    resizeObserver.observe(component.parentElement as HTMLElement)
  })

  const onScroll = (e: any) => {
    const offset =
      e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop

    const adjustedThreshold = threshold < 1 ? 1 : threshold
    if (offset <= adjustedThreshold) {
      dispatch('thresholdReached')
    }
  }

  onDestroy(() => {
    window.removeEventListener('resize', onResize)
    scrollableParent?.removeEventListener('scroll', onScroll)
    resizeObserver.disconnect()
  })
</script>

<div bind:this={component} />
