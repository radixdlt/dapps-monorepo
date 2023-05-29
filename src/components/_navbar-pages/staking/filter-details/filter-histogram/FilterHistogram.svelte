<script lang="ts">
  // @ts-ignore
  import Slider from '@bulatdashiev/svelte-slider'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import { createEventDispatcher } from 'svelte'

  export let values: number[] = []

  const transormArray = (original: number[], newLength: number) => {
    const originalLength = original.length

    if (newLength <= originalLength) {
      return original.slice(0, newLength)
    }

    const interpolatedArray = []
    const stepSize = (originalLength - 1) / (newLength - 1)

    for (let i = 0; i < newLength - 1; i++) {
      const index = i * stepSize
      const floorIndex = Math.floor(index)
      const ceilIndex = Math.ceil(index)

      if (floorIndex === ceilIndex) {
        interpolatedArray.push(original[floorIndex])
      } else {
        const weight = index - floorIndex
        const interpolatedValue =
          original[floorIndex] * (1 - weight) + original[ceilIndex] * weight
        interpolatedArray.push(interpolatedValue)
      }
    }

    interpolatedArray.push(original[originalLength - 1])
    return interpolatedArray
  }

  let normalizedValues = values.map(
    (value) => (value / Math.max(...values)) * 100
  )

  const nbrOfBars = 36

  const transformedArray = transormArray(normalizedValues, nbrOfBars)

  let range = [0, 100]

  const dispatchFilterEvent = createEventDispatcher<{
    'new-range': { min: number; max: number }
  }>()

  $: dispatchFilterEvent('new-range', { min: range[0], max: range[1] })
</script>

<div id="filter-histogram">
  <div
    class="histogram"
    style:clip-path={`inset(0 ${100 - range[1]}% 0 ${range[0]}%)`}
  >
    {#each transformedArray as value}
      <div class="active-bar" style="height: {value}px" />
    {/each}
  </div>

  <div id="inactive" class="histogram">
    {#each transformedArray as value}
      <div class="inactive-bar" style="height: {value}px" />
    {/each}
  </div>
</div>

<div id="slider">
  <Slider
    bind:value={range}
    range
    order
    --progress-bg="transparent"
    --track-bg="transparent"
    --thumb-bg="transparent"
  >
    <IconNew type="sliderHandle" slot="left" size="large" />
    <div id="right-handle" slot="right">
      <IconNew type="sliderHandle" size="large" />
    </div>
  </Slider>
</div>

<style lang="scss">
  .histogram {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--spacing-xs);
    width: 100%;
    height: 100%;

    .active-bar,
    .inactive-bar {
      width: 100%;
      border-radius: var(--border-radius-md) var(--border-radius-md) 0 0;
    }

    .active-bar {
      background: var(--color-grey-1);
    }

    .inactive-bar {
      background: var(--color-grey-4);
    }
  }

  .active-bar {
    width: 100%;
    background: var(--color-grey-1);
  }

  .inactive-bar {
    width: 100%;
    background: var(--color-grey-4);
  }

  #slider {
    :global(.track) {
      margin: 0;
    }
  }

  #right-handle {
    transform: translateX(13px);
  }

  #filter-histogram {
    position: relative;
  }

  #active {
    position: relative;
    z-index: 2;
    border-bottom: 5px solid var(--color-grey-1);
  }

  #inactive {
    position: absolute;
    z-index: -1;
    top: 0;
    z-index: 1;
    border-bottom: 5px solid var(--color-grey-4);
  }
</style>
