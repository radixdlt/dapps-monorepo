<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import Button from '@components/_base/button/ButtonNew.svelte'
  import Icon from '@components/_base/icon/IconNew.svelte'
  import { formatAmount } from '@utils'
  import StakingIcon from '@icons/staking.svg'
  import UnstakingIcon from '@icons/unstaking.svg'
  import ClaimIcon from '@icons/claim.svg'

  export let staking: Promise<number>
  export let unstaking: Promise<number>
  export let readyToClaim: Promise<number>
  export let claimText: string
</script>

<div id="staking-card">
  <div class="section">
    <div class="stake-display">
      <div class="text-with-icon">
        <Icon icon={StakingIcon} --size="1.5rem" />
        <div class="title-text">STAKING</div>
      </div>
      <div class="amount-text">
        {#await staking}
          <SkeletonLoader />
        {:then staking}
          {formatAmount(staking)} XRD
        {/await}
      </div>
      <slot name="staking-section" />
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
          {formatAmount(unstaking)} XRD
        {/await}
      </div>
      <slot name="unstaking-section" />
    </div>
  </div>
  <div class="section last-section">
    <div class="stake-display">
      <div class="text-with-icon">
        <Icon icon={ClaimIcon} --size="2rem" />
        <div class="title-text">READY TO CLAIM</div>
      </div>
      <div class="amount-text">
        {#await readyToClaim}
          <SkeletonLoader />
        {:then readyToClaim}
          {formatAmount(readyToClaim)} XRD
        {/await}
      </div>
      <slot name="claim-section" />
    </div>
    <div>
      <Button size="big">{claimText}</Button>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../../../../../packages/ui/src/mixins.scss';
  #staking-card {
    @include mixins.card;
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
    gap: var(--spacing-lg);
    border-right: var(--border-divider);
  }

  .last-section {
    border-right: none;
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
    font-size: var(--text-3xl);
  }

  .stake-display {
    display: flex;
    flex-direction: column;
  }
</style>
