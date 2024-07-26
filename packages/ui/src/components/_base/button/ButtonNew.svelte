<script lang="ts">
  export let size: 'small' | 'big' | 'xl' = 'big'
  export let secondary = false
  export let disabled = false
</script>

<button
  on:click
  class:small={size === 'small'}
  class:big={size === 'big'}
  class:xl={size === 'xl'}
  class:secondary
  class:disabled
>
  <slot />
</button>

<style lang="scss">
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

    &.secondary {
      color: var(--color-grey-1);
      background: var(--color-grey-4);

      &:hover {
        background: var(--color-grey-3);
      }

      &:active {
        background: var(--color-grey-2);
      }
    }

    &:hover {
      background: var(--color-radix-blue-1);
    }

    &:active {
      background: var(--color-grey-1);
    }
  }

  .small {
    height: 1.5rem;
    padding: 0 var(--spacing-lg);
  }

  .big {
    height: 2rem;
    font-weight: var(--font-weight-bold-2);
    padding: 0 var(--spacing-2xl);
  }

  .xl {
    height: 2.5rem;
  }
</style>
