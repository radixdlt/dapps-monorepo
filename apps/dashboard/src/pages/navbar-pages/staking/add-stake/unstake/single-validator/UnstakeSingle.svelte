<script lang="ts">
  import StakePanel from '../../StakePanel.svelte'
  import OverviewUnstakeCard from '../../stake-card/OverviewUnstakeCard.svelte'
  import type { ComponentProps } from 'svelte'

  export let open: boolean
  export let unstakeCardProps: Omit<
    ComponentProps<OverviewUnstakeCard>,
    'amountToUnstake' | 'invalid'
  >
  export let amountToUnstake = '0'

  let stakeButtonDisabled = false
</script>

<StakePanel bind:open {stakeButtonDisabled}>
  <svelte:fragment slot="title">Unstake</svelte:fragment>

  <svelte:fragment slot="heading-text">
    Validator you have chosen to unstake from
  </svelte:fragment>

  <svelte:fragment slot="heading-subtext">Unstaking amount</svelte:fragment>

  <svelte:fragment slot="content" let:rightColumnWidth>
    <div class="add-stake-card">
      <OverviewUnstakeCard
        {...unstakeCardProps}
        bind:amountToUnstake
        bind:invalid={stakeButtonDisabled}
        --token-amount-card-width={rightColumnWidth}
        --stake-card-height="12rem"
      />
    </div>
  </svelte:fragment>

  <svelte:fragment slot="info-box-title">How Unstaking Works</svelte:fragment>

  <svelte:fragment slot="info-box-explanation">
    It takes 14 days to unstake from a validator. At 14 days you will need to
    claim the stakes for it to come back into your account. You can set a
    reminder on the main page to come back. When you unstake you will be sent a
    transaction to review on your Radix Wallet
  </svelte:fragment>

  <svelte:fragment slot="button-text">Unstake</svelte:fragment>
</StakePanel>
