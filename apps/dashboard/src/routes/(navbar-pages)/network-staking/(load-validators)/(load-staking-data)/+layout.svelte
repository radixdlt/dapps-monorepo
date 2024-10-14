<script lang="ts" context="module">
  export const accumulatedStakes = writable<Promise<AccumulatedStakes>>()
  export const stakeInfo = writable<
    Promise<{
      staked: StakedInfo[]
      unstaking: UnstakingInfo[]
      readyToClaim: ReadyToClaimInfo[]
    }>
  >(new Promise(() => {}))

  export const currentEpoch = writable<Promise<number>>(new Promise(() => {}))

  export const validatorNotFound = writable<boolean>(false)
</script>

<script lang="ts">
  import Validators from '@dashboard-pages/navbar-pages/staking/Validators.svelte'
  import type { LayoutData } from './$types'
  import { writable } from 'svelte/store'
  import FilterDetails, {
    DEFAULT_VALIDATORS_FILTER
  } from '@dashboard-pages/navbar-pages/staking/filter-details/FilterDetails.svelte'
  import { onMount, type ComponentEvents } from 'svelte'
  import type {
    StakedInfo,
    UnstakingInfo,
    ReadyToClaimInfo
  } from '@api/_deprecated/utils/staking'
  import type { AccumulatedStakes } from './+layout'
  import { uptimeModule } from '@dashboard/lib/validators/uptime-module'

  export let data: LayoutData

  $: _accumulatedStakes = data.validatorAccumulatedStakes
  $: _stakeInfo = data.stakeInfo

  $: $accumulatedStakes = $_accumulatedStakes
  $: $stakeInfo = $_stakeInfo
  $: $currentEpoch = data.promises.ledger_state.then((ls) => ls.epoch)

  let filterOpen = false

  let filteredValidators: Awaited<typeof data.promises.validators> | undefined

  let filter: FilterDetails

  const applyFilter =
    (
      validators: Awaited<typeof data.promises.validators>,
      bookmarked: Awaited<typeof data.promises.bookmarkedValidators>
    ) =>
    async (e: ComponentEvents<FilterDetails>['close']) => {
      const epoch = await $currentEpoch
      const uptimeData = uptimeModule.getDataForUptime(
        e.detail.uptimeFilter.timeframe
      )
      const filtered = validators.filter((v) => {
        const {
          detail: {
            feeFilter,
            totalXRDStakeFilter,
            acceptsStakeFilter,
            bookmarkedFilter,
            withinTop100Filter,
            uptimeFilter
          }
        } = e

        return (
          v.fee(epoch).percentage >= feeFilter[0] &&
          v.fee(epoch).percentage <= feeFilter[1] &&
          v.percentageTotalStake >= totalXRDStakeFilter[0] &&
          v.percentageTotalStake <= totalXRDStakeFilter[1] &&
          (withinTop100Filter ? !!v.percentageTotalStake : true) &&
          (acceptsStakeFilter ? v.acceptsStake : true) &&
          (bookmarkedFilter ? bookmarked[v.address] : true) &&
          (uptimeData?.[v.address] || 100) >= uptimeFilter.percentage
        )
      })

      if (filtered.length === validators.length) {
        filteredValidators = undefined
      } else {
        filteredValidators = filtered
      }
    }

  onMount(() => {
    Promise.all([
      data.promises.validators,
      data.promises.bookmarkedValidators
    ]).then(([validators, bookmarked]) => {
      applyFilter(
        validators,
        bookmarked
      )({ detail: DEFAULT_VALIDATORS_FILTER } as CustomEvent<any>)
    })
  })

  let totalXrdBalance = data.totalXrdBalance
</script>

<Validators
  validators={data.promises.validators}
  totalXrdBalance={$totalXrdBalance}
  {filteredValidators}
  on:show-filters={() => {
    filterOpen = true
  }}
  on:reset-filters={() => {
    filteredValidators = undefined
    filter.reset()
  }}
/>

{#await Promise.all( [data.promises.validators, data.promises.bookmarkedValidators, $currentEpoch] ) then [validators, bookmarked, epoch]}
  <FilterDetails
    bind:this={filter}
    bind:open={filterOpen}
    feeValues={validators.map((v) => v.fee(epoch).percentage)}
    totalXRDStakeValues={validators.map((v) => v.percentageTotalStake)}
    on:close={(e) => {
      applyFilter(validators, bookmarked)(e)
      filterOpen = false
    }}
  />
{/await}

<slot />
