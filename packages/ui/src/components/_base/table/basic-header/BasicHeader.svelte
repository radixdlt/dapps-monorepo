<script lang="ts">
  import SortIcon from './SortIcon.svelte'

  export let sorting: 'ascending' | 'descending' | 'unsorted' | undefined =
    undefined
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="flex-align-center" class:sortable={sorting} on:click>
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

  .flex-align-center {
    display: inline-flex;
    align-items: center;
  }

  .text {
    white-space: nowrap;
    color: var(--color-grey-2);
    font-weight: var(--font-weight-bold-2);
    text-transform: uppercase;
  }
</style>
