<script>
  export let active = false
</script>

<button class="pill" class:active on:click><slot /></button>

<style lang="scss">
  .pill {
    &:hover {
      background: var(--theme-surface-3);
    }
    &.active {
      background: var(--theme-text-primary);
      color: var(--theme-text-secondary);
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
