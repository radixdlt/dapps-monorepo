<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { formatAmount } from '@utils'

  export let stakeInfo: Promise<{
    totalStake: number
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
      {formatAmount(totalStake)}
    {/await}
  </div>

  <div class="percentage">
    {#await stakeInfo}
      <SkeletonLoader width={50} />
    {:then { percentageTotalStake }}
      {`(${percentageTotalStake}%)`}
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
    color: var(--color-grey-2);
  }
</style>
