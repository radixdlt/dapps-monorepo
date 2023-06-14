<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import StakeUnstakePanel from '../../StakePanel.svelte'
  import StakeCardSingle from '../../stake-card/OverviewStakeCardSingle.svelte'
  import type ValidatorInfo from '../../stake-card/ValidatorInfo.svelte'
  import type TokenAmountCardWithBalance from '../../stake-card/token-amount-card/TokenAmountCardWithBalance.svelte'
  import AccountSection from '../../AccountSection.svelte'
  import type { Account } from '@stores'

  export let open: boolean
  export let validatorInfo: ComponentProps<ValidatorInfo>
  export let tokenInfo: ComponentProps<TokenAmountCardWithBalance>

  let stakeAmount: string

  let stakeButtonDisabled = true

  let selectedAccount: Account
</script>

<StakeUnstakePanel bind:open bind:stakeButtonDisabled>
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
    <StakeCardSingle
      on:invalid={(e) => {
        stakeButtonDisabled = e.detail
      }}
      {validatorInfo}
      cardProps={{
        tokenInfo
      }}
      bind:stakeAmount
      --token-amount-card-width={rightColumnWidth}
    />
  </svelte:fragment>

  <svelte:fragment slot="info-box-title">How Staking Works</svelte:fragment>

  <svelte:fragment slot="info-box-explanation">
    Explanation of how staking works
  </svelte:fragment>

  <svelte:fragment slot="button-text">Stake</svelte:fragment>
</StakeUnstakePanel>
