<script lang="ts">
  import { createEventDispatcher, type ComponentProps } from 'svelte'
  import StakingCard from '../staking-card/StakingCard.svelte'

  export let staked: ComponentProps<StakingCard>['staking']
  export let unstaking: ComponentProps<StakingCard>['unstaking']
  export let readyToClaim: ComponentProps<StakingCard>['readyToClaim']
  export let claimText: ComponentProps<StakingCard>['claimText']

  const dispatchEvent = createEventDispatcher<{
    'add-stake': undefined
    unstake: undefined
    claim: undefined
  }>()
</script>

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
<div id="ready-to-claim">
  Ready to claim in approx. 8 days
  <a id="reminder">Add a reminder</a>
</div>

<style>
  :global(#staking-card) {
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0 !important;
    border-bottom: none !important;
  }

  #reminder {
    margin-left: var(--spacing-sm);
    text-decoration: underline;
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
