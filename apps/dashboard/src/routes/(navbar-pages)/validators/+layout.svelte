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
    selectedValidators,
    type Validator
  } from '@dashboard-pages/navbar-pages/staking/Validators.svelte'
  import type { LayoutData } from './$types'
  import type { Account } from '@stores'
  import { writable } from 'svelte/store'
  import type { AccumulatedStakes } from './proxy+layout'
  import FilterDetails from '@dashboard-pages/navbar-pages/staking/filter-details/FilterDetails.svelte'
  import type { ComponentEvents } from 'svelte'
  import AddStakeMultiple from '@dashboard-pages/navbar-pages/staking/stake-unstake/stake/multiple-validators/AddStakeMultiple.svelte'
  import Claim from '@dashboard-pages/navbar-pages/staking/stake-unstake/claim/Claim.svelte'

  export let data: LayoutData

  $: _accumulatedStakes = data.validatorAccumulatedStakes
  $: _stakeInfo = data.stakeInfo

  $: accumulatedStakes.set($_accumulatedStakes)
  $: stakeInfo.set($_stakeInfo)

  let readyToClaim: Promise<ReadyToClaimInfo[]> = new Promise(() => {})

  let claimOpen = false
  let filterOpen = false
  let multipleStakeOpen = false

  let filteredValidators: Awaited<typeof data.promises.validators> = []

  let useFilter = false

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

  $: currentlyStaked = $stakeInfo.then((info) =>
    info.staked.reduce<{ [k: string]: string }>((prev, cur) => {
      prev[cur.validator.address] = cur.xrdAmount
      return prev
    }, {})
  )

  const getSingleClaim = (validator: string) =>
    $stakeInfo.then(
      (info) =>
        info.readyToClaim.filter((c) => c.validator.address === validator)!
    )
</script>

<Validators
  validators={useFilter
    ? Promise.resolve(filteredValidators)
    : data.promises.validators}
  on:show-claim-all={() => {
    readyToClaim = $stakeInfo.then((info) => info.readyToClaim)
    claimOpen = true
  }}
  on:show-claim-single={(e) => {
    readyToClaim = getSingleClaim(e.detail)
    claimOpen = true
  }}
  on:show-stake-multiple={() => {
    multipleStakeOpen = true
  }}
  on:show-filters={() => {
    filterOpen = true
  }}
/>

{#await readyToClaim then readyToClaim}
  <Claim bind:open={claimOpen} {readyToClaim} />
{/await}

{#await Promise.all( [data.promises.validators, data.promises.bookmarkedValidators] ) then [validators, bookmarked]}
  <FilterDetails
    bind:open={filterOpen}
    feeValues={validators.map((v) => v.fee)}
    totalXRDStakeValues={validators.map((v) => v.percentageTotalStake)}
    ownerStakeValues={validators.map((v) => v.percentageOwnerStake)}
    on:applyFilter={applyFilter(validators, bookmarked)}
  />
{/await}

{#key multipleStakeOpen}
  {#await data.promises.validators then validators}
    <AddStakeMultiple
      bind:open={multipleStakeOpen}
      validators={validators.filter((v) => $selectedValidators[v.address])}
      {currentlyStaked}
    />
  {/await}
{/key}

<slot />
