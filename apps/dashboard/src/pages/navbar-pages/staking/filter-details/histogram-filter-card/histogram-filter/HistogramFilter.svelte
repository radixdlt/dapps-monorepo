<script lang="ts">
  // @ts-ignore
  import Slider from '@bulatdashiev/svelte-slider'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import SliderHandleIcon from '@icons/slider-handle.svg'

  export let values: number[] = []
  export let min = 0
  export let max = 100
  export let range: [number, number]

  const barHeightPx = 60
  const barCount = 36

  const generateHistogram = (array: number[]) => {
    const barHeights: number[] = Array(barCount).fill(0)

    const barWidth = max / barCount

    let maxBarHeight = 0
    for (const value of array) {
      const barIndex = Math.floor(value / barWidth)
      barHeights[barIndex]++
      if (barHeights[barIndex] > maxBarHeight) {
        maxBarHeight = barHeights[barIndex]
      }
    }

    const normalizationFactor = maxBarHeight / barHeightPx

    for (let i = 0; i < barCount; i++) {
      barHeights[i] = Math.floor(barHeights[i] / normalizationFactor)
    }

    return barHeights
  }

  let histogramBarHeights: number[] = []

  $: if (values) histogramBarHeights = generateHistogram(values)
</script>

<div id="filter-histogram">
  <div
    id="active"
    class="histogram"
    style:clip-path={`inset(0 ${((max - range[1]) / max) * 100}% 0 ${
      (range[0] / max) * 100
    }%)`}
  >
    {#each histogramBarHeights as value}
      <div class="active-bar" style="height: {value}px" />
    {/each}
  </div>

  <div id="inactive" class="histogram">
    {#each histogramBarHeights as value}
      <div class="inactive-bar" style="height: {value}px" />
    {/each}
  </div>
</div>

<div id="slider">
  <Slider
    bind:value={range}
    range
    order
    {min}
    {max}
    step={max / 100}
    --progress-bg="transparent"
    --track-bg="transparent"
    --thumb-bg="transparent"
  >
    <IconNew icon={SliderHandleIcon} slot="left" size="large" />
    <div id="right-handle" slot="right">
      <IconNew icon={SliderHandleIcon} size="large" />
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

  #slider {
    position: relative;
    z-index: 2;

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
    top: 0;
    z-index: 1;
    border-bottom: 5px solid var(--color-grey-4);
  }
</style>
