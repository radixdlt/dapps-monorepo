<script lang="ts">
  import { truncateNumber } from '@utils'
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import { uptimeModule } from '@dashboard/lib/validators/uptime-module'
  import type { ValidatorRowInput } from '../ValidatorRow.svelte'

  export let input: ValidatorRowInput

  const isLoading = uptimeModule.isLoading
</script>

<span class="mobile-only apy-text-box-label">Apy</span>
{#key $isLoading}
  {#if input === 'loading'}
    <SkeletonLoader width={80} />
  {:else}
    {@const validators = uptimeModule.getDataForUptime(input.selectedUptime)}
    {@const apy = uptimeModule.getApy(
      input.validator.validator,
      input.selectedUptime
    )}
    <div>
      {#if validators && Object.keys(validators).length > 0}
        {input.validator.percentageTotalStake && apy
          ? `${truncateNumber(apy)}%`
          : 'N/A'}
        {#if input.validator.percentageTotalStake}
          <span class="subtext">per year</span>
        {/if}
      {:else}
        <SkeletonLoader width={70} />
      {/if}
    </div>
  {/if}
{/key}

<style lang="scss">
  .apy-text-box-label {
    text-transform: uppercase;
    display: block;
    font-size: var(--text-sm);
    color: var(--color-grey-2);
  }
</style>
