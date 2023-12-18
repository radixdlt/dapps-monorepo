<script lang="ts">
  import Claim from '@dashboard-pages/navbar-pages/staking/stake-unstake/claim/Claim.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'

  export let data: LayoutData

  $: stakeInfo = data.stakeInfo

  $: readyToClaim = $stakeInfo.then((stakeInfo) =>
    stakeInfo.readyToClaim.filter(
      (claim) => claim.validator.address === data.validator
    )
  )
</script>

{#await readyToClaim then readyToClaim}
  <Claim
    {readyToClaim}
    useBackdrop
    on:close={(e) => {
      goto(`/network-staking`, {
        invalidateAll: e.detail === 'invalidate' ? true : false
      })
    }}
  />
{/await}
