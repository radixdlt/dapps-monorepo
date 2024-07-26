<script lang="ts">
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import type { Validator } from '@api/_deprecated/utils/entities/validator'
  import { formatTokenValue, truncateNumber } from '@utils'
  import { PERCENTAGE_TOTAL_STAKE_WARNING } from '@constants'
  import WarningIcon from '@icons/warning.svg'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import type { ValidatorListItem } from '@api/utils/entities/component/validator'

  export let validator: Promise<ValidatorListItem>
</script>

<div class="stake-display">
  <div class="total">
    {#await validator}
      <div style:display="inline-block">
        <SkeletonLoader width={50} />
      </div>
    {:then { totalStakeInXRD }}
      {formatTokenValue(totalStakeInXRD).displayValue}
    {/await}
  </div>

  {#await validator}
    <SkeletonLoader width={50} />
  {:then { percentageTotalStake }}
    <div
      class="percentage subtext"
      class:warning={percentageTotalStake >= PERCENTAGE_TOTAL_STAKE_WARNING}
    >
      {#if percentageTotalStake >= PERCENTAGE_TOTAL_STAKE_WARNING}
        <IconNew icon={WarningIcon} />
      {/if}
      {`(${truncateNumber(percentageTotalStake)}%)`}
    </div>
  {/await}
</div>

<style lang="scss">
  .stake-display {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-md);

    @include mixins.desktop {
      justify-content: center;
    }
  }

  .total {
    font-weight: var(--font-weight-bold-1);
  }

  .percentage {
    font-weight: var(--font-weight-bold-1);
    display: flex;
    gap: var(--spacing-xs);
  }

  .warning {
    background-color: var(--theme-surface-1);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-xs) var(--spacing-sm);
    color: var(--color-alert-1);
  }
</style>
