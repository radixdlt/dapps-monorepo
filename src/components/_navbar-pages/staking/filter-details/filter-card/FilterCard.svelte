<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import FilterHistogram from './filter-histogram/FilterHistogram.svelte'

  export let values: number[]
  export let minText: string
  export let maxText: string

  let _min: number
  let _max: number

  const dispatchFilterEvent = createEventDispatcher<{
    'new-range': { min: number; max: number }
  }>()
</script>

<div id="filter-card">
  <FilterHistogram
    {values}
    on:new-range={({ detail: { min, max } }) => {
      _min = min
      _max = max

      dispatchFilterEvent('new-range', { min, max })
    }}
  />

  <div id="value-cards">
    <div class="value-card">
      <div id="text">
        {minText}
      </div>
      <div id="value">
        {_min}%
      </div>
    </div>

    <div class="value-card">
      <div id="text">
        {maxText}
      </div>
      <div id="value">
        {_max}%
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../../../mixins.scss';

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
    @include mixins.card(true, var(--color-grey-5));
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-xl);
    width: 100%;

    #text {
      font-size: var(--font-size-sm);
      color: var(--color-grey-2);
    }

    #value {
      font-size: var(--text-3xl);
      font-weight: var(--font-weight-bold-2);
    }
  }
</style>
