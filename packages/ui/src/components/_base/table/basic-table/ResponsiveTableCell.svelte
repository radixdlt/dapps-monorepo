<script lang="ts">
  export let label: string = ''
  export let width: string = 'auto'
  export let colspan = 1
  export let hideMobile = false
  export let hideDesktop = false
  export let alignment: 'left' | 'right' | 'center' = 'left'
</script>

<td
  class="cell"
  class:desktop-only={hideMobile}
  class:mobile-only={hideDesktop}
  style="--responsive-table-cell-width: {width}"
  {colspan}
>
  {#if label}
    <div class="mobile-only header-text">
      {label}
    </div>
  {/if}

  <div class="content" style:text-align={alignment}>
    <slot />
  </div>
</td>

<style lang="scss">
  .cell {
    width: var(--responsive-table-cell-width);

    @include mixins.mobile {
      width: 100%;
    }
  }

  .header-text {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: var(--color-grey-2);
    font-weight: var(--font-weight-bold-1);
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
</style>
