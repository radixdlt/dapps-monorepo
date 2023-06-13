<script>
  import IconNew from '@components/_base/icon/IconNew.svelte'
</script>

<button id="filter-btn" on:click>
  <IconNew type="filterList" size="medium" --size="24px" />
  <div id="text">Filter</div>
</button>

<style lang="scss">
  #filter-btn {
    background-color: var(--color-light);
    border: var(--border-strong);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-sm);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
  }

  #text {
    font-weight: var(--font-weight-bold-3);
  }
</style>
