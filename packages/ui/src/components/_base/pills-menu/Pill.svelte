<script>
  export let active = false
  export let disabled = Promise.resolve(false)
</script>

{#await disabled}
  <button class="pill" class:active on:click><slot /></button>
{:then resolvedDisabled}
  <button class="pill" class:active class:disabled={resolvedDisabled} on:click
    ><slot /></button
  >
{/await}

<style lang="scss">
  .pill {
    background: var(--theme-surface-2);

    &:hover {
      background: var(--theme-surface-3);
    }
    &.active {
      background: var(--theme-text-primary);
      color: var(--theme-text-secondary);
    }
    &.disabled {
      opacity: 0.6;
      filter: grayscale(1);
      pointer-events: none;
    }
    white-space: nowrap;
    transition: background-color 0.1s ease-in-out;
    border-radius: 50px;
    padding: 0.6rem 1rem;
    font-weight: var(--font-weight-bold-2);
    user-select: none;
    margin-right: var(--pill-margin-right);
  }
</style>
