<script lang="ts">
  import HistogramFilter from './histogram-filter/HistogramFilter.svelte'

  export let values: number[]
  export let minText: string
  export let maxText: string
  export let min = 0
  export let max = 100
  export let lowValue: number
  export let highValue: number

  let range: [number, number] = [0, 100]

  $: lowValue = range[0]
  $: highValue = range[1]
</script>

<div id="filter-card">
  <HistogramFilter bind:range {values} {min} {max} />

  <div id="value-cards">
    <div class="value-card">
      <div id="text">
        {minText}
      </div>
      <div id="value">
        {lowValue.toFixed(2)}%
      </div>
    </div>

    <div class="value-card">
      <div id="text">
        {maxText}
      </div>
      <div id="value">
        {highValue.toFixed(2)}%
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../../../../../../packages/ui/src/mixins.scss';
  @use '../shared.scss';

  #filter-card {
    @include mixins.card();
    padding: var(--spacing-2xl);
    width: 100%;
  }

  #value-cards {
    display: flex;
    gap: var(--spacing-2xl);
    justify-content: space-between;
    margin-top: var(--spacing-2xl);
  }

  .value-card {
    @include shared.value-card();

    #text {
      font-size: var(--card-text-size);
      color: var(--card-text-color);
    }

    #value {
      display: flex;
      align-items: center;
      font-size: var(--card-value-size);
      font-weight: var(--card-value-weight);
    }
  }
</style>
