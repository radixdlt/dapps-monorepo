<script lang="ts">
  import { createEventDispatcher, type ComponentProps } from 'svelte'
  import type ValidatorRow from '../ValidatorRow.svelte'
  import { accumulatedStakes } from '../../../../../routes/(navbar-pages)/network-staking/+layout.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { formatTokenValue, formatXRDValue } from '@utils'
  import BigNumber from 'bignumber.js'
  import ReadyToClaim from '../../ready-to-claim/ReadyToClaim.svelte'
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'

  export let validator: ComponentProps<ValidatorRow>['validator']

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
          <div class="ready-to-claim-text" slot="text" let:amount let:days>
            (ready to claim {formatXRDValue(amount)} in approx. {days} days)
          </div>
        </ReadyToClaim>
      {/if}
    {/await}
    <div class="claim-button">
      {#await Promise.all([validator, $accumulatedStakes]) then [info, stakes]}
        {#if new BigNumber(stakes[info.address].accumulatedReadyToClaim).gt(0)}
          <ButtonNew
            size="small"
            on:click={() => {
              dispatch('claim-validator', info.address)
            }}
            >ready to claim {formatXRDValue(
              stakes[info.address].accumulatedReadyToClaim
            )}</ButtonNew
          >
        {/if}
      {/await}
    </div>
  </div>
</div>

<style>
  .staking-box {
    display: flex;
    align-items: center;
    border: var(--border) var(--theme-border);
    border-top: none;
    border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
    background: var(--theme-surface-1);
    padding: var(--spacing-md) 0;
    box-shadow: var(--shadow);
  }

  .staking-box-grid {
    display: grid;
    grid: 1fr/ 1fr 1fr 2fr 3fr;
    margin-left: 1.5rem;
    gap: var(--spacing-sm);
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

  .claim-button {
    width: 15rem;
  }

  .ready-to-claim-text {
    color: var(--theme-subtext);
  }
</style>
