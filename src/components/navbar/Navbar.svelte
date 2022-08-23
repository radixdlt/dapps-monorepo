<script lang="ts">
  import { tweened, type Tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { onMount } from 'svelte'
  import { line, navbar, slotParent } from './styles'

  export let lineWidth = 50
  export let initialSelectedId: string

  let windowResizeTrigger = {}

  let selectedRef: Element
  let linePosition: Tweened<number>

  const getAlignedXPosition = () =>
    selectedRef.getBoundingClientRect().x -
    (lineWidth / 2 - selectedRef.getBoundingClientRect().width / 2)

  onMount(() => {
    for (let i = 0; i < slotParentElement.children.length; i++) {
      const child = slotParentElement.children[i]
      child.addEventListener('click', select)
      if (child.id === initialSelectedId) selectedRef = child
    }

    linePosition = tweened(getAlignedXPosition(), {
      easing: cubicOut
    })

    const triggerResize = () => (windowResizeTrigger = {})

    window.addEventListener('resize', triggerResize)

    return () => window.removeEventListener('resize', triggerResize)
  })

  const select = (e: Event) => (selectedRef = e.target as Element)

  const animateLine = (duration?: number) =>
    linePosition?.set(getAlignedXPosition(), { duration })

  $: {
    selectedRef
    animateLine(500)
  }

  $: {
    windowResizeTrigger
    animateLine(0)
  }

  let slotParentElement: HTMLElement
</script>

<div class={navbar}>
  {#if linePosition}
    <div class={line(lineWidth)} style:left={`${$linePosition}px`} />
  {/if}

  <center class={slotParent} bind:this={slotParentElement}>
    <slot />
  </center>
</div>
