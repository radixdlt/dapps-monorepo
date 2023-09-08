<script lang="ts" context="module">
  import type { Validator } from '@api/utils/entities/validator'

  export type UptimeValue = keyof Validator['uptimePercentages']
</script>

<script lang="ts">
  import SimplePicker from '@components/_base/picker/simple-picker/SimplePicker.svelte'
  import BasicHeader from '@components/_base/table/basic-header/BasicHeader.svelte'
  import type { ComponentProps } from 'svelte'

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

  export let selected: (typeof options)[number] = options[6]
  export let sorting: ComponentProps<BasicHeader>['sorting'] = undefined
</script>

<div class="header">
  <BasicHeader on:click {sorting}>uptime</BasicHeader>

  <div class="picker">
    <SimplePicker {options} bind:selected />
  </div>
</div>

<style lang="scss">
  .header {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
    justify-content: center;
    margin: 0 var(--spacing-lg);

    .picker {
      min-width: 8rem;
    }
  }
</style>
