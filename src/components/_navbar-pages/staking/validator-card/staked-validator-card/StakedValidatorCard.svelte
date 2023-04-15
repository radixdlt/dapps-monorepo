<script lang="ts">
  import Icon from '@components/_base/icon/IconNew.svelte'
  import ValidatorCard from '../ValidatorCard.svelte'
  import type { ComponentProps } from 'svelte'

  export let validatorInfo: ComponentProps<ValidatorCard>
  export let stakedAmount: number
  export let unstakingAmount: number
  export let readyToClaim: number

  let bookmarked: boolean
</script>

<div class="validator-list-card">
  <ValidatorCard {...validatorInfo}>
    <div
      slot="icon"
      class="bookmark"
      on:click={() => {
        bookmarked = !bookmarked
      }}
    >
      <Icon
        size="small"
        type={bookmarked ? 'bookmarkFilled' : 'bookmarkEmpty'}
      />
    </div>
  </ValidatorCard>
  <div class="staking-box">
    <div class="staking-box-grid">
      <div class="amount-display">
        <div class="amount-title">STAKED</div>
        <div class="amount-value">{stakedAmount}</div>
      </div>
      <div class="amount-display">
        <div class="amount-title">UNSTAKING</div>
        <div class="amount-value">{unstakingAmount}</div>
      </div>
      <div class="ready-to-claim-text">(ready to claim in approx. 8 days)</div>
      <div class="links">
        <a>add a reminder to calendar</a>
        <a>ready to claim {readyToClaim} XRD</a>
      </div>
    </div>
  </div>
</div>

<style>
  .validator-list-card :global(.validator-card) {
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    border-bottom: none;
  }

  .validator-list-card :global(.validator-card:hover) {
    transform: none;
  }

  .validator-list-card {
    display: grid;
    grid: 1fr 0.5fr / 1fr;
    box-shadow: var(--shadow);
    transition: var(--transition-hover-card);
  }

  .validator-list-card:hover {
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
    width: 60%;
    margin-left: 1.5rem;
    gap: var(--spacing-sm);
    align-items: center;
  }

  .amount-display {
    display: grid;
    grid: 1fr / 1fr 1fr;
    gap: var(--spacing-sm);
  }

  .amount-title {
    color: var(--color-grey-2);
    font-weight: var(--font-weight-bold-2);
    justify-self: end;
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

  .bookmark {
    cursor: pointer;
  }
</style>
