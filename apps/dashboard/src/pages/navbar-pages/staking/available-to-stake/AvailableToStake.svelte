<script lang="ts">
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import TokenIcon from '@components/_base/token-icon/TokenIcon.svelte'
  import { formatXRDValue } from '@utils'

  export let xrdAvailableToStake: Promise<string>
</script>

<div class="card available-to-stake">
  <TokenIcon isXrd --size="24px" />
  <div class="text">XRD available to be staked:</div>
  <div class="amount">
    {#await xrdAvailableToStake}
      <SkeletonLoader />
    {:then amount}
      {formatXRDValue(amount)}
    {/await}
  </div>
</div>

<style>
  .available-to-stake {
    min-width: 21rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
  }

  .text {
    font-weight: 500;
    color: var(--color-grey-2);
  }

  .amount {
    font-weight: 500;
    color: var(--color-grey-1);
    display: flex;
  }
</style>
