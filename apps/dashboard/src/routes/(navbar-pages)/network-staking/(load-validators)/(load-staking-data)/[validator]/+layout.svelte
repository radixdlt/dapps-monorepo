<script lang="ts">
  import ValidatorDetails from '@dashboard-pages/navbar-pages/staking/validator-details/ValidatorDetails.svelte'
  import { goto } from '$app/navigation'
  import type { LayoutData } from './$types'
  import { currentEpoch, validatorNotFound } from '../+layout.svelte'

  export let data: LayoutData

  $: accumulatedStakes = data.validatorAccumulatedStakes

  data.promises.validator.then((validator) => {
    if (!validator) $validatorNotFound = true
  })
</script>

{#await $currentEpoch then epoch}
  <ValidatorDetails
    currentEpoch={epoch}
    validator={data.promises.validator}
    accumulatedValidatorStakes={$accumulatedStakes}
    on:close={() => {
      goto('/network-staking')
    }}
    on:add-stake={() => goto(`/network-staking/${data.validatorAddress}/stake`)}
    on:unstake={() => goto(`/network-staking/${data.validatorAddress}/unstake`)}
    on:claim={() => goto(`/network-staking/${data.validatorAddress}/claim`)}
  />
  <slot />
{/await}
