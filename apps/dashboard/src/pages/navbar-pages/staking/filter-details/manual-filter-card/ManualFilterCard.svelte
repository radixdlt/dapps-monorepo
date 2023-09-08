<script lang="ts">
  import PercentageInput from '@components/_base/input/PercentageInput.svelte'
  import SimplePicker from '@components/_base/picker/simple-picker/SimplePicker.svelte'

  type T = $$Generic

  export let options: {
    label: string
    value: T
  }[]
  export let selected: (typeof options)[number]
  export let percentage = 0
</script>

<div class="manual-filter-card">
  <div class="value-card">
    <div class="row">
      <div id="text">MIN UPTIME (%)</div>
      <div class="picker">
        <SimplePicker {options} bind:selected />
      </div>
    </div>
    <PercentageInput bind:value={percentage} />
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
      gap: var(--spacing-md);
      align-items: center;
      min-width: 15rem;

      #text {
        font-size: var(--card-text-size);
        color: var(--card-text-color);
      }

      .picker {
        width: 8rem;
      }
    }
  }
</style>
