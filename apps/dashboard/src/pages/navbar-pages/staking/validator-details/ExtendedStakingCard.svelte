<script lang="ts">
  import { createEventDispatcher, type ComponentProps } from 'svelte'
  import StakingCard from '../../../../lib/staking-card/StakingCard.svelte'
  import ReadyToClaim from '../ready-to-claim/ReadyToClaim.svelte'
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import BigNumber from 'bignumber.js'
  import { writable } from 'svelte/store'
  import { formatXRDValue } from '@utils'
  import TopValidatorWarning from '../TopValidatorWarning.svelte'
  import { track } from '@dashboard/routes/+layout.svelte'

  export let staked: ComponentProps<StakingCard>['staking']
  export let unstaking: ComponentProps<StakingCard>['unstaking']
  export let readyToClaim: ComponentProps<StakingCard>['readyToClaim']
  export let claimText: ComponentProps<StakingCard>['claimText']
  export let validatorAddress: Promise<string>
  export let acceptsStake: Promise<boolean>
  export let showTopValidatorWarning: Promise<boolean>

  const isUnstaking = writable(false)

  $: unstaking.then((amount) => {
    $isUnstaking = new BigNumber(amount).gt(0)
  })

  const dispatchEvent = createEventDispatcher<{
    'add-stake': undefined
    unstake: undefined
    claim: undefined
  }>()

  let extension = false

  $: showTopValidatorWarning.then((show) => {
    extension = show
  })
</script>

<div class:extension>
  <StakingCard
    staking={staked}
    {unstaking}
    {readyToClaim}
    {claimText}
    on:click={() => {
      track('click:validator-details-claim')
      dispatchEvent('claim')
    }}
  >
    <div slot="staking-section" class="stake-unstake">
      {#await Promise.all([staked, acceptsStake]) then [staked, acceptsStake]}
        <button
          class="stake-unstake-button"
          class:disabled={!acceptsStake}
          disabled={!acceptsStake}
          on:click={() => {
            track('click:validator-details-add-stake')
            dispatchEvent('add-stake')
          }}>Add Stake</button
        >
        {#if new BigNumber(staked).gt(0)}
          <button
            class="stake-unstake-button"
            on:click={() => {
              track('click:validator-details-unstake')
              dispatchEvent('unstake')
            }}>Request Unstake</button
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
                <div slot="text" let:timeToClaimText let:amount class="subtext">
                  Ready to claim {formatXRDValue(amount)} in approx. {timeToClaimText}
                </div>
              </ReadyToClaim>
            {/await}
          </div>
        {/if}
      {/await}
    </div>
  </StakingCard>
</div>
{#await showTopValidatorWarning then show}
  {#if show}
    <TopValidatorWarning />
  {/if}
{/await}

<style lang="scss">
  .extension {
    :global(.staking-card) {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: none;
    }
  }

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

  .disabled {
    cursor: not-allowed;
    pointer-events: all;
  }
</style>
