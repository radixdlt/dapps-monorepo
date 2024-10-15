<script lang="ts">
  import { type UptimeValue } from '@api/utils/entities/component/validator'
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import { uptimeModule } from '@dashboard/lib/validators/uptime-module'
  import { truncateNumber } from '@utils'
  import type { TransformedValidator } from '../validator-list/ValidatorList.svelte'

  export let validator: {
    typed: {
      type: 'String'
      value: TransformedValidator
    }
  }

  let isLoading = uptimeModule.isLoading
  let lastQueriedUptime = uptimeModule.lastQueriedUptime
</script>

<div class="uptime-detail">
  {#key $isLoading}
    {#if uptimeModule}
      {@const validatorsUptimeData =
        uptimeModule.getDataForUptime($lastQueriedUptime)}
      {#if validatorsUptimeData && Object.keys(validatorsUptimeData).length > 0}
        {@const data = validator.typed.value}

        {validator.typed.value.percentageTotalStake
          ? `${truncateNumber(
              uptimeModule.getApy(data.validator, $lastQueriedUptime)
            )}%`
          : 'N/A'}
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
