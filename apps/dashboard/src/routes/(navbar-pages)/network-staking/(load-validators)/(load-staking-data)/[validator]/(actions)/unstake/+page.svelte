<script lang="ts">
  import type { LayoutData } from '../$types'
  import BigNumber from 'bignumber.js'
  import Unstake from '@dashboard-pages/navbar-pages/staking/stake-unstake/unstake/Unstake.svelte'
  import { goto, invalidate } from '$app/navigation'
  import { _dependency } from '../../../+layout'

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
    on:close={(e) => {
      goto(`/network-staking/${data.validatorAddress}`, {
        invalidateAll: e.detail === 'invalidate' ? true : false
      })
    }}
  />
{/await}
