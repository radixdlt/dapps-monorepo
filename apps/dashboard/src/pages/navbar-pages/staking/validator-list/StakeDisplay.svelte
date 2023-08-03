<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { formatTokenValue, truncateNumber } from '@utils'

  export let stakeInfo: Promise<{
    totalStake: string
    percentageTotalStake: number
  }>
</script>

<div class="stake-display">
  <div class="total">
    {#await stakeInfo}
      <div style:display="inline-block">
        <SkeletonLoader width={50} />
      </div>
    {:then { totalStake }}
      {formatTokenValue(totalStake).displayValue}
    {/await}
  </div>

  <div class="percentage">
    {#await stakeInfo}
      <SkeletonLoader width={50} />
    {:then { percentageTotalStake }}
      {`(${truncateNumber(percentageTotalStake)}%)`}
    {/await}
  </div>
</div>

<style>
  .stake-display {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr / 1fr;
  }

  .total {
    font-weight: var(--font-weight-bold-1);
  }

  .percentage {
    font-weight: var(--font-weight-bold-1);
    font-size: var(--text-sm);
    color: var(--theme-subtext);
  }
</style>
