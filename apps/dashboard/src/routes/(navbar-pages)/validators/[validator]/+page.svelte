<script lang="ts">
  import ValidatorDetails from '@pages/navbar-pages/staking/validator-details/ValidatorDetails.svelte'
  import { goto } from '$app/navigation'
  import type { PageData } from './$types'
  import AddStakeSingle from '@pages/navbar-pages/staking/stake-unstake/stake/single-validator/AddStakeSingle.svelte'
  import Unstake from '@pages/navbar-pages/staking/stake-unstake/unstake/Unstake.svelte'
  import Claim from '@pages/navbar-pages/staking/stake-unstake/claim/Claim.svelte'
  import { XRD_SYMBOL } from '@constants'
  import { accountsWithStakes } from '@pages/navbar-pages/staking/Validators.svelte'
  import type { ComponentProps } from 'svelte'

  export let data: PageData

  let detailsOpen = true
  let stakeOpen = false
  let unstakeOpen = false
  let claimOpen = false

  $: if (!detailsOpen) {
    goto('/validators')
  }

  const token = {
    name: XRD_SYMBOL,
    iconUrl:
      'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579'
  }

  let claims = data.promises.validator.then((validator) =>
    $accountsWithStakes.reduce<ComponentProps<Claim>['claims']>(
      (acc, account) => {
        const claims = account.stakes
          .filter((stake) => stake.validator === validator.address)
          .map((stake) => ({
            amount: stake.readyToClaim.toString(),
            validator,
            account: account
          }))

        return [...acc, ...claims]
      },
      []
    )
  )
</script>

<ValidatorDetails
  validator={data.promises.validator}
  bind:open={detailsOpen}
  on:add-stake={() => (stakeOpen = true)}
  on:unstake={() => (unstakeOpen = true)}
  on:claim={() => (claimOpen = true)}
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

{#await claims then claims}
  <Claim bind:open={claimOpen} {claims} {token} />
{/await}
