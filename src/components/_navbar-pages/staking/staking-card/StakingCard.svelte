<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import Button from '@components/_base/button/ButtonNew.svelte'
  import Icon from '@components/_base/icon/IconNew.svelte'

  export let staking: Promise<number>
  export let unstaking: Promise<number>
  export let readyToClaim: Promise<number>
</script>

<div id="staking-card">
  <div class="section">
    <div class="stake-display">
      <div class="text-with-icon">
        <Icon type="staking" size="small" />
        <div class="title-text">STAKING</div>
      </div>
      <div class="amount-text">
        {#await staking}
          <SkeletonLoader />
        {:then staking}
          {staking} XRD
        {/await}
      </div>
    </div>
  </div>
  <div class="section">
    <div class="stake-display">
      <div class="text-with-icon">
        <Icon type="unstaking" size="small" />
        <div class="title-text">UNSTAKING</div>
      </div>
      <div class="amount-text">
        {#await unstaking}
          <SkeletonLoader />
        {:then unstaking}
          {unstaking} XRD
        {/await}
      </div>
    </div>
  </div>
  <div class="section last-section">
    <div class="stake-display">
      <div class="title-text">READY TO CLAIM</div>
      <div class="amount-text">
        {#await readyToClaim}
          <SkeletonLoader />
        {:then readyToClaim}
          {readyToClaim} XRD
        {/await}
      </div>
    </div>
    <Button size="big">Claim All</Button>
  </div>
</div>

<style lang="scss">
  @use '../../../../mixins.scss';
  #staking-card {
    @include mixins.card;
    display: grid;
    grid: 1fr / 1fr 1fr 1fr;
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
    min-width: 60rem;
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
