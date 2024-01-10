<script lang="ts">
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import Accordion from '@components/_base/accordion/Accordion.svelte'
  import BasicTable from '@components/_base/table/basic-table/BasicTable.svelte'
  import TokenIcon from '@components/_base/token-icon/TokenIcon.svelte'
  import type BigNumber from 'bignumber.js'
  import type { ComponentProps } from 'svelte'
  import PoolUnitCards from './PoolUnitCards.svelte'
  import { formatXRDValue } from '@utils'

  export let stakeInfo: Promise<
    {
      validatorName: string
      staking: BigNumber
      unstaking: BigNumber
      readyToClaim: BigNumber
    }[]
  >

  export let poolData: Promise<
    {
      poolUnit: {
        name?: string
        icon?: string
        address: string
      }
      poolTokens:
        | {
            name?: string
            icon?: string
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

  const entries = stakeInfo.then((stakeInfo) =>
    stakeInfo.map((info) => ({
      validatorName: info.validatorName,
      staking: info.staking.toString(),
      unstaking: info.unstaking.toString(),
      readyToClaim: info.readyToClaim.toString()
    }))
  )

  const columns: ComponentProps<
    BasicTable<Awaited<typeof entries>[number]>
  >['columns'] = [
    {
      id: 'name',
      header: {
        label: 'Validator'
      },
      renderAs: ({ validatorName }) => validatorName
    },
    {
      id: 'staked',
      header: {
        label: 'Staked'
      },
      sortBy: 'staking',
      renderAs: ({ staking }) => formatXRDValue(staking)
    },
    {
      id: 'unstaking',
      header: {
        label: 'Unstaking'
      },
      sortBy: 'unstaking',
      renderAs: ({ unstaking }) => formatXRDValue(unstaking)
    },
    {
      id: 'readyToClaim',
      header: {
        label: 'Ready to Claim'
      },
      sortBy: 'readyToClaim',
      renderAs: ({ readyToClaim }) => formatXRDValue(readyToClaim)
    }
  ]

  let contentWidth: number
</script>

<div class="pool-units">
  <Accordion isOpened={true}>
    <div class="radix-staking-header" slot="header">
      <TokenIcon isXrd />
      <span class="header-text">Radix Network XRD Stake</span>
    </div>

    <svelte:fragment slot="content">
      {#await entries}
        <SkeletonLoader />
      {:then entries}
        {#if entries.length > 0}
          <BasicTable {entries} {columns} />
        {/if}
      {/await}
    </svelte:fragment>
  </Accordion>
  <Accordion isOpened={true}>
    <div class="header-text" slot="header">Pool Units</div>

    <div class="flex-container" slot="content" bind:clientWidth={contentWidth}>
      {#await Promise.all( [poolData, splitPoolUnits] ) then [poolUnits, splitPoolUnits]}
        {#if contentWidth < 650 || poolUnits.length === 1}
          <PoolUnitCards {poolUnits} />
        {:else}
          <PoolUnitCards poolUnits={splitPoolUnits[0]} />
          <PoolUnitCards poolUnits={splitPoolUnits[1]} />
        {/if}
      {/await}
    </div></Accordion
  >
</div>

<style lang="scss">
  .radix-staking-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .header-text {
    font-size: var(--text-lg);
    font-weight: var(--font-weight-bold-1);
  }

  .flex-container {
    display: flex;
    gap: var(--spacing-2xl);
    justify-content: stretch;
  }

  .pool-units {
    :global(.header-wrapper) {
      height: 8rem;

      @include mixins.desktop {
        height: 7rem;
      }
    }

    :global(.accordion) {
      border-top: 1px solid var(--theme-border-separator);

      &:last-child {
        border-bottom: 1px solid var(--theme-border-separator);
      }
    }
    :global(.content) {
      padding-bottom: 1rem;
    }
  }
</style>
