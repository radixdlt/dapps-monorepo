<script>
  import IconNew from '../icon/IconNew.svelte'
  import CloseIcon from '@icons/cross-2.svg'
</script>

<button class="close" on:click>
  <IconNew icon={CloseIcon} size="small" />
  <div>Close</div>
</button>

<style lang="scss">
  .close {
    justify-self: start;

    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-weight: var(--font-weight-bold-2);

    :nth-child(2) {
      color: var(--color-radix-blue-2);
    }
  }
</style>
