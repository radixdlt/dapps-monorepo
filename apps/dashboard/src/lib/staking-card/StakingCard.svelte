<script lang="ts">
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import Button from '@components/_base/button/ButtonNew.svelte'
  import Icon from '@components/_base/icon/IconNew.svelte'
  import { formatTokenValue } from '@utils'
  import StakingIcon from '@icons/staking.svg'
  import UnstakingIcon from '@icons/unstaking.svg'
  import ClaimIcon from '@icons/claim.svg'
  import BigNumber from 'bignumber.js'
  import StakingCardSection from './StakingCardSection.svelte'

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
    <StakingCardSection icon={StakingIcon} titleText="STAKED" amount={staking}>
      <div class:slot-section={showSlotSection}>
        <slot name="staking-section" />
      </div>
    </StakingCardSection>
  </div>
  <div class="section">
    <StakingCardSection
      icon={UnstakingIcon}
      titleText="UNSTAKING"
      amount={unstaking}
    >
      <div class:slot-section={showSlotSection}>
        <slot name="unstaking-section" />
      </div>
    </StakingCardSection>
  </div>
  <div class="section last-section">
    <StakingCardSection
      icon={ClaimIcon}
      titleText="READY TO CLAIM"
      amount={readyToClaim}
    >
      <div class:slot-section={showSlotSection}>
        <slot name="claim-section" />
      </div>
    </StakingCardSection>
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

  .slot-section {
    height: 2.5rem;
  }
</style>
