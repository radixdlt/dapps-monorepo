<script lang="ts">
  export let name: string
</script>

<div class="access-rule">
  <div class="header">
    <h4 class="name">
      {name}
    </h4>
  </div>

  <slot name="content" />
</div>

<style>
  .access-rule {
    width: 100%;
    padding: var(--spacing-xl);
    border-radius: var(--border-radius-lg);
    background: var(--theme-surface-2);
    border: var(--border) var(--theme-border);
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: var(--spacing-md);
  }

  .name {
    text-transform: uppercase;
    color: var(--color-grey-2);
    font-weight: var(--font-weight-bold-1);
    font-size: var(--text-md);
  }
</style>
