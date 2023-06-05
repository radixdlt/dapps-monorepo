<script lang="ts">
  import FilterHistogram from './histogram-filter/HistogramFilter.svelte'

  export let values: number[]
  export let minText: string
  export let maxText: string
  export let min: number
  export let max: number

  let range: [number, number] = [0, 100]

  $: min = range[0]
  $: max = range[1]
</script>

<div id="filter-card">
  <FilterHistogram {values} bind:range />

  <div id="value-cards">
    <div class="value-card">
      <div id="text">
        {minText}
      </div>
      <div id="value">
        {min}%
      </div>
    </div>

    <div class="value-card">
      <div id="text">
        {maxText}
      </div>
      <div id="value">
        {max}%
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../../../mixins.scss';
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
