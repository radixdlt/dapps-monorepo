<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import { PERCENTAGE_TOTAL_STAKE_WARNING } from '@constants'
  import WarningIcon from '@icons/warning.svg'
  import WarningPanel from './WarningPanel.svelte'
</script>

<WarningPanel>
  <div class="warning-text">
    <IconNew icon={WarningIcon} />
    <span class="bold">
      This validator has more than {PERCENTAGE_TOTAL_STAKE_WARNING}% total stake
    </span>
    <div>
      <span>We recommend to stake with</span>
      <span style:text-decoration="underline"
        >validators below {PERCENTAGE_TOTAL_STAKE_WARNING}% total stake</span
      >
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
