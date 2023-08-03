<script lang="ts">
  import type { LayoutData } from '../$types'
  import BigNumber from 'bignumber.js'
  import { goto } from '$app/navigation'
  import AddStakeSingle from '@dashboard-pages/navbar-pages/staking/stake-unstake/stake/single-validator/AddStakeSingle.svelte'

  export let data: LayoutData

  $: stakes = data.stakes
</script>

{#await data.promises.validator then validator}
  <AddStakeSingle
    validator={{
      address: validator.address,
      name: validator.name,
      currentlyStakingAmount: $stakes.then((stakes) =>
        stakes
          .reduce((sum, { staked }) => sum.plus(staked), new BigNumber(0))
          .toString()
      )
    }}
    on:close={(e) => {
      goto(`/network-staking/${data.validatorAddress}`, {
        invalidateAll: e.detail === 'invalidate' ? true : false
      })
    }}
  />
{/await}
