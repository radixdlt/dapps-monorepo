<script lang="ts">
  import ValidatorDetails from '@pages/navbar-pages/staking/validator-details/ValidatorDetails.svelte'
  import { goto } from '$app/navigation'
  import type { PageData } from './$types'
  import AddStakeSingle from '@pages/navbar-pages/staking/stake-unstake/stake/single-validator/AddStakeSingle.svelte'
  import Unstake from '@pages/navbar-pages/staking/stake-unstake/unstake/Unstake.svelte'

  export let data: PageData

  let detailsOpen = true
  let stakeOpen = false
  let unstakeOpen = false

  $: if (!detailsOpen) {
    goto('/validators')
  }
</script>

<ValidatorDetails
  validator={data.promises.validator}
  bind:open={detailsOpen}
  on:add-stake={() => (stakeOpen = true)}
  on:unstake={() => (unstakeOpen = true)}
/>

{#await data.promises.validator then validator}
  <AddStakeSingle
    bind:open={stakeOpen}
    validator={{
      address: validator.address,
      name: validator.name
    }}
  />
{/await}

{#await data.promises.validator then validator}
  <Unstake
    bind:open={unstakeOpen}
    validator={{
      address: validator.address,
      name: validator.name
    }}
  />
{/await}
