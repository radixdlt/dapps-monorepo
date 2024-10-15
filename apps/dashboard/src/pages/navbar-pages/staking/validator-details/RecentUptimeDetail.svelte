<script lang="ts">
  import { type UptimeValue } from '@api/utils/entities/component/validator'
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import { uptimeModule } from '@dashboard/lib/validators/uptime-module'
  import UptimeSelector from '@dashboard/lib/validators/UptimeSelector.svelte'
  import { truncateNumber } from '@utils'

  export let validatorAddress: string

  let selected: UptimeValue = '1month'

  const isLoading = uptimeModule.isLoading
</script>

<div class="uptime-detail">
  <UptimeSelector bind:selected --uptime-selector-width="8rem" />
  {#key $isLoading}
    {#if uptimeModule}
      {@const validatorsUptimeData = uptimeModule.getDataForUptime(selected)}
      {#if validatorsUptimeData && Object.keys(validatorsUptimeData).length > 0}
        {@const uptime = validatorsUptimeData[validatorAddress]}
        {uptime ? `${truncateNumber(uptime)}%` : 'Not Measurable'}
      {:else}
        <SkeletonLoader width={50} />
      {/if}
    {/if}
  {/key}
</div>

<style>
  .uptime-detail {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
  }
</style>
