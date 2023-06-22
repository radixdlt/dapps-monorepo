<script lang="ts">
  import ValidatorDetails from '@pages/navbar-pages/staking/validator-details/ValidatorDetails.svelte'
  import { goto } from '$app/navigation'
  import type { PageData } from './$types'
  import AddStakeSingle from '@pages/navbar-pages/staking/stake-unstake/stake/single-validator/AddStakeSingle.svelte'

  export let data: PageData

  let detailsOpen = true
  let stakeOpen = false

  $: if (!detailsOpen) {
    goto('/validators')
  }
</script>

<ValidatorDetails
  validator={data.promises.validator}
  bind:open={detailsOpen}
  on:add-stake={() => (stakeOpen = true)}
/>

{#await data.promises.validator then validator}
  <AddStakeSingle
    bind:open={stakeOpen}
    validatorInfo={{
      address: validator.address,
      name: validator.name
    }}
  />
{/await}
