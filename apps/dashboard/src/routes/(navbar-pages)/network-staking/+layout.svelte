<script lang="ts" context="module">
  type CommonStakeInfo<T extends string> = {
    type: T
    account: Account
    validator: Validator
    xrdAmount: string
    stakeUnitAmount: string
  }

  export type StakedInfo = CommonStakeInfo<'staked'>
  export type UnstakingInfo = CommonStakeInfo<'unstaking'> & {
    claimEpoch: string
  }
  export type ReadyToClaimInfo = CommonStakeInfo<'readyToClaim'> & {
    claimEpoch: string
  }

  export type StakeInfo = StakedInfo | UnstakingInfo | ReadyToClaimInfo

  export const accumulatedStakes = writable<Promise<AccumulatedStakes>>()
  export const stakeInfo = writable<
    Promise<{
      staked: StakedInfo[]
      unstaking: UnstakingInfo[]
      readyToClaim: ReadyToClaimInfo[]
    }>
  >()
</script>

<script lang="ts">
  import Validators, {
    type Validator
  } from '@dashboard-pages/navbar-pages/staking/Validators.svelte'
  import type { LayoutData } from './$types'
  import type { Account } from '@stores'
  import { writable } from 'svelte/store'
  import type { AccumulatedStakes } from './proxy+layout'
  import { goto } from '$app/navigation'
  import FilterDetails from '@dashboard-pages/navbar-pages/staking/filter-details/FilterDetails.svelte'
  import type { ComponentEvents } from 'svelte'

  export let data: LayoutData

  $: _accumulatedStakes = data.validatorAccumulatedStakes
  $: _stakeInfo = data.stakeInfo

  $: accumulatedStakes.set($_accumulatedStakes)
  $: stakeInfo.set($_stakeInfo)

  let useFilter = false
  let filterOpen = false

  let filteredValidators: Awaited<typeof data.promises.validators> = []

  const applyFilter =
    (
      validators: Awaited<typeof data.promises.validators>,
      bookmarked: Awaited<typeof data.promises.bookmarkedValidators>
    ) =>
    (e: ComponentEvents<FilterDetails>['applyFilter']) => {
      filteredValidators = validators.filter((v) => {
        return (
          v.fee >= e.detail.feeFilter[0] &&
          v.fee <= e.detail.feeFilter[1] &&
          v.percentageTotalStake >= e.detail.totalXRDStakeFilter[0] &&
          v.percentageTotalStake <= e.detail.totalXRDStakeFilter[1] &&
          v.percentageOwnerStake >= e.detail.ownerStakeFilter[0] &&
          v.percentageOwnerStake <= e.detail.ownerStakeFilter[1] &&
          (e.detail.acceptsStakeFilter ? v.acceptsStake : true) &&
          (e.detail.bookmarkedFilter ? bookmarked[v.address] : true)
        )
      })

      useFilter = true
    }
</script>

<Validators
  validators={useFilter
    ? Promise.resolve(filteredValidators)
    : data.promises.validators}
  on:show-claim-all={() => goto('/network-staking/claim-multiple')}
  on:show-claim-single={(e) => goto(`/network-staking/${e.detail}/claim`)}
  on:show-stake-multiple={() => goto('/network-staking/stake-multiple')}
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
