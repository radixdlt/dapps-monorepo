<script lang="ts">
  import StakingIcon from '@icons/staking.svg'
  import UnstakingIcon from '@icons/unstaking.svg'
  import ClaimIcon from '@icons/claim.svg'
  import StakingCardSection from './StakingCardSection.svelte'

  export let staking: Promise<string>
  export let unstaking: Promise<string>
  export let readyToClaim: Promise<string>
</script>

<div class="card staking-card">
  <div class="section">
    <StakingCardSection icon={StakingIcon} titleText="STAKED" amount={staking}>
      <slot name="staking-section" />
    </StakingCardSection>
  </div>
  <div class="section">
    <StakingCardSection
      icon={UnstakingIcon}
      titleText="UNSTAKING"
      amount={unstaking}
    >
      <slot name="unstaking-section" />
    </StakingCardSection>
  </div>
  <div class="section last-section">
    <StakingCardSection
      icon={ClaimIcon}
      titleText="READY TO CLAIM"
      amount={readyToClaim}
    >
      <slot name="claim-section" />
    </StakingCardSection>
    <slot name="additional-section" />
  </div>
</div>

<style lang="scss">
  .staking-card {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
    max-width: 80rem;

    @include mixins.desktop {
      flex-wrap: nowrap;
    }
  }

  .section {
    width: 100%;

    @include mixins.mobile {
      &:not(:last-child) {
        border-bottom: var(--border-divider) var(--theme-border);
        padding-bottom: var(--spacing-lg);
      }
    }
    @include mixins.desktop {
      width: 33.33%;
      border-right: var(--border-divider) var(--theme-border);
    }

    padding: 0 var(--spacing-lg);
  }

  .last-section {
    border-right: none;
    display: flex;
    gap: var(--spacing-xl);
  }
</style>
