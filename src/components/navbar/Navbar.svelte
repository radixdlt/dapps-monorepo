<script lang="ts">
  import { tweened, type Tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { onMount } from 'svelte'
  import { line, link, navbar } from './styles'

  const pages: string[] = ['explorer', 'staking']

  const lineWidth = 50

  let windowResizeTrigger = {}

  let homeRef: Element
  let selectedRef: Element | null
  let linePosition: Tweened<number>

  const getAlignedXPosition = (element: Element) =>
    element.getBoundingClientRect().x -
    (lineWidth / 2 - element.getBoundingClientRect().width / 2)

  onMount(() => {
    linePosition = tweened(getAlignedXPosition(homeRef), {
      easing: cubicOut
    })

    const triggerResize = () => (windowResizeTrigger = {})

    window.addEventListener('resize', triggerResize)
    return () => window.removeEventListener('resize', triggerResize)
  })

  const select = (e: Event) => (selectedRef = e.target as Element)

  const animateLine = (duration?: number) => {
    if (!linePosition) return
    linePosition.set(getAlignedXPosition(selectedRef || homeRef), { duration })
  }

  $: {
    selectedRef
    animateLine(500)
  }

  $: {
    windowResizeTrigger
    animateLine(0)
  }
</script>

<div class={navbar}>
  {#if linePosition}
    <div class={line(lineWidth)} style:left={`${$linePosition}px`} />
  {/if}

  <center>
    <a bind:this={homeRef} class={link} on:click={select} href="/">home</a>

    {#each pages as page}
      <a class={link} on:click={select} href={`/${page}`}>{page}</a>
    {/each}
  </center>
</div>
