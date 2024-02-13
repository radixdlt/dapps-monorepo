<script lang="ts">
  import type BigNumber from 'bignumber.js'
  import PoolUnitCards from './PoolUnitCards.svelte'
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import NoTokens from '../NoTokens.svelte'

  export let poolData: Promise<
    {
      poolUnit: {
        name?: string
        icon?: string
        address: string
        accountAmount: string
        poolAddress: string
      }
      poolTokens:
        | {
            name?: string
            icon?: string
            address: string
            redeemableAmount: BigNumber
          }[]
    }[]
  >

  $: splitPoolUnits = poolData.then(
    (poolUnits) =>
      [
        poolUnits.slice(0, poolUnits.length / 2),
        poolUnits.slice(poolUnits.length / 2, poolUnits.length)
      ] as const
  )

  let contentWidth: number
</script>

<div class="pool-units">
  {#await Promise.all([poolData, splitPoolUnits])}
    <SkeletonLoader />
  {:then [poolUnits, splitPoolUnits]}
    <div class="flex-container" bind:clientWidth={contentWidth}>
      {#if poolUnits.length === 0}
        <NoTokens>No Pool Units found</NoTokens>
      {:else if contentWidth < 650 || poolUnits.length === 1}
        <PoolUnitCards {poolUnits} />
      {:else}
        <PoolUnitCards poolUnits={splitPoolUnits[0]} />
        <PoolUnitCards poolUnits={splitPoolUnits[1]} />
      {/if}
    </div>
  {/await}
</div>

<style lang="scss">
  .flex-container {
    display: flex;
    gap: var(--spacing-2xl);
    justify-content: stretch;
  }
</style>
