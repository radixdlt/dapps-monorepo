<script lang="ts">
  import SortIcon from './SortIcon.svelte'

  export let sorting: 'ascending' | 'descending' | 'unsorted' | undefined =
    undefined

  export let alignment: 'left' | 'right' | 'center' = 'left'
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="header"
  class:sortable={sorting}
  style:text-align={alignment}
  on:click
>
  <span class="text"><slot /></span>

  {#if sorting}
    <SortIcon mode={sorting || 'unsorted'} />
  {/if}
</div>

<style>
  .sortable {
    cursor: pointer;
    gap: var(--spacing-xs);
  }

  .header {
    display: inline-flex;
    align-items: center;
    padding: 0 var(--table-row-cell-horizontal-padding, 10px);
  }

  .text {
    color: var(--color-grey-2);
    font-weight: var(--font-weight-bold-2);
    text-transform: uppercase;
    text-align: center;
  }
</style>
