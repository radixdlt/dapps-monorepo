<script lang="ts">
  import { createEventDispatcher, type ComponentProps } from 'svelte'
  import StakingCard from '../staking-card/StakingCard.svelte'
  import ReadyToClaim from '../ready-to-claim/ReadyToClaim.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import BigNumber from 'bignumber.js'
  import { writable } from 'svelte/store'

  export let staked: ComponentProps<StakingCard>['staking']
  export let unstaking: ComponentProps<StakingCard>['unstaking']
  export let readyToClaim: ComponentProps<StakingCard>['readyToClaim']
  export let claimText: ComponentProps<StakingCard>['claimText']
  export let validatorAddress: Promise<string>

  const isUnstaking = writable(false)

  $: unstaking.then((amount) => {
    $isUnstaking = new BigNumber(amount).gt(0)
  })

  const dispatchEvent = createEventDispatcher<{
    'add-stake': undefined
    unstake: undefined
    claim: undefined
  }>()
</script>

<div class:with-ready-to-claim={$isUnstaking}>
  <StakingCard
    staking={staked}
    {unstaking}
    {readyToClaim}
    {claimText}
    on:click={() => dispatchEvent('claim')}
  >
    <div slot="staking-section">
      <button
        class="stake-unstake-button"
        on:click={() => dispatchEvent('add-stake')}>Add Stake</button
      >
    </div>
    <div slot="unstaking-section">
      <button
        class="stake-unstake-button"
        on:click={() => dispatchEvent('unstake')}>Request Unstake</button
      >
    </div>
    <div slot="claim-section">
      <br />
    </div>
  </StakingCard>
</div>

{#await unstaking then amount}
  {#if new BigNumber(amount).gt(0)}
    <div id="ready-to-claim">
      {#await validatorAddress}
        <SkeletonLoader />
      {:then validatorAddress}
        <ReadyToClaim {validatorAddress} />
      {/await}
    </div>
  {/if}
{/await}

<style lang="scss">
  .with-ready-to-claim {
    :global(.staking-card) {
      border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0 !important;
      border-bottom: none !important;
    }
  }

  #ready-to-claim {
    background: var(--color-grey-5);
    border: var(--border) var(--theme-border);
    border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
    padding: var(--spacing-lg);
  }

  .stake-unstake-button {
    color: var(--theme-button-primary);
  }
</style>
