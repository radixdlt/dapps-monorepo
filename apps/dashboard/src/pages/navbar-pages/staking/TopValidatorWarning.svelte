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
      This validator has more than {PERCENTAGE_TOTAL_STAKE_WARNING}% total
      stake.
    </span>
    <div>
      <span>We recommend to stake with</span>
      <a
        class="link"
        href="https://learn.radixdlt.com/article/how-should-i-choose-validators-to-stake-to"
        >validators below {PERCENTAGE_TOTAL_STAKE_WARNING}% total stake</a
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

  .bold {
    font-weight: var(--font-weight-bold-2);
  }

  a.link {
    text-decoration: underline;
    font-weight: var(--font-weight-light);
  }
</style>
