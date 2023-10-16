<script lang="ts">
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'
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
        icon?: URL
        address: string
      }
      poolTokens:
        | {
            name?: string
            icon?: URL
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
    stakeInfo.map((info, i) => ({
      validatorName: info.validatorName,
      staking: info.staking.toString(),
      unstaking: info.unstaking.toString(),
      readyToClaim: info.readyToClaim.toString(),
      id: i.toString()
    }))
  )

  const columns: ComponentProps<
    BasicTable<Awaited<typeof entries>[number]>
  >['columns'] = [
    {
      header: {
        label: 'Validator'
      },
      renderAs: ({ validatorName }) => validatorName
    },
    {
      header: {
        label: 'Staked'
      },
      sortBy: 'staking',
      renderAs: ({ staking }) => formatXRDValue(staking)
    },
    {
      header: {
        label: 'Unstaking'
      },
      sortBy: 'unstaking',
      renderAs: ({ unstaking }) => formatXRDValue(unstaking)
    },
    {
      header: {
        label: 'Ready to Claim'
      },
      sortBy: 'readyToClaim',
      renderAs: ({ readyToClaim }) => formatXRDValue(readyToClaim)
    }
  ]

  let contentWidth: number
</script>

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
    {#if contentWidth < 650}
      <PoolUnitCards poolUnits={poolData} />
    {:else}
      <PoolUnitCards poolUnits={splitPoolUnits.then((arr) => arr[0])} />
      <PoolUnitCards poolUnits={splitPoolUnits.then((arr) => arr[1])} />
    {/if}
  </div></Accordion
>

<style>
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
</style>
