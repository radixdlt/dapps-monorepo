<script lang="ts">
  import StakingCardSection from '@dashboard/lib/staking-card/StakingCardSection.svelte'
  import StakingIcon from '@icons/staking.svg'
  import UnstakingIcon from '@icons/unstaking.svg'
  import ClaimIcon from '@icons/claim.svg'
  import Tags from '@components/_base/tags/Tags.svelte'

  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import StakedValidatorCard from '@dashboard/lib/staking-card/StakedValidatorCard.svelte'
  import type { LayoutDataStakeInfo } from '../summary/summary'
  import NoTokens from './NoTokens.svelte'

  export let stakeInfo: Promise<LayoutDataStakeInfo>
  export let withSummary: boolean

  $: splitValidators = stakeInfo.then((stakeInfo) => {
    const values = Object.values(stakeInfo.accumulatedStakes)
    const splitPoint = Math.ceil(values.length / 2)
    return [
      values.slice(0, splitPoint),
      values.slice(splitPoint, values.length)
    ] as const
  })
</script>

{#if withSummary}
  <div class="card">
    <h3>Radix Network XRD Stake Summary</h3>
    <div class="card-content">
      <StakingCardSection
        icon={StakingIcon}
        titleText="STAKED"
        amount={stakeInfo.then((data) => data.totalStaked)}
      />
      <StakingCardSection
        icon={UnstakingIcon}
        titleText="UNSTAKING"
        amount={stakeInfo.then((data) => data.totalUnstaking)}
      />
      <StakingCardSection
        icon={ClaimIcon}
        titleText="READY TO CLAIM"
        amount={stakeInfo.then((data) => data.totalReadyToClaim)}
      />
    </div>

    <div class="card-footer">
      <Tags tags={[]} showNetworkTag />
    </div>
  </div>
{:else}
  {#await stakeInfo then data}
    {#if data.totalStaked.eq(0) && data.totalUnstaking.eq(0) && data.totalReadyToClaim.eq(0)}
      <NoTokens>No staking tokens found</NoTokens>
    {/if}
  {/await}
{/if}

<div class="validators">
  {#await splitValidators}
    <SkeletonLoader />
  {:then splitValidators}
    {#each splitValidators as validators}
      <div class="column">
        {#each validators as validatorStakes}
          <StakedValidatorCard {validatorStakes} />
        {/each}
      </div>
    {/each}
  {/await}
</div>

<style lang="scss">
  h3 {
    margin-bottom: 0;
  }

  .column {
    width: 100%;
  }

  .validators {
    @include mixins.desktop {
      display: flex;
    }

    gap: var(--spacing-2xl);

    :global(.validator-card) {
      margin-top: var(--spacing-2xl);
    }
  }

  .card-content {
    display: flex;

    @include mixins.desktop {
      padding: var(--spacing-2xl) 0;

      & > :global(.stake-display) {
        flex-grow: 1;
        padding: 0 var(--spacing-2xl);

        &:first-child {
          padding-left: 0;
        }

        &:last-child {
          padding-right: 0;
        }

        &:not(:last-child) {
          border-right: var(--border-divider) var(--theme-border);
        }
      }
    }

    @include mixins.mobile {
      flex-direction: column;

      & > :global(.stake-display) {
        padding: var(--spacing-xl) 0;

        &:not(:last-child) {
          border-bottom: var(--border-divider) var(--theme-border);
        }
      }
    }
  }
  .card-footer {
    padding: var(--spacing-lg) var(--spacing-2xl);
    display: flex;
    align-items: center;
    border: var(--border) var(--theme-border);
    border-top: none;
    border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
    background: var(--theme-surface-1);
    margin: 0 calc(-1 * var(--spacing-2xl)) calc(-1 * var(--spacing-2xl));
  }
</style>
