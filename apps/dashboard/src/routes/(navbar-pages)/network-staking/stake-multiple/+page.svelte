<script lang="ts">
  import AddStakeMultiple from '@dashboard-pages/navbar-pages/staking/stake-unstake/stake/multiple-validators/AddStakeMultiple.svelte'
  import type { LayoutData } from './$types'
  import { selectedValidators } from '@dashboard-pages/navbar-pages/staking/Validators.svelte'
  import { goto } from '$app/navigation'

  export let data: LayoutData

  $: currentlyStaked = data.currentlyStaked
</script>

{#await data.promises.validators then validators}
  <AddStakeMultiple
    validators={validators.filter((v) => $selectedValidators[v.address])}
    currentlyStaked={$currentlyStaked}
    on:close={() => {
      goto('/network-staking')
    }}
  />
{/await}
