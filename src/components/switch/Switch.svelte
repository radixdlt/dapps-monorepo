<script lang="ts">
  import { Switch } from '@rgossiaux/svelte-headlessui'
  import { tweened } from 'svelte/motion'
  import { onMount } from 'svelte'
  import { container, slider } from './style'

  export let enabled = false
  export let width: number = 50

  const sliderXPosition = tweened(0, { duration: 200 })

  const padding = width / 15
  const sliderWidth = width / 3

  let slideElement: HTMLElement

  const toggle = () => {
    enabled = !enabled

    sliderXPosition.set(enabled ? width - sliderWidth - padding * 2 - 4 : 0)
  }
</script>

<Switch checked={enabled} on:change={toggle} class={container(width, padding)}>
  <div bind:this={slideElement} class={slider(sliderWidth, $sliderXPosition)} />
</Switch>
