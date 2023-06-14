<div id="card">
  <slot />
</div>

<style>
  #card {
    box-shadow: var(--shadow);
    border-radius: var(--border-radius-lg);
    background: var(--background, var(--surface));
    border: var(--border);
    padding: var(--padding, var(--spacing-2xl));
  }
</style>
