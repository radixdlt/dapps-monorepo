<script lang="ts">
  import { Switch } from '@rgossiaux/svelte-headlessui'
  import { spring } from 'svelte/motion'
  import { container, slider } from './style'

  export let onToggle = () => {}
  export let enabled: boolean = false
  export let width: number = 50

  const sliderXPosition = spring(0, {
    stiffness: 0.3,
    damping: 0.8
  })

  const padding = width / 15
  const sliderWidth = width / 3

  $: sliderXPosition.set(enabled ? width - sliderWidth - padding * 2 - 4 : 0)
</script>

<Switch checked={enabled} on:change={onToggle} class={container(width, padding)}>
  <div class={slider(sliderWidth, $sliderXPosition)} />
</Switch>
