<script>
  export let active = false
</script>

<button style={$$props.style} class="pill" class:active on:click
  ><slot /></button
>

<style lang="scss">
  .pill {
    &:hover {
      background: var(--color-grey-4);
    }
    &.active {
      background: var(--color-grey-1);
      color: var(--color-grey-5);
    }
    white-space: nowrap;
    transition: background-color 0.1s ease-in-out;
    border-radius: 50px;
    padding: 0.6rem 1rem;
    font-weight: var(--font-weight-bold-2);
    user-select: none;
  }
</style>
