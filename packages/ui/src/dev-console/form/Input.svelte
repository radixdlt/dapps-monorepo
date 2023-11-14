<script lang="ts">
  export let disabled = false
  export let placeholder = ''
  export let error = false
  export let value = ''
</script>

<input {placeholder} class:disabled class:error on:input bind:value />

<style lang="scss">
  input {
    border: 1px solid var(--theme-border);
    background: var(--theme-surface-2);
    padding: 0.6rem 1rem;
    border-radius: 0.5rem;
    width: 100%;
    line-height: 1.5rem;
    &.disabled {
      user-select: none;
    }
    &.error {
      border-color: red;
    }
  }
</style>
