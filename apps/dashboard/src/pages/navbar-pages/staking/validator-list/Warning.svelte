<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import WarningIcon from '@icons/warning.svg'
  import WarningPanel from '../WarningPanel.svelte'
</script>

<WarningPanel>
  <div class="warning-text">
    <IconNew icon={WarningIcon} />
    <slot />
  </div>
</WarningPanel>

<div class="top-percent-warning full-width">
  <div />
</div>

<style lang="scss">
  .warning-text {
    color: var(--color-alert-1);
    display: flex;
    gap: var(--spacing-lg);
  }

  .bold {
    font-weight: var(--font-weight-bold-2);
  }
</style>
