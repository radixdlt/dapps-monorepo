<script lang="ts">
  export let size: 'small' | 'big'
</script>

<button class:small={size === 'small'} class:big={size === 'big'}>
  <slot />
</button>

<style>
  button {
    background: var(--color-radix-blue-2);
    border: none;
    border-radius: var(--border-radius);
    color: var(--color-light);
    cursor: pointer;
    white-space: nowrap;
  }

  .small {
    height: var(--spacing-xl);
    padding: var(--spacing-sm) var(--spacing-lg);
  }

  .big {
    height: var(--spacing-2xl);
    padding: 0 var(--spacing-2xl);
  }
</style>
