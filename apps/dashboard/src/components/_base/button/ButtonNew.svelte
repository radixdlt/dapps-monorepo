<script lang="ts">
  export let size: 'small' | 'big'
  export let disabled = false
</script>

<button
  on:click
  class:small={size === 'small'}
  class:big={size === 'big'}
  class:disabled
>
  <slot />
</button>

<style>
  button {
    box-sizing: border-box;
    background: var(--color-radix-blue-2);
    border: none;
    border-radius: var(--border-radius-lg);
    color: var(--color-light);
    cursor: pointer;
    white-space: nowrap;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .small {
    height: var(--spacing-xl);
    padding: var(--spacing-sm) var(--spacing-lg);
  }

  .big {
    height: var(--spacing-2xl);
    padding: 0 var(--spacing-2xl);
  }

  .disabled {
    opacity: 50%;
    pointer-events: none;
  }
</style>
