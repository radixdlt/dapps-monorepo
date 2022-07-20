<script lang="ts">
  import { css } from "@styles"
  import { tweened, type Tweened } from "svelte/motion"
  import { cubicOut } from "svelte/easing"
  import { onMount } from "svelte"

  const lineWidth = 50

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
    border: "1px solid black",
    width: `${lineWidth}px`,
    marginTop: "20px",
    borderRadius: "5px"
  })

  let homeRef: any
  let selectedRef: any
  let linePosition: Tweened<number>

  const getAlignedXPosition = (element1: any) =>
    element1.getBoundingClientRect().x -
    (lineWidth / 2 - element1.getBoundingClientRect().width / 2)

  onMount(() => {
    linePosition = tweened(getAlignedXPosition(homeRef), {
      duration: 500,
      easing: cubicOut
    })
  })

  const select = (e: any) => {
    console.log("target", e.target.getBoundingClientRect())
    selectedRef = e.target
  }

  let offset: number
  $: {
    if (linePosition) {
      if (selectedRef) {
        linePosition.set(getAlignedXPosition(selectedRef))
      }
      offset = $linePosition
    }
  }
</script>

<div class={navbar()}>
  {#if offset}
    <div class={line()} style:left={`${offset}px`} />
  {/if}

  <center>
    <a bind:this={homeRef} class={link()} on:click={select} href="/">home</a>
    <a class={link()} on:click={select} href="/explorer">explorer</a>
    <a class={link()} on:click={select} href="/staking">staking</a>
  </center>
</div>
