<script lang="ts">
  import StakeUnstakePanel from '../StakePanel.svelte'
  import type { Validator } from '../../Validators.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import OverviewStakeCardMultiple from '../stake-card/OverviewStakeCardMultiple.svelte'
  import type { ComponentProps } from 'svelte'
  import StakeCardMultiple from '../stake-card/StakeCardMultiple.svelte'
  import type TokenAmountCard from '../stake-card/token-amount-card/TokenAmountCard.svelte'
  import DistributeSwitch from './DistributeSwitch.svelte'
  import BigNumber from 'bignumber.js'

  export let open: boolean
  export let validators: Validator[]
  export let tokenInfo: Omit<
    ComponentProps<TokenAmountCard>,
    'invalid' | 'tokenAmount' | 'tokenDisplayedAmount'
  >
  export let tokenBalance: string

  let stakeButtonDisabled = true

  let stakeAmount: string

  let individualValidatorStakeAmounts = Array(validators.length).fill('0')

  let distributeEqually = true

  $: if (distributeEqually) {
    individualValidatorStakeAmounts = individualValidatorStakeAmounts.map((_) =>
      stakeAmount
        ? new BigNumber(stakeAmount).dividedBy(validators.length).toString()
        : '0'
    )
  }

  let tokenAmountInvalid = false

  $: stakeButtonDisabled =
    individualValidatorStakeAmounts.every((amount) =>
      new BigNumber(amount).lte(0)
    ) || tokenAmountInvalid
</script>

<StakeUnstakePanel bind:open {stakeButtonDisabled}>
  <svelte:fragment slot="title">Add Stake</svelte:fragment>

  <svelte:fragment slot="account-picker-text">
    <h4>Stake amount coming from</h4>
  </svelte:fragment>

  <svelte:fragment slot="content" let:rightColumnWidth>
    <div class="validator-header flex">
      <h4>Total amount you're staking</h4>
      <div
        class="align-left staking-amount-text"
        style:width={rightColumnWidth}
      >
        Total staking amount
      </div>
    </div>

    <div class="add-stake-card">
      <OverviewStakeCardMultiple
        cardProps={{
          rightColumnWidth,
          tokenInfo: {
            ...tokenInfo,
            tokenBalance
          }
        }}
        nbrOfValidators={validators.length}
        bind:stakeAmount
        bind:tokenAmountInvalid
        tokenAmountDisabled={!distributeEqually}
      />
    </div>

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
          {tokenInfo}
          bind:tokenDisplayedAmount={individualValidatorStakeAmounts[i]}
          amountCardDisabled={distributeEqually}
          currentlyStakingAmount="100"
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
  @use '../../../../../mixins.scss';

  .flex {
    display: flex;
    justify-content: space-between;
    padding-right: var(--spacing-lg);

    .align-left {
      text-align: left;
    }
  }

  .validator-header {
    margin-top: var(--spacing-2xl);
  }

  .staking-amount-text {
    color: var(--subtext-color);
  }

  .add-stake-card {
    margin-top: var(--spacing-lg);
  }

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
      color: var(--subtext-color);
    }
  }
</style>
