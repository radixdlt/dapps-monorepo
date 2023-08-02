<script lang="ts">
  import type { LayoutData } from '../$types'
  import BigNumber from 'bignumber.js'
  import { goto } from '$app/navigation'
  import Unstake from '@dashboard-pages/navbar-pages/staking/stake-unstake/unstake/Unstake.svelte'

  export let data: LayoutData

  let open = true

  $: if (!open) {
    goto(`/network-staking/${data.validatorAddress}`)
  }

  $: stakes = data.stakes
</script>

{#await $stakes then stakes}
  <Unstake
    bind:open
    stakes={stakes
      .map(({ account, validator, staked, stakeUnits }) => ({
        account,
        validator,
        amount: staked,
        stakeUnits
      }))
      .filter(({ amount }) => !new BigNumber(amount).eq(0))}
  />
{/await}
