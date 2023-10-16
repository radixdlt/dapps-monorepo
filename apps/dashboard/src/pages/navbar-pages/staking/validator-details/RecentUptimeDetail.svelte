<script lang="ts">
  import type { Validator } from '@api/utils/entities/validator'
  import SimplePicker from '@components/_base/picker/simple-picker/SimplePicker.svelte'
  import type { UptimeValue } from '../validator-list/UptimeHeader.svelte'
  import { truncateNumber } from '@utils'

  export let uptimes: Validator<unknown, true, unknown>['uptimePercentages']

  const options: {
    label: string
    value: UptimeValue
  }[] = [
    { label: '1 Day', value: '1day' },
    { label: '1 Week', value: '1week' },
    { label: '1 Months', value: '1month' },
    { label: '3 Months', value: '3months' },
    { label: '6 Months', value: '6months' },
    { label: '1 Year', value: '1year' },
    { label: 'All Time', value: 'alltime' }
  ]

  let selected: (typeof options)[number] = options[6]
</script>

<div class="uptime-detail">
  <div class="picker">
    <SimplePicker {options} bind:selected />
  </div>
  {uptimes[selected.value] > 0
    ? `${truncateNumber(uptimes[selected.value])}%`
    : 'Not Measurable'}
</div>

<style>
  .uptime-detail {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .picker {
    width: 8rem;
  }
</style>
