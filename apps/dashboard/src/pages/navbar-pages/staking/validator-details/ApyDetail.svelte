<script lang="ts">
  import { type UptimeValue } from '@api/utils/entities/component/validator'
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import { uptimeModule } from '@dashboard/lib/validators/uptime-module'
  import { truncateNumber } from '@utils'
  import { onMount } from 'svelte'
  import type { TransformedValidator } from '../validator-list/ValidatorList.svelte'

  export let validator: {
    typed: {
      type: 'String'
      value: TransformedValidator
    }
  }

  let selected: UptimeValue = '1month'
  let isLoading: boolean
  let validatorsUptimeData = uptimeModule.getDataForUptime(selected)

  onMount(() => {
    const subscription = uptimeModule.isLoading$.subscribe((data) => {
      isLoading = data
      validatorsUptimeData = uptimeModule.getDataForUptime(selected)
    })

    return () => {
      subscription.unsubscribe()
    }
  })
  $: {
    validatorsUptimeData = uptimeModule.getDataForUptime(selected)
    isLoading
  }
</script>

{#key isLoading}
  <div class="uptime-detail">
    {#if validatorsUptimeData && Object.keys(validatorsUptimeData).length > 0}
      {@const data = validator.typed.value}

      {validator.typed.value.percentageTotalStake
        ? `${truncateNumber(uptimeModule.getApy(data.validator, selected))}%`
        : 'N/A'}
    {:else}
      <SkeletonLoader width={50} />
    {/if}
  </div>
{/key}

<style>
  .uptime-detail {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
  }
</style>
