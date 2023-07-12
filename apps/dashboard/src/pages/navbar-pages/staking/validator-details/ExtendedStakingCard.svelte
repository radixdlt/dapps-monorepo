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

<StakingCard
  staking={staked}
  {unstaking}
  {readyToClaim}
  {claimText}
  on:click={() => dispatchEvent('claim')}
>
  <div slot="staking-section" class="stake-unstake">
    <button
      class="stake-unstake-button"
      on:click={() => dispatchEvent('add-stake')}>Add Stake</button
    >
    {#await staked then staked}
      {#if new BigNumber(staked).gt(0)}
        <button
          class="stake-unstake-button"
          on:click={() => dispatchEvent('unstake')}>Request Unstake</button
        >
      {/if}
    {/await}
  </div>
  <div slot="unstaking-section">
    {#await unstaking then amount}
      {#if new BigNumber(amount).gt(0)}
        <div class="ready-to-claim">
          {#await validatorAddress}
            <SkeletonLoader />
          {:then validatorAddress}
            <ReadyToClaim {validatorAddress}>
              <div slot="text" let:days>
                Ready to claim in approx. {days} days
              </div>
            </ReadyToClaim>
          {/await}
        </div>
      {/if}
    {/await}
  </div>
</StakingCard>

<style lang="scss">
  .ready-to-claim,
  .stake-unstake {
    margin-top: var(--spacing-sm);
  }

  .stake-unstake-button {
    color: var(--theme-button-primary);
  }

  .stake-unstake {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
</style>
