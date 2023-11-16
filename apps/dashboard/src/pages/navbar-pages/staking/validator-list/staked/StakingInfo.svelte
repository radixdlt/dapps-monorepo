<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'
  import { formatTokenValue, formatXRDValue } from '@utils'
  import BigNumber from 'bignumber.js'
  import ReadyToClaim from '../../ready-to-claim/ReadyToClaim.svelte'
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import { accumulatedStakes } from '../../../../../routes/(navbar-pages)/network-staking/(load-validators)/(load-staking-data)/+layout.svelte'
  import type { TransformedValidator } from '../ValidatorList.svelte'

  export let validator: Promise<TransformedValidator>

  const dispatch = createEventDispatcher<{
    'claim-validator': string
  }>()
</script>

<div class="staking-box">
  <div class="staking-box-grid">
    <div class="amount-display">
      <div class="amount-title">STAKED</div>
      {#await Promise.all([validator, $accumulatedStakes])}
        <SkeletonLoader width={30} />
      {:then [info, stakes]}
        <div class="amount-value">
          {formatTokenValue(stakes[info.address].accumulatedStakes)
            .displayValue}
        </div>
      {/await}
    </div>
    <div class="amount-display">
      <div class="amount-title">UNSTAKING</div>
      {#await Promise.all([validator, $accumulatedStakes])}
        <SkeletonLoader width={30} />
      {:then [info, stakes]}
        <div class="amount-value">
          {formatTokenValue(stakes[info.address].accumulatedUnstaking)
            .displayValue}
        </div>
      {/await}
    </div>
    {#await Promise.all([validator, $accumulatedStakes]) then [info, stakes]}
      {#if new BigNumber(stakes[info.address].accumulatedUnstaking).gt(0)}
        <ReadyToClaim validatorAddress={info.address}>
          <div
            class="ready-to-claim-text"
            slot="text"
            let:amount
            let:timeToClaimText
          >
            (ready to claim {formatXRDValue(amount)} in approx. {timeToClaimText})
          </div>
        </ReadyToClaim>
      {/if}
    {/await}

    {#await Promise.all([validator, $accumulatedStakes]) then [info, stakes]}
      {#if new BigNumber(stakes[info.address].accumulatedReadyToClaim).gt(0)}
        <ButtonNew
          size="small"
          on:click={() => {
            dispatch('claim-validator', info.address)
          }}
          >Ready to Claim {formatXRDValue(
            stakes[info.address].accumulatedReadyToClaim
          )}</ButtonNew
        >
      {/if}
    {/await}
  </div>
</div>

<style lang="scss">
  .staking-box {
    padding: var(--spacing-lg) var(--spacing-2xl);
    display: flex;
    align-items: center;
    border: var(--border) var(--theme-border);
    border-top: none;
    border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
    background: var(--theme-surface-1);
  }

  .staking-box-grid {
    display: grid;
    grid: 1fr / auto auto auto auto;
    gap: var(--spacing-lg);
    align-items: center;
  }

  .amount-display {
    display: grid;
    grid: 1fr / auto 1fr;
    gap: var(--spacing-sm);
  }

  .amount-title {
    color: var(--theme-subtext);
    font-weight: var(--font-weight-bold-2);
  }

  .amount-value {
    color: var(--color-grey-1);
    font-weight: var(--font-weight-bold-2);
  }

  .ready-to-claim-text {
    color: var(--theme-subtext);
  }
</style>
