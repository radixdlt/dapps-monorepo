<script lang="ts">
  import { createPopperActions } from 'svelte-popperjs'
  import { fade } from 'svelte/transition'

  type PlacementVariation = 'end' | 'start'

  export let type: 'warn' | 'error' | 'success' | 'info' = 'warn'
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

<div class="wrapper" use:popperRef>
  <slot />
</div>

{#if show}
  <div
    use:popperContent
    transition:fade|global={{ duration: 100 }}
    class="popover card {type}"
    data-popper-placement={placement}
  >
    <slot name="content" />
    <div class="arrow" data-popper-arrow />
  </div>
{/if}

<style lang="scss">
  .wrapper {
    display: block;
  }
  .popover {
    color: var(--color-light);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    margin-right: 100px;

    &.success {
      background: var(--theme-success-primary);
    }

    &.error {
      background: var(--theme-error-primary);
    }

    &.warn {
      background: var(--color-alert-1);
    }

    &.info {
      border: none;
      padding: var(--spacing-md) var(--spacing-lg);
      background: var(--color-grey-1);
      border-radius: var(--border-radius-lg);
    }
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
