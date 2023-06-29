<script lang="ts">
  import ValidatorDetails from '@pages/navbar-pages/staking/validator-details/ValidatorDetails.svelte'
  import { goto } from '$app/navigation'
  import type { PageData } from './$types'
  import AddStakeSingle from '@pages/navbar-pages/staking/stake-unstake/stake/single-validator/AddStakeSingle.svelte'
  import Unstake from '@pages/navbar-pages/staking/stake-unstake/unstake/Unstake.svelte'
  import BigNumber from 'bignumber.js'
  import type { Account } from '@stores'
  import Claim from '@pages/navbar-pages/staking/stake-unstake/claim/Claim.svelte'
  import type { Validator } from '@pages/navbar-pages/staking/Validators.svelte'

  export let data: PageData

  let detailsOpen = true
  let stakeOpen = false
  let unstakeOpen = false
  let claimOpen = false

  $: if (!detailsOpen) {
    goto('/validators')
  }

  $: stakeInfo = data.stakes

  $: stakes = $stakeInfo.then(async (info) => {
    const validator = await data.promises.validator

    const staking = info.stakes.filter(
      (stake) => stake.validator.address === validator.address
    )
    const unstaking = info.unstaking.filter(
      (stake) => stake.validator.address === validator.address
    )
    const readyToClaim = info.readyToClaim.filter(
      (stake) => stake.validator.address === validator.address
    )

    const allAccounts = new Map<string, Account>()

    const addAccount = (account: Account) => {
      if (!allAccounts.has(account.address)) {
        allAccounts.set(account.address, account)
      }
    }

    staking.forEach((entry) => addAccount(entry.account))
    unstaking.forEach((entry) => addAccount(entry.account))
    readyToClaim.forEach((entry) => addAccount(entry.account))

    const transformedData: {
      account: Account
      validator: Validator
      staked: string
      unstaking: string
      readyToClaim: string
    }[] = []

    for (const account of allAccounts.values()) {
      const [accumulatedStake, accumulatedUnstake, accumulatedClaim] = [
        staking,
        unstaking,
        readyToClaim
      ].map((arr) =>
        arr
          .filter((entry) => entry.account.address === account.address)
          .reduce((sum, entry) => sum.plus(entry.amount), new BigNumber(0))
          .toString()
      )

      transformedData.push({
        account,
        validator,
        staked: accumulatedStake,
        unstaking: accumulatedUnstake,
        readyToClaim: accumulatedClaim
      })
    }

    return transformedData
  })

  $: accumulatedStakes = data.validatorAccumulatedStakes
</script>

<ValidatorDetails
  validator={data.promises.validator}
  accumulatedValidatorStakes={$accumulatedStakes}
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

{#await stakes then stakes}
  <Unstake
    bind:open={unstakeOpen}
    stakes={stakes.map(({ account, validator, staked }) => ({
      account,
      validator,
      amount: staked
    }))}
  />
{/await}

{#await stakes then stakes}
  <Claim
    bind:open={claimOpen}
    readyToClaim={stakes.map(({ account, validator, readyToClaim }) => ({
      account,
      validator,
      amount: readyToClaim
    }))}
  />
{/await}
