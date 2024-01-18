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

  const handleTooltipClick = (e: Event) => {
    e?.preventDefault()
    e?.stopImmediatePropagation()
  }
</script>

<Popover type="info" {placement} bind:show>
  <div
    on:mouseenter={() => (show = !!text && true)}
    on:mouseleave={() => (show = false)}
    class="wrapper"
  >
    <div
      class="wrapper"
      on:click={handleTooltipClick}
      on:keypress={handleTooltipClick}
    >
      <slot />
    </div>
  </div>
  <div class="content" slot="content">
    {#if headerText}<div class="header-text">{headerText}</div>{/if}
    {#if text?.trim()}<span class="text">{text}</span>{/if}
  </div>
</Popover>

<style lang="scss">
  .wrapper {
    display: contents;
  }

  .content {
    max-width: 500px;
  }
  .header-text {
    text-transform: capitalize;
    color: var(--color-light);
    font-weight: var(--font-weight-bold-1);
    text-align: center;

    &:not(:last-child) {
      margin-bottom: var(--spacing-md);
    }
  }

  .text {
    font-size: var(--text-sm);
    color: var(--color-grey-2);
    font-weight: var(--font-weight-bold-1);
  }
</style>
