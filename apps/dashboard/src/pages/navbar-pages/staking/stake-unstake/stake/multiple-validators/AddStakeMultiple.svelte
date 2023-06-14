<script lang="ts">
  import StakeUnstakePanel from '../../StakePanel.svelte'
  import type { Validator } from '../../../Validators.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import OverviewStakeCardMultiple from '../../stake-card/OverviewStakeCardMultiple.svelte'
  import type { ComponentProps } from 'svelte'
  import StakeCardMultiple from '../../stake-card/StakeCardMultiple.svelte'
  import type TokenAmountCard from '../../stake-card/token-amount-card/TokenAmountCard.svelte'
  import DistributeSwitch from './DistributeSwitch.svelte'
  import BigNumber from 'bignumber.js'
  import AccountSection from '../../AccountSection.svelte'
  import type { Account } from '@stores'

  export let open: boolean
  export let validators: Validator[]
  export let tokenCardProps: Omit<
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

  let selectedAccount: Account
</script>

<StakeUnstakePanel bind:open {stakeButtonDisabled}>
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
      cardProps={{
        tokenInfo: {
          ...tokenCardProps,
          tokenBalance
        }
      }}
      nbrOfValidators={validators.length}
      bind:stakeAmount
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
          tokenInfo={tokenCardProps}
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
      color: var(--subtext-color);
    }
  }
</style>
