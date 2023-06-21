<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import StakingCard from '../staking-card/StakingCard.svelte'

  export let staked: Awaited<ComponentProps<StakingCard>['staking']>
  export let unstaking: Awaited<ComponentProps<StakingCard>['unstaking']>
  export let readyToClaim: Awaited<ComponentProps<StakingCard>['readyToClaim']>
  export let claimText: Awaited<ComponentProps<StakingCard>['claimText']>
</script>

<StakingCard
  staking={Promise.resolve(staked)}
  unstaking={Promise.resolve(unstaking)}
  readyToClaim={Promise.resolve(readyToClaim)}
  {claimText}
>
  <div slot="staking-section">
    <a>Add Stake</a>
  </div>
  <div slot="unstaking-section">
    <a>Request Unstake</a>
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
</style>
