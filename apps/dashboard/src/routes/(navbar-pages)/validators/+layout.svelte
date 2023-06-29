<script lang="ts" context="module">
  export type StakeInfo = {
    account: Account
    validator: Validator
    amount: string
  }

  export const accumulatedStakes = writable<Promise<AccumulatedStakes>>()
</script>

<script lang="ts">
  import Validators, {
    selectedValidators,
    type Validator
  } from '../../../../src/pages/navbar-pages/staking/Validators.svelte'
  import type { LayoutData } from './$types'
  import type { Account } from '@stores'
  import { writable } from 'svelte/store'
  import type { AccumulatedStakes } from './proxy+layout'
  import Claim from '../../../../src/pages/navbar-pages/staking/stake-unstake/claim/Claim.svelte'
  import FilterDetails from '../../../../src/pages/navbar-pages/staking/filter-details/FilterDetails.svelte'
  import type { ComponentEvents } from 'svelte'
  import AddStakeMultiple from '../../../../src/pages/navbar-pages/staking/stake-unstake/stake/multiple-validators/AddStakeMultiple.svelte'

  export let data: LayoutData

  $: _accumulatedStakes = data.validatorAccumulatedStakes

  $: accumulatedStakes.set($_accumulatedStakes)

  let claimAllOpen = false
  let filterOpen = false
  let multipleStakeOpen = false

  $: stakeInfo = data.stakes

  let filteredValidators = new Promise<
    Awaited<typeof data.promises.validators>
  >(() => {})

  const applyFilter =
    (
      validators: Awaited<typeof data.promises.validators>,
      bookmarked: Awaited<typeof data.promises.bookmarkedValidators>
    ) =>
    (e: ComponentEvents<FilterDetails>['applyFilter']) => {
      filteredValidators = Promise.resolve(
        validators.filter((v) => {
          return (
            v.fee >= e.detail.feeFilter.min &&
            v.fee <= e.detail.feeFilter.max &&
            v.percentageTotalStake >= e.detail.totalXRDStakeFilter.min &&
            v.percentageTotalStake <= e.detail.totalXRDStakeFilter.max &&
            v.percentageOwnerStake >= e.detail.ownerStakeFilter.min &&
            v.percentageOwnerStake <= e.detail.ownerStakeFilter.max &&
            (e.detail.acceptsStakeFilter ? v.acceptsStake : true) &&
            (e.detail.bookmarkedFilter ? bookmarked[v.address] : true)
          )
        })
      )
    }

  $: currentlyStaked = $stakeInfo.then((info) =>
    info.stakes.reduce<{ [k: string]: string }>((prev, cur) => {
      prev[cur.validator.address] = cur.amount
      return prev
    }, {})
  )
</script>

<Validators
  validators={data.promises.validators}
  stakeInfo={data.stakes}
  on:show-claim-all={() => {
    claimAllOpen = true
  }}
  on:show-stake-multiple={() => {
    multipleStakeOpen = true
  }}
  on:show-filters={() => {
    filterOpen = true
  }}
/>

{#await $stakeInfo then info}
  <Claim bind:open={claimAllOpen} readyToClaim={info.readyToClaim} />
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

{#await data.promises.validators then validators}
  <AddStakeMultiple
    bind:open={multipleStakeOpen}
    validators={validators.filter((v) => $selectedValidators[v.address])}
    {currentlyStaked}
  />
{/await}

<slot />
