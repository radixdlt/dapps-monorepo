<script lang="ts">
  import type { LayoutData } from '../$types'
  import BigNumber from 'bignumber.js'
  import Unstake from '@dashboard-pages/navbar-pages/staking/stake-unstake/unstake/Unstake.svelte'
  import { goto } from '$app/navigation'

  export let data: LayoutData

  $: stakes = data.stakes
</script>

{#await $stakes then stakes}
  <Unstake
    stakes={stakes
      .map(({ account, validator, staked, stakeUnits }) => ({
        account,
        validator,
        amount: staked,
        stakeUnits
      }))
      .filter(({ amount }) => !new BigNumber(amount).eq(0))}
    on:close={() => goto(`/network-staking/${data.validatorAddress}`)}
  />
{/await}
