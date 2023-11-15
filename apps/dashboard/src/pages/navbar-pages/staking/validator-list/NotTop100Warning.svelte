<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import { PERCENTAGE_TOTAL_STAKE_WARNING } from '@constants'
  import WarningIcon from '@icons/warning.svg'
  import WarningPanel from '../WarningPanel.svelte'
</script>

<WarningPanel>
  <div class="warning-text">
    <IconNew icon={WarningIcon} />
    <span class="bold"> Not within top 100 </span>
    <div>
      <span>Stakes do not get APY this epoch</span>
    </div>
  </div>
</WarningPanel>

<div class="top-percent-warning full-width">
  <div />
</div>

<style lang="scss">
  .warning-text {
    * {
      color: var(--color-alert-1);
    }
    display: flex;
    gap: var(--spacing-lg);
  }
</style>
