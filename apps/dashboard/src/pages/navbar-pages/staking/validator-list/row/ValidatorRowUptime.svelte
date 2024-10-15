<script lang="ts">
  import { truncateNumber } from '@utils'
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import { uptimeModule } from '@dashboard/lib/validators/uptime-module'
  import type { ValidatorRowInput } from '../ValidatorRow.svelte'

  export let input: ValidatorRowInput

  const isLoading = uptimeModule.isLoading
</script>

<span class="mobile-only apy-text-box-label">Uptime</span>
{#key $isLoading}
  {#if input === 'loading'}
    <SkeletonLoader width={80} />
  {:else}
    {@const validators = uptimeModule.getDataForUptime(input.selectedUptime)}
    {#if validators && Object.keys(validators).length > 0}
      {@const uptime = validators[input.validator.address]}
      {uptime ? `${truncateNumber(uptime)}%` : 'Not Measurable'}
    {:else}
      <SkeletonLoader width={70} />
    {/if}
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
