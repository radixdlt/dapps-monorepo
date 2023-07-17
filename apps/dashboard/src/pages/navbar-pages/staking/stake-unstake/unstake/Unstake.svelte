<script lang="ts">
  import type { Account } from '@stores'
  import StakePanel from '../StakePanel.svelte'
  import OverviewUnstakeCard from '../stake-card/OverviewUnstakeCard.svelte'
  import BigNumber from 'bignumber.js'
  import { formatTokenValue } from '@utils'
  import { getUnstakeManifest } from '../manifests'
  import type { Validator } from '../../Validators.svelte'
  import { RET_DECIMAL_PRECISION } from '@constants'

  export let open: boolean
  export let stakes: {
    account: Account
    validator: Validator
    amount: string
    stakeUnits: string
  }[]

  let stakeButtonDisabled = false

  let totalUnstakeAmount = '0'

  let invalidInputs = new Array(stakes.length).fill(false)

  $: stakeButtonDisabled = invalidInputs.some((invalid) => invalid)

  let amountsToUnstake = new Array(stakes.length).fill('0')

  $: totalUnstakeAmount = amountsToUnstake
    .reduce<BigNumber>(
      (acc, amount) => acc.plus(amount === '' ? '0' : amount),
      new BigNumber(0)
    )
    .toString()

  const unstake = (
    e: CustomEvent<
      (transactionManifest: string, blobs?: string[] | undefined) => void
    >
  ) => {
    const unstakes: {
      accountAddress: string
      validatorAddress: string
      stakeUnitResource: string
      amount: string
    }[] = []

    stakes.forEach((stake, i) => {
      if (amountsToUnstake[i] !== '0') {
        const stakeUnitsAmount = new BigNumber(amountsToUnstake[i])
          .dividedBy(stake.amount)
          .multipliedBy(stake.stakeUnits)
          .toFixed(RET_DECIMAL_PRECISION, BigNumber.ROUND_DOWN)

        unstakes.push({
          accountAddress: stake.account.address,
          validatorAddress: stake.validator.address,
          stakeUnitResource: stake.validator.stakeUnitResourceAddress,
          amount: stakeUnitsAmount
        })
      }
    })

    const manifest = getUnstakeManifest(unstakes)

    e.detail(manifest)
  }
</script>

<StakePanel
  bind:open
  {stakeButtonDisabled}
  on:click={unstake}
  sidePanelHeader="Request Unstake"
>
  <svelte:fragment slot="heading-text">
    Validator to request unstake from:
  </svelte:fragment>

  <svelte:fragment slot="content" let:rightColumnWidth>
    <div class="card-list">
      {#each stakes as stake, i}
        <div class="add-stake-card">
          <OverviewUnstakeCard
            validator={stake.validator}
            account={stake.account}
            stakedAmount={stake.amount.toString()}
            bind:amountToUnstake={amountsToUnstake[i]}
            bind:invalid={invalidInputs[i]}
            --token-amount-card-width={rightColumnWidth}
            --stake-card-height="12rem"
          />
        </div>
      {/each}
    </div>
  </svelte:fragment>

  <svelte:fragment slot="info-box-title">How Unstaking Works</svelte:fragment>

  <svelte:fragment slot="info-box-explanation">
    It takes 14 days to unstake from a validator. At 14 days you will need to
    claim the stakes for it to come back into your account. You can set a
    reminder on the main page to come back. When you unstake you will be sent a
    transaction to review on your Radix Wallet
  </svelte:fragment>

  <svelte:fragment slot="button-text">Send to Radix Wallet</svelte:fragment>
</StakePanel>

<style lang="scss">
  @use '../shared.scss';
  .card-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }
</style>
