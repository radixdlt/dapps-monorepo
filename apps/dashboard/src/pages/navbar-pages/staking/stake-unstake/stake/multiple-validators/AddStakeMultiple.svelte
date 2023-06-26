<script lang="ts">
  import StakeUnstakePanel from '../../StakePanel.svelte'
  import {
    accountsWithStakes,
    type Validator
  } from '../../../Validators.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import OverviewStakeCardMultiple from '../../stake-card/OverviewStakeCardMultiple.svelte'
  import StakeCardMultiple from '../../stake-card/StakeCardMultiple.svelte'
  import DistributeSwitch from './DistributeSwitch.svelte'
  import BigNumber from 'bignumber.js'
  import AccountSection from '../../AccountSection.svelte'
  import type { Account } from '@stores'
  import { getXRDBalance } from '../getXrdBalance'
  import { getMultipleStakeManifest } from '../manifests'
  import { sendTransaction } from '@api/wallet'
  import { removeThousandsSeparator } from '@utils/format-amount'

  export let open: boolean
  export let validators: Validator[]

  const stake = () => {
    const manifest = getMultipleStakeManifest(
      selectedAccount.address,
      stakeAmounts
    )

    sendTransaction(manifest)
  }

  let stakeButtonDisabled = true

  let distributeEquallyAmount: string

  let stakeAmounts: {
    validator: string
    amount: string
  }[]

  $: stakeAmounts = [...validators].map((validator) => ({
    validator: validator.address,
    amount: '0'
  }))

  let distributeEqually = true

  $: if (distributeEqually) {
    stakeAmounts = stakeAmounts.map((stake) => ({
      validator: stake.validator,
      amount: distributeEquallyAmount
        ? new BigNumber(distributeEquallyAmount)
            .dividedBy(validators.length)
            .toString()
        : '0'
    }))
  }

  let tokenAmountInvalid = false

  $: stakeButtonDisabled =
    stakeAmounts.every((stake) => new BigNumber(stake.amount).lte(0)) ||
    tokenAmountInvalid

  let selectedAccount: Account

  let xrdBalance: Promise<string> = new Promise(() => {})

  $: if (selectedAccount) {
    xrdBalance = getXRDBalance(selectedAccount.address)
  }

  const handleStakeInput = (i: number) => (e: Event) => {
    // @ts-ignore
    stakeAmounts[i].amount = removeThousandsSeparator(e.target.value)
  }

  let currentlyStakingAmounts = $accountsWithStakes
    .find((account) => account.address === selectedAccount.address)
    ?.stakes.map((stake) => ({
      validator: stake.validator,
      amount: stake.staked.toString()
    }))
</script>

<StakeUnstakePanel bind:open {stakeButtonDisabled} on:click={stake}>
  <svelte:fragment slot="title">Add Stake</svelte:fragment>

  <svelte:fragment slot="account-picker" let:rightColumnWidth>
    <AccountSection bind:selectedAccount --width={rightColumnWidth}>
      <svelte:fragment slot="account-picker-text">
        <h4>Stake amount coming from</h4>
      </svelte:fragment>
    </AccountSection>
  </svelte:fragment>

  <svelte:fragment slot="heading-text">
    Validator you have chosen to stake to
  </svelte:fragment>

  <svelte:fragment slot="heading-subtext">Total staking amount</svelte:fragment>

  <svelte:fragment slot="content" let:rightColumnWidth>
    <OverviewStakeCardMultiple
      {xrdBalance}
      nbrOfValidators={validators.length}
      bind:amountToStake={distributeEquallyAmount}
      bind:tokenAmountInvalid
      tokenAmountDisabled={!distributeEqually}
      --token-amount-card-width={rightColumnWidth}
    />

    <Divider />

    <div class="validator-list-header">
      <div>Validator name</div>

      <DistributeSwitch bind:on={distributeEqually} />
    </div>

    <div class="validator-card">
      {#each validators as validator, i}
        <StakeCardMultiple
          {rightColumnWidth}
          {validator}
          tokenDisplayedAmount={stakeAmounts[i].amount}
          amountCardDisabled={distributeEqually}
          currentlyStakingAmount={currentlyStakingAmounts?.find(
            (stake) => stake.validator === validator.address
          )?.amount ?? '0'}
          on:input={handleStakeInput(i)}
        />
      {/each}
    </div>
  </svelte:fragment>

  <svelte:fragment slot="info-box-title">How Staking Works</svelte:fragment>

  <svelte:fragment slot="info-box-explanation">
    When you stake you will be sent a transaction to review on your Radix Wallet
  </svelte:fragment>

  <svelte:fragment slot="button-text">Stake</svelte:fragment>
</StakeUnstakePanel>

<style lang="scss">
  @use '../../../../../../../../../packages/ui/src/mixins.scss';

  .validator-card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    margin-top: var(--spacing-lg);
  }

  .validator-list-header {
    display: flex;
    justify-content: space-between;

    :nth-child(1) {
      align-self: end;
      color: var(--theme-subtext);
    }
  }
</style>
