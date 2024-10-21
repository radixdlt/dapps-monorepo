<script lang="ts">
  import Pill from '@components/_base/pills-menu/Pill.svelte'

  export let title: string
  export let description: string
  export let appliedFilters: string[] = []
</script>

<div class="card">
  <div class="text">
    <div class="title">
      {title}
    </div>
    <div class="description">
      {description}
    </div>
    <slot />

    <div class="pills">
      {#each appliedFilters as filter}
        <Pill disabled={Promise.resolve(true)}>{filter}</Pill>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .card {
    border-radius: var(--border-radius-lg);
    border: var(--border) var(--theme-border);
    width: 100%;
    padding: var(--spacing-xl);
    box-shadow: var(--shadow);
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);

    .title {
      font-size: var(--text-lg);
      font-weight: var(--font-weight-bold-3);
    }

    .description {
      font-size: var(--text-md);
      font-weight: var(--font-weight-bold-1);
      color: var(--theme-subtext);
    }
  }

  .pills {
    margin-top: var(--spacing-xl);
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;

    :global(.pill) {
      background: var(--theme-surface-3);
    }
  }
</style>
