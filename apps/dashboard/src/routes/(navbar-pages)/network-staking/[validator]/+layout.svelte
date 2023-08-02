<script lang="ts">
  import ValidatorDetails from '@dashboard-pages/navbar-pages/staking/validator-details/ValidatorDetails.svelte'
  import { goto } from '$app/navigation'
  import type { LayoutData } from './$types'

  export let data: LayoutData

  let open = true

  $: if (!open) {
    goto('/network-staking')
  }

  $: accumulatedStakes = data.validatorAccumulatedStakes
</script>

<ValidatorDetails
  validator={data.promises.validator}
  accumulatedValidatorStakes={$accumulatedStakes}
  bind:open
  on:add-stake={() => goto(`/network-staking/${data.validatorAddress}/stake`)}
  on:unstake={() => goto(`/network-staking/${data.validatorAddress}/unstake`)}
  on:claim={() => goto(`/network-staking/${data.validatorAddress}/claim`)}
/>
<slot />
