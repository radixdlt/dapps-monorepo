<script lang="ts">
  import Claim from '@dashboard-pages/navbar-pages/staking/stake-unstake/claim/Claim.svelte'
  import type { LayoutData } from '../$types'
  import BigNumber from 'bignumber.js'
  import { goto } from '$app/navigation'

  export let data: LayoutData

  let open = true

  $: if (!open) {
    goto(`/network-staking/${data.validatorAddress}`)
  }

  $: stakes = data.stakes
</script>

{#await $stakes then stakes}
  <Claim
    bind:open
    readyToClaim={stakes
      .map(({ account, validator, readyToClaim }) => ({
        account,
        validator,
        xrdAmount: readyToClaim
      }))
      .filter(({ xrdAmount }) => !new BigNumber(xrdAmount).eq(0))}
  />
{/await}
