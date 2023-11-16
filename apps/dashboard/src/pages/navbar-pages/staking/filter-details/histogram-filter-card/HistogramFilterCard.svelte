<script lang="ts">
  import PercentageInput from '@components/_base/input/PercentageInput.svelte'
  import HistogramFilter from './histogram-filter/HistogramFilter.svelte'
  import BigNumber from 'bignumber.js'

  export let values: number[]
  export let minText: string
  export let maxText: string
  export let min = 0
  export let max = 100
  export let range: [number, number] = [0, 100]

  $: range = [
    parseFloat(range[0].toFixed(2)),
    parseFloat(new BigNumber(range[1]).toFixed(2, BigNumber.ROUND_UP))
  ]
</script>

<div class="card filter-card">
  <HistogramFilter bind:range {values} {min} {max} />

  <div class="value-cards">
    <div class="value-card">
      <div class="text">
        {minText}
      </div>
      <div class="value">
        <PercentageInput bind:value={range[0]} />
      </div>
    </div>

    <div class="card value-card">
      <div class="text">
        {maxText}
      </div>
      <div class="value">
        <PercentageInput bind:value={range[1]} />
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../shared.scss';

  .filter-card {
    padding: var(--spacing-xl);
  }

  .value-cards {
    display: flex;
    gap: var(--spacing-2xl);
    justify-content: space-between;
    margin-top: var(--spacing-2xl);
  }

  .value-card {
    width: 100%;
    .text {
      font-size: var(--card-text-size);
      color: var(--card-text-color);
    }

    .value {
      display: flex;
      align-items: center;
      font-size: var(--card-value-size);
      font-weight: var(--card-value-weight);
    }
  }
</style>
