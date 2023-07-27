<script lang="ts">
  import ValidatorDetails from '@dashboard-pages/navbar-pages/staking/validator-details/ValidatorDetails.svelte'
  import { goto } from '$app/navigation'
  import type { PageData } from './$types'
  import AddStakeSingle from '@dashboard-pages/navbar-pages/staking/stake-unstake/stake/single-validator/AddStakeSingle.svelte'
  import Unstake from '@dashboard-pages/navbar-pages/staking/stake-unstake/unstake/Unstake.svelte'
  import BigNumber from 'bignumber.js'
  import type { Account } from '@stores'
  import Claim from '@dashboard-pages/navbar-pages/staking/stake-unstake/claim/Claim.svelte'
  import type { Validator } from '@dashboard-pages/navbar-pages/staking/Validators.svelte'
  import type { StakeInfo } from '../+layout.svelte'

  export let data: PageData

  let detailsOpen = true
  let stakeOpen = false
  let unstakeOpen = false
  let claimOpen = false

  $: if (!detailsOpen) {
    goto('/network-staking')
  }

  $: stakeInfo = data.stakeInfo

  $: stakes = $stakeInfo.then(async (info) => {
    const validator = await data.promises.validator

    const staking = info.staked.filter(
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
      stakeUnits: string
    }[] = []

    for (const account of allAccounts.values()) {
      const [accumulatedStake, accumulatedUnstake, accumulatedClaim] = [
        staking,
        unstaking,
        readyToClaim
      ].map((arr: StakeInfo[]) =>
        arr
          .filter((entry) => entry.account.address === account.address)
          .reduce((sum, entry) => sum.plus(entry.xrdAmount), new BigNumber(0))
          .toString()
      )

      const accumulatedStakeUnits = staking
        .filter((entry) => entry.account.address === account.address)
        .reduce(
          (sum, entry) => sum.plus(entry.stakeUnitAmount),
          new BigNumber(0)
        )
        .toString()

      transformedData.push({
        account,
        validator,
        staked: accumulatedStake,
        unstaking: accumulatedUnstake,
        readyToClaim: accumulatedClaim,
        stakeUnits: accumulatedStakeUnits
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
      name: validator.name,
      currentlyStakingAmount: stakes.then((stakes) =>
        stakes
          .reduce((sum, { staked }) => sum.plus(staked), new BigNumber(0))
          .toString()
      )
    }}
  />
{/await}

{#await stakes then stakes}
  <Unstake
    bind:open={unstakeOpen}
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

{#await stakes then stakes}
  <Claim
    bind:open={claimOpen}
    readyToClaim={stakes
      .map(({ account, validator, readyToClaim }) => ({
        account,
        validator,
        xrdAmount: readyToClaim
      }))
      .filter(({ xrdAmount }) => !new BigNumber(xrdAmount).eq(0))}
  />
{/await}
