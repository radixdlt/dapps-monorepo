<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type { Validator } from '@api/utils/validators'
  import { formatTokenValue, truncateNumber } from '@utils'

  export let validator: Promise<Validator>
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

  <div class="percentage subtext">
    {#await validator}
      <SkeletonLoader width={50} />
    {:then { percentageTotalStake }}
      {`(${truncateNumber(percentageTotalStake)}%)`}
    {/await}
  </div>
</div>

<style>
  .stake-display {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .total {
    font-weight: var(--font-weight-bold-1);
  }

  .percentage {
    font-weight: var(--font-weight-bold-1);
  }
</style>
