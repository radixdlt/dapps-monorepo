<div class="warning-panel full-width">
  <slot />
</div>

<style lang="scss">
  .warning-panel {
    border: var(--border) var(--color-alert-2);
    padding: var(--spacing-lg) var(--spacing-2xl);
    border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
    background: #fffcf5;
    border-top: none;
  }
</style>
