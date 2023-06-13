<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import StakeUnstakePanel from '../StakePanel.svelte'
  import StakeCardSingle from '../stake-card/OverviewStakeCardSingle.svelte'
  import type ValidatorInfo from '../stake-card/ValidatorInfo.svelte'
  import type TokenAmountCardWithBalance from '../stake-card/token-amount-card/TokenAmountCardWithBalance.svelte'

  export let open: boolean
  export let xrdBalance: string
  export let validatorInfo: ComponentProps<ValidatorInfo>
  export let tokenInfo: ComponentProps<TokenAmountCardWithBalance>

  let stakeButtonDisabled = true
</script>

<StakeUnstakePanel bind:open bind:stakeButtonDisabled>
  <svelte:fragment slot="title">Add Stake</svelte:fragment>

  <svelte:fragment slot="account-picker-text">
    <h4>Stake amount coming from</h4>
  </svelte:fragment>

  <svelte:fragment slot="content" let:rightColumnWidth>
    <div class="validator-header flex">
      <h4>Validator you have chosen to stake to</h4>
      <div
        class="align-left staking-amount-text"
        style:width={rightColumnWidth}
      >
        Total staking amount
      </div>
    </div>

    <div class="add-stake-card">
      <StakeCardSingle
        on:invalid={(e) => {
          stakeButtonDisabled = e.detail
        }}
        {validatorInfo}
        cardProps={{
          rightColumnWidth,
          tokenInfo
        }}
      />
    </div>
  </svelte:fragment>

  <svelte:fragment slot="info-box-title">How Staking Works</svelte:fragment>

  <svelte:fragment slot="info-box-explanation">
    Explanation of how staking works
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
    color: var(--color-grey-2);
  }

  .add-stake-card {
    margin-top: var(--spacing-lg);
  }
</style>
