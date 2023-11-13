<script lang="ts">
  export let selected = false
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click class:selected><slot /></div>

<style lang="scss">
  div {
    padding: 0.625rem 0.8rem;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:hover {
      background: var(--theme-surface-1);
    }
  }
  .selected {
    font-weight: 500;
    background: var(--theme-surface-1);
  }
</style>
