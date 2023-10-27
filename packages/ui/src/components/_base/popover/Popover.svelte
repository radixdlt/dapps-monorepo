<script lang="ts">
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

  $: [popperRef, popperContent] = createPopperActions({
    placement,
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [0, 10] } },
      { name: 'preventOverflow', options: { padding: 20 } },
      { name: 'flip', options: { padding: 20 } }
    ]
  })
</script>

<div use:popperRef>
  <slot />
</div>

{#if show}
  <div
    use:popperContent
    transition:fade={{ duration: 100 }}
    class="popover card"
    data-popper-placement={placement}
    style:background={type === 'success'
      ? 'var(--theme-success-primary)'
      : type === 'error'
      ? 'var(--theme-error-primary)'
      : 'var(--color-alert)'}
  >
    <slot name="content" />
    <div class="arrow" data-popper-arrow />
  </div>
{/if}

<style>
  .popover {
    color: var(--color-light);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    margin-right: 100px;
  }

  .arrow,
  .arrow::before {
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
  }

  .arrow {
    visibility: hidden;
  }

  .arrow::before {
    visibility: visible;
    content: '';
    transform: rotate(45deg);
  }

  .popover[data-popper-placement^='top'] > .arrow {
    bottom: -4px;
  }

  .popover[data-popper-placement^='bottom'] > .arrow {
    top: -4px;
  }

  .popover[data-popper-placement^='left'] > .arrow {
    right: -4px;
  }

  .popover[data-popper-placement^='right'] > .arrow {
    left: -4px;
  }
</style>
