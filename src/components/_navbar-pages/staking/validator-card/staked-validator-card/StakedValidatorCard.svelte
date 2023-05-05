<script lang="ts">
  import Icon from '@components/_base/icon/IconNew.svelte'
  import ValidatorCard from '../ValidatorCard.svelte'
  import type { ComponentProps } from 'svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { formatAmount } from '@utils'
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'

  export let validatorInfo: ComponentProps<ValidatorCard>['validatorInfo']

  export let stakingInfo: Promise<{
    staked: number
    unstaking: number
    readyToClaim: number
  }>
</script>

<div class="staked-validator-card">
  <ValidatorCard {validatorInfo} on:selected on:unselected>
    <Icon slot="icon" size="large" type="staking" />
  </ValidatorCard>
  <div class="staking-box">
    <div class="staking-box-grid">
      <div class="amount-display">
        <div class="amount-title">STAKED</div>
        {#await stakingInfo}
          <SkeletonLoader width={30} />
        {:then stakingInfo}
          <div class="amount-value">{formatAmount(stakingInfo.staked)}</div>
        {/await}
      </div>
      <div class="amount-display">
        <div class="amount-title">UNSTAKING</div>
        {#await stakingInfo}
          <SkeletonLoader width={30} />
        {:then stakingInfo}
          <div class="amount-value">{formatAmount(stakingInfo.unstaking)}</div>
        {/await}
      </div>
      {#await validatorInfo then}
        <div class="ready-to-claim-text">
          (ready to claim in approx. 8 days)
        </div>
      {/await}
      <div class="links">
        {#await stakingInfo then stakingInfo}
          <a>add a reminder to calendar</a>
          <ButtonNew size="small"
            >ready to claim {formatAmount(stakingInfo.readyToClaim)} XRD</ButtonNew
          >
        {/await}
      </div>
    </div>
  </div>
</div>

<style>
  .staked-validator-card :global(#validator-card) {
    border-radius: var(--border-radius) var(--border-radius) 0 0;
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
    border-radius: var(--border-radius);
  }

  .staked-validator-card:hover {
    transform: var(--transform-hover-card);
    box-shadow: var(--shadow-hover);
  }

  .staking-box {
    display: flex;
    align-items: center;
    border: var(--border);
    border-top: none;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    background: var(--color-grey-5);
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
    color: var(--color-grey-2);
    font-weight: var(--font-weight-bold-2);
  }

  .amount-value {
    color: var(--color-grey-1);
    font-weight: var(--font-weight-bold-2);
  }

  .ready-to-claim-text {
    color: var(--color-grey-2);
  }

  .links {
    display: flex;
    gap: 1rem;
  }
</style>
