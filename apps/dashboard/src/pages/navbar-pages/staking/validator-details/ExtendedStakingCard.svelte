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
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  export let staked: ComponentProps<StakingCard>['staking']
  export let unstaking: ComponentProps<StakingCard>['unstaking']
  export let readyToClaim: ComponentProps<StakingCard>['readyToClaim']
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
  <StakingCard staking={staked} {unstaking} {readyToClaim}>
    <div slot="staking-section">
      {#await Promise.all([staked, acceptsStake]) then [staked, acceptsStake]}
        <ButtonNew
          secondary
          disabled={!acceptsStake}
          on:click={() => {
            track('click:validator-details-add-stake')
            dispatchEvent('add-stake')
          }}>Add Stake</ButtonNew
        >

        <ButtonNew
          secondary
          disabled={!BigNumber(staked).gt(0)}
          on:click={() => {
            track('click:validator-details-unstake')
            dispatchEvent('unstake')
          }}>Unstake</ButtonNew
        >
      {/await}
    </div>
    <div slot="unstaking-section">
      {#await unstaking then amount}
        {#if new BigNumber(amount).gt(0)}
          {#await validatorAddress}
            <SkeletonLoader />
          {:then validatorAddress}
            <ReadyToClaim {validatorAddress}>
              <div slot="text" let:timeToClaimText let:amount class="subtext">
                Ready to claim {formatXRDValue(amount)} in approx. {timeToClaimText}
              </div>
            </ReadyToClaim>
          {/await}
        {/if}
      {/await}
    </div>
    <div slot="claim-section">
      {#await readyToClaim}
        <ButtonNew disabled={true} size="big" on:click>Claim</ButtonNew>
      {:then readyToClaim}
        <ButtonNew
          disabled={new BigNumber(readyToClaim).eq(0)}
          size="big"
          on:click={() => {
            track('click:validator-details-claim')
            dispatchEvent('claim')
          }}>Claim</ButtonNew
        >
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
  [slot='staking-section'],
  [slot='claim-section'] {
    margin-top: var(--spacing-lg);
  }

  [slot='staking-section'] {
    display: flex;
    gap: var(--spacing-sm);
  }

  .disabled {
    cursor: not-allowed;
    pointer-events: all;
  }
</style>
