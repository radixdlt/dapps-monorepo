<script lang="ts">
  import { css } from "@styles"
  import { tweened, type Tweened } from "svelte/motion"
  import { cubicOut } from "svelte/easing"
  import { onMount } from "svelte"

  const pages: string[] = ["explorer", "staking"]

  const lineWidth = 50

  let windowResizeTrigger = {}

  const navbar = css({
    marginTop: 15,
    height: 30
  })

  const link = css({
    position: "relative",
    marginLeft: 30,
    marginRight: 30
  })

  const line = css({
    position: "absolute",
    border: "2px solid",
    borderColor: '$primary',
    width: `${lineWidth}px`,
    marginTop: "22px",
    borderRadius: "5px",
    opacity: "50%"
  })

  let homeRef: any
  let selectedRef: any
  let linePosition: Tweened<number>

  const getAlignedXPosition = (element: any) =>
    element.getBoundingClientRect().x -
    (lineWidth / 2 - element.getBoundingClientRect().width / 2)

  onMount(() => {
    linePosition = tweened(getAlignedXPosition(homeRef), {
      duration: 500,
      easing: cubicOut
    })

    const triggerResize = () => (windowResizeTrigger = {})

    window.addEventListener("resize", triggerResize)
    return () => window.removeEventListener("resize", triggerResize)
  })

  const select = (e: any) => (selectedRef = e.target)

  const animateLine = (duration?: number) => {
    if (!linePosition) return
    linePosition.set(getAlignedXPosition(selectedRef || homeRef), { duration })
  }

  $: {
    selectedRef
    animateLine()
  }

  $: {
    windowResizeTrigger
    animateLine(0)
  }
</script>

<div class={navbar()}>
  {#if linePosition}
    <div class={line()} style:left={`${$linePosition}px`} />
  {/if}

  <center>
    <a bind:this={homeRef} class={link()} on:click={select} href="/">home</a>

    {#each pages as page}
      <a class={link()} on:click={select} href={`/${page}`}>{page}</a>
    {/each}
  </center>
</div>
