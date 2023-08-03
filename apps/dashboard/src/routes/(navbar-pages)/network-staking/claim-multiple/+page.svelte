<script lang="ts">
  import Claim from '@dashboard-pages/navbar-pages/staking/stake-unstake/claim/Claim.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'

  export let data: LayoutData

  $: readyToClaim = data.readyToClaim
</script>

{#await $readyToClaim then readyToClaim}
  <Claim
    {readyToClaim}
    on:close={(e) =>
      goto(`/network-staking`, {
        invalidateAll: e.detail === 'invalidate' ? true : false
      })}
  />
{/await}
