<script lang="ts">
  import { createPopperActions } from 'svelte-popperjs'
  import { fade } from 'svelte/transition'

  export let placement:
    | 'right'
    | `right-${PlacementVariation}`
    | 'left'
    | `left-${PlacementVariation}`
    | 'top'
    | `top-${PlacementVariation}`
    | 'bottom'
    | `bottom-${PlacementVariation}` = 'top'

  type PlacementVariation = 'end' | 'start'
  export let text: string | undefined
  export let headerText: string | undefined = undefined

  let show = false

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

<div
  use:popperRef
  on:mouseenter={() => (show = !!text && true)}
  on:mouseleave={() => (show = !!text && false)}
>
  <slot />
</div>

{#if show}
  <div
    use:popperContent
    transition:fade={{ duration: 100 }}
    class="popover card"
    data-popper-placement={placement}
  >
    {#if headerText}<div class="header-text">{headerText}</div>{/if}
    {#if text}<span class="text">{text}</span>{/if}
    <div class="arrow" data-popper-arrow />
  </div>
{/if}

<style>
  .popover {
    text-align: center;
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--color-grey-1);
    margin-right: 100px;
    border: none;
  }

  .header-text {
    text-transform: capitalize;
    color: var(--color-light);
    margin-bottom: var(--spacing-md);
  }

  .text {
    font-size: var(--font-size-sm);
    color: var(--color-grey-2);
    font-weight: var(--font-weight-bold-1);
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
