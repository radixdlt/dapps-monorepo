<script lang="ts">
  import { css } from '@styles'
  import { createPopperActions } from 'svelte-popperjs'
  import { fade } from 'svelte/transition'

  type PlacementVariation = 'end' | 'start'

  export let type: 'info' | 'error' | 'success' = 'info'
  export let show: boolean = false
  export let placement:
    | 'right'
    | `right-${PlacementVariation}`
    | 'left'
    | `left-${PlacementVariation}`
    | 'top'
    | `top-${PlacementVariation}`
    | 'bottom'
    | `bottom-${PlacementVariation}`
  export let margin: number = 10

  $: [popperRef, popperContent] = createPopperActions({
    placement,
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [0, margin] } }]
  })

  $: contentStyle = css({
    backgroundColor: {
      info: '$background',
      error: '$error',
      success: '$transparent'
    }[type],
    color: {
      info: '$text',
      error: 'white',
      success: '$success'
    }[type],
    borderRadius: '$sm',
    boxShadow: '$sm',
    padding: '$xs',
    zIndex: 100,
    fontSize: '$sm'
  })()
</script>

<div use:popperRef>
  <slot />
</div>

{#if show}
  <div
    use:popperContent
    transition:fade={{ duration: 100 }}
    class={contentStyle}
  >
    <slot name="content" />
  </div>
{/if}
