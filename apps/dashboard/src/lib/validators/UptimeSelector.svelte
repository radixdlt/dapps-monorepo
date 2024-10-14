<script lang="ts">
  import {
    uptimeUiOptions as options,
    type UptimeValue
  } from '@api/utils/entities/component/validator'
  import SimplePicker from '@components/_base/picker/simple-picker/SimplePicker.svelte'
  import { uptimeModule } from './uptime-module'

  export let selected: UptimeValue

  let selectedValue: (typeof options)[number]
  $: selected = selectedValue?.value
  $: {
    uptimeModule.maybeQueryUptime(selected)
  }
</script>

<div class="picker">
  <SimplePicker {options} bind:selected={selectedValue} />
</div>

<style lang="scss">
  .picker {
    width: var(--uptime-selector-width, 6rem);
    min-width: 6rem;
  }
</style>
