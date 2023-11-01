<script lang="ts">
  import Popover from '../popover/Popover.svelte'

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
</script>

<Popover type="info" {placement} bind:show>
  <div 
  on:mouseenter={() => (show = !!text && true)} 
  on:mouseleave={() => (show = false)}
  >
    <slot />
  </div>
  <div slot="content">
    {#if headerText}<div class="header-text">{headerText}</div>{/if}
    {#if text}<span class="text">{text}</span>{/if}
  </div>
</Popover>

<style>
  .header-text {
    text-transform: capitalize;
    color: var(--color-light);
    margin-bottom: var(--spacing-md);
    font-weight: var(--font-weight-bold-1);
    text-align: center;
  }

  .text {
    font-size: var(--text-sm);
    color: var(--color-grey-2);
    font-weight: var(--font-weight-bold-1);
  }
</style>
