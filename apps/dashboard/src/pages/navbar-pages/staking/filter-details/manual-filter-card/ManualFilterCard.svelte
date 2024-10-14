<script lang="ts">
  import type { UptimeValue } from '@api/utils/entities/component/validator'
  import PercentageInput from '@components/_base/input/PercentageInput.svelte'
  import UptimeSelector from '@dashboard/lib/validators/UptimeSelector.svelte'

  type T = $$Generic

  export let selected: UptimeValue
  export let percentage = 0
</script>

<div class="manual-filter-card">
  <div class="value-card">
    <div class="row">
      <div class="text">MIN UPTIME (%)</div>
      <PercentageInput bind:value={percentage} />
    </div>
    <span class="text"> OVER THE PAST </span>
    <UptimeSelector bind:selected --uptime-selector-width="7rem" />
  </div>
</div>

<style lang="scss">
  @use '../shared.scss';

  .manual-filter-card {
    padding: var(--spacing-2xl);
    width: 100%;
  }

  .value-card {
    .row {
      display: flex;
      gap: var(--spacing-lg);
      align-items: center;
    }
    .text {
      font-size: var(--card-text-size);
      color: var(--card-text-color);
    }
  }
</style>
