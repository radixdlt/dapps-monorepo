<script lang="ts">
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'
  import Button from '@components/_base/button/ButtonNew.svelte'
  import Icon from '@components/_base/icon/IconNew.svelte'
  import { formatTokenValue } from '@utils'
  import StakingIcon from '@icons/staking.svg'
  import UnstakingIcon from '@icons/unstaking.svg'
  import ClaimIcon from '@icons/claim.svg'
  import BigNumber from 'bignumber.js'

  export let staking: Promise<string>
  export let unstaking: Promise<string>
  export let readyToClaim: Promise<string>
  export let claimText: string

  $: showSlotSection =
    !!$$slots['staking-section'] ||
    !!$$slots['unstaking-section'] ||
    !!$$slots['claim-section']
</script>

<div class="card staking-card">
  <div class="section">
    <div class="stake-display">
      <div class="text-with-icon">
        <Icon icon={StakingIcon} --size="1.5rem" />
        <div class="title-text">STAKED</div>
      </div>
      <div class="amount-text">
        {#await staking}
          <SkeletonLoader />
        {:then staking}
          {formatTokenValue(staking).displayValue} XRD
        {/await}
      </div>
      <div class:slot-section={showSlotSection}>
        <slot name="staking-section" />
      </div>
    </div>
  </div>
  <div class="section">
    <div class="stake-display">
      <div class="text-with-icon">
        <Icon icon={UnstakingIcon} --size="1.5rem" />
        <div class="title-text">UNSTAKING</div>
      </div>
      <div class="amount-text">
        {#await unstaking}
          <SkeletonLoader />
        {:then unstaking}
          {formatTokenValue(unstaking).displayValue} XRD
        {/await}
      </div>
      <div class:slot-section={showSlotSection}>
        <slot name="unstaking-section" />
      </div>
    </div>
  </div>
  <div class="section last-section">
    <div class="stake-display">
      <div class="text-with-icon">
        <Icon icon={ClaimIcon} --size="1.5rem" />
        <div class="title-text">READY TO CLAIM</div>
      </div>
      <div class="amount-text">
        {#await readyToClaim}
          <SkeletonLoader />
        {:then readyToClaim}
          {formatTokenValue(readyToClaim).displayValue} XRD
        {/await}
      </div>
      <div class:slot-section={showSlotSection}>
        <slot name="claim-section" />
      </div>
    </div>
    <div>
      {#await readyToClaim}
        <Button disabled={true} size="big" on:click>{claimText}</Button>
      {:then readyToClaim}
        <Button disabled={new BigNumber(readyToClaim).eq(0)} size="big" on:click
          >{claimText}</Button
        >
      {/await}
    </div>
  </div>
</div>

<style lang="scss">
  .staking-card {
    display: grid;
    grid: 1fr / auto auto auto;
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
    max-width: 80rem;
  }

  .section {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-right: var(--border-divider) var(--theme-border);
    padding: 0 var(--spacing-lg);
  }

  .last-section {
    border-right: none;
    display: flex;
    gap: var(--spacing-xl);
  }

  .text-with-icon {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: var(--spacing-sm);
  }

  .title-text {
    font-weight: var(--font-weight-bold-1);
    color: var(--color-grey-2);
  }

  .amount-text {
    font-weight: var(--font-weight-bold-3);
    font-size: var(--text-2xl);
  }

  .stake-display {
    display: flex;
    flex-direction: column;
  }

  .slot-section {
    height: 2.5rem;
  }
</style>
