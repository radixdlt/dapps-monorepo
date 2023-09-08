<script lang="ts" context="module">
  export const accumulatedStakes = writable<Promise<AccumulatedStakes>>()
  export const stakeInfo = writable<
    Promise<{
      staked: StakedInfo[]
      unstaking: UnstakingInfo[]
      readyToClaim: ReadyToClaimInfo[]
    }>
  >()

  export const currentEpoch = writable<number>(0)

  export const validatorNotFound = writable<boolean>(false)
</script>

<script lang="ts">
  import Validators from '@dashboard-pages/navbar-pages/staking/Validators.svelte'
  import type { LayoutData } from './$types'
  import { writable } from 'svelte/store'
  import type { AccumulatedStakes } from './proxy+layout'
  import { goto } from '$app/navigation'
  import FilterDetails from '@dashboard-pages/navbar-pages/staking/filter-details/FilterDetails.svelte'
  import type { ComponentEvents } from 'svelte'
  import { bookmarkedValidatorsStore } from '../../../stores'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'
  import type {
    StakedInfo,
    UnstakingInfo,
    ReadyToClaimInfo
  } from '@api/utils/staking'

  export let data: LayoutData

  $: _accumulatedStakes = data.validatorAccumulatedStakes
  $: _stakeInfo = data.stakeInfo

  $: $accumulatedStakes = $_accumulatedStakes
  $: $stakeInfo = $_stakeInfo
  $: $currentEpoch = data.currentEpoch

  let useFilter = false
  let filterOpen = false

  let filteredValidators: Awaited<typeof data.promises.validators> = []

  const applyFilter =
    (
      validators: Awaited<typeof data.promises.validators>,
      bookmarked: Awaited<typeof data.promises.bookmarkedValidators>
    ) =>
    (e: ComponentEvents<FilterDetails>['close']) => {
      filteredValidators = validators.filter((v) => {
        return (
          v.fee >= e.detail.feeFilter[0] &&
          v.fee <= e.detail.feeFilter[1] &&
          v.percentageTotalStake >= e.detail.totalXRDStakeFilter[0] &&
          v.percentageTotalStake <= e.detail.totalXRDStakeFilter[1] &&
          v.percentageOwnerStake >= e.detail.ownerStakeFilter[0] &&
          v.percentageOwnerStake <= e.detail.ownerStakeFilter[1] &&
          (e.detail.acceptsStakeFilter ? v.acceptsStake : true) &&
          (e.detail.bookmarkedFilter ? bookmarked[v.address] : true) &&
          v.uptimePercentages[e.detail.uptimeFilter.timeframe] >=
            e.detail.uptimeFilter.percentage
        )
      })

      useFilter = true
    }
</script>

{#if $validatorNotFound}
  <NotFound />
{:else}
  <Validators
    validators={useFilter
      ? Promise.resolve(filteredValidators)
      : data.promises.validators.then((v) =>
          v.sort((v1) => ($bookmarkedValidatorsStore[v1.address] ? -1 : 1))
        )}
    on:show-claim-all={() => goto('/network-staking/claim-multiple')}
    on:show-claim-single={(e) => goto(`/network-staking/${e.detail}/claim`)}
    on:show-stake-multiple={() => goto('/network-staking/stake-multiple')}
    on:show-stake-single={(e) => goto(`/network-staking/${e.detail}/stake`)}
    on:show-filters={() => {
      filterOpen = true
    }}
  />

  {#await Promise.all( [data.promises.validators, data.promises.bookmarkedValidators] ) then [validators, bookmarked]}
    <FilterDetails
      bind:open={filterOpen}
      feeValues={validators.map((v) => v.fee)}
      totalXRDStakeValues={validators.map((v) => v.percentageTotalStake)}
      ownerStakeValues={validators.map((v) => v.percentageOwnerStake)}
      on:close={(e) => {
        applyFilter(validators, bookmarked)(e)
        filterOpen = false
      }}
    />
  {/await}

  <slot />
{/if}
