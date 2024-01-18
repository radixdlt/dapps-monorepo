<script lang="ts">
  export let disabled = false
</script>

<div class:disabled><slot /></div>

<style lang="scss">
  div {
    font-weight: 500;
    margin-bottom: 0.75rem;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
