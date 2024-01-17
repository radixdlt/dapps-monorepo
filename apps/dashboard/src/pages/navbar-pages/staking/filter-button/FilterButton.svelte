<script>
  import IconNew from '@svelte-ui/components/_base/icon/IconNew.svelte'
  import FilterList from '@icons/filter-list.svg'
</script>

<button id="filter-btn" on:click>
  <IconNew icon={FilterList} size="medium" --size="24px" />
  <div id="text">Filter</div>
</button>

<style lang="scss">
  #filter-btn {
    background-color: var(--theme-surface-2);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-sm) var(--spacing-2xl);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
    box-shadow: var(--shadow);
  }

  #text {
    font-weight: var(--font-weight-bold-3);
  }
</style>
