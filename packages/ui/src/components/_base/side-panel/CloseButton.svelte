<script>
  import IconNew from '../icon/IconNew.svelte'
</script>

<button id="close" on:click>
  <IconNew type="close" size="small" />
  <div>Close</div>
</button>

<style lang="scss">
  #close {
    justify-self: start;

    display: flex;
    align-items: center;
    gap: var(--spacing-sm);

    :nth-child(2) {
      color: var(--color-radix-blue-2);
    }
  }
</style>
