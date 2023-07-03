<script lang="ts">
  import Icon from '@components/_base/icon/IconNew.svelte'
  import ValidatorCard from '../ValidatorCard.svelte'
  import type { ComponentProps } from 'svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { formatAmount } from '@utils'
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import StakingIcon from '@icons/staking.svg'
  import { accumulatedStakes } from '../../../../../routes/(navbar-pages)/validators/+layout.svelte'
  import BigNumber from 'bignumber.js'
  import ReadyToClaim from '../../ready-to-claim/ReadyToClaim.svelte'

  export let validatorInfo: ComponentProps<ValidatorCard>['validatorInfo']
</script>

<div class="staked-validator-card">
  <ValidatorCard {validatorInfo} on:selected on:unselected on:click-validator>
    <Icon slot="icon" size="large" icon={StakingIcon} />
  </ValidatorCard>
  <div class="staking-box">
    <div class="staking-box-grid">
      <div class="amount-display">
        <div class="amount-title">STAKED</div>
        {#await Promise.all([validatorInfo, $accumulatedStakes])}
          <SkeletonLoader width={30} />
        {:then [info, stakes]}
          <div class="amount-value">
            {formatAmount(stakes[info.address].accumulatedStakes)}
          </div>
        {/await}
      </div>
      <div class="amount-display">
        <div class="amount-title">UNSTAKING</div>
        {#await Promise.all([validatorInfo, $accumulatedStakes])}
          <SkeletonLoader width={30} />
        {:then [info, stakes]}
          <div class="amount-value">
            {formatAmount(stakes[info.address].accumulatedUnstaking)}
          </div>
        {/await}
      </div>
      {#await Promise.all( [validatorInfo, $accumulatedStakes] ) then [info, stakes]}
        {#if new BigNumber(stakes[info.address].accumulatedUnstaking).gt(0)}
          <ReadyToClaim validatorAddress={info.address} />
        {/if}
      {/await}
      <div class="claim-button">
        {#await Promise.all( [validatorInfo, $accumulatedStakes] ) then [info, stakes]}
          {#if new BigNumber(stakes[info.address].accumulatedReadyToClaim).gt(0)}
            <ButtonNew size="small"
              >ready to claim {formatAmount(
                stakes[info.address].accumulatedReadyToClaim
              )} XRD</ButtonNew
            >
          {/if}
        {/await}
      </div>
    </div>
  </div>
</div>

<style>
  .staked-validator-card :global(#validator-card) {
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
    border-bottom: none;
  }

  .staked-validator-card :global(#validator-card:hover) {
    transform: none;
  }

  .staked-validator-card {
    display: grid;
    grid: 1fr 0.5fr / 1fr;
    box-shadow: var(--shadow);
    transition: var(--transition-hover-card);
    border-radius: var(--border-radius-lg);
  }

  .staked-validator-card:hover {
    transform: var(--transform-hover-card);
    box-shadow: var(--shadow-hover);
  }

  .staking-box {
    display: flex;
    align-items: center;
    border: var(--border) var(--theme-border);
    border-top: none;
    border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
    background: var(--theme-surface-1);
    padding: var(--spacing-md) 0;
  }

  .staking-box-grid {
    display: grid;
    grid: 1fr/ 1fr 1fr 2fr 3fr;
    width: 70rem;
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
</style>
