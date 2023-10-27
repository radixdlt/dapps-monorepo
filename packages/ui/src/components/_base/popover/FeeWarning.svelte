<script lang="ts">
  import IconNew from '../icon/IconNew.svelte'
  import Info from '@icons/info.svg'
</script>

<div class="fee-warning">
  <IconNew icon={Info} size="small" />
  <span
    >Ensure you have sufficient XRD in at least one of your accounts to pay the
    transaction fee.
  </span>
</div>

<style lang="scss">
  .fee-warning {
    color: var(--color-light);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);

    :global(img) {
      filter: brightness(0) invert(1);
    }
  }
</style>
