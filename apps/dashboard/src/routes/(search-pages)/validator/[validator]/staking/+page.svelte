<script lang="ts">
  import { validatorsCacheModule } from '@api/utils/validators-cache-module'
  import type { PageData } from './$types'

  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import StakedValidatorCard from '@dashboard/lib/staking-card/StakedValidatorCard.svelte'

  export let data: PageData

  $: {
    data.promises.stakeInfo.then((data) => {
      validatorsCacheModule.queryValidators(
        Object.values(data.accumulatedStakes).map(
          (stake) => stake.validatorAddress
        )
      )
    })
  }
</script>

<div class="validators">
  {#await data.promises.stakeInfo}
    <SkeletonLoader />
  {:then validators}
    {#each Object.values(validators.accumulatedStakes) as validatorStakes}
      <StakedValidatorCard {validatorStakes} />
    {/each}
  {/await}
</div>

<style lang="scss">
  .validators {
    @include mixins.desktop {
      display: flex;
    }

    gap: var(--spacing-2xl);

    :global(.validator-card) {
      margin-top: var(--spacing-2xl);
    }
  }
</style>
