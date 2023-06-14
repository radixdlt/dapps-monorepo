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

<style lang="scss">
  @use '../../../../../../packages/ui/src/mixins.scss';

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
</style>
