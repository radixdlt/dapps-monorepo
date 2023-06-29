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
    type Validator
  } from '../../../../src/pages/navbar-pages/staking/Validators.svelte'
  import type { LayoutData } from './$types'
  import type { Account } from '@stores'
  import { writable } from 'svelte/store'
  import type { AccumulatedStakes } from './proxy+layout'
  import Claim from '@pages/navbar-pages/staking/stake-unstake/claim/Claim.svelte'

  export let data: LayoutData

  $: _accumulatedStakes = data.validatorAccumulatedStakes

  $: accumulatedStakes.set($_accumulatedStakes)

  let claimAllOpen = false

  $: stakeInfo = data.stakes
</script>

<Validators
  validators={data.promises.validators}
  stakeInfo={data.stakes}
  bookmarked={data.promises.bookmarkedValidators}
  on:claim-all={() => {
    claimAllOpen = true
  }}
/>

{#await $stakeInfo then info}
  <Claim bind:open={claimAllOpen} readyToClaim={info.readyToClaim} />
{/await}

<slot />
