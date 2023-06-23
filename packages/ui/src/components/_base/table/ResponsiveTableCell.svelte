<script lang="ts">
  export let label: string = ''
  export let width: string = 'auto'
</script>

<td class="cell" style="--responsive-table-cell-width: {width}">
  {#if label}
    <div class="mobile-only header-text">
      {label}
    </div>
  {/if}
  <slot />
</td>

<style lang="scss">
  @use '../../../mixins.scss';

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
