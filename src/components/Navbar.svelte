<script lang="ts">
  import { css } from "@styles"
  import { tweened, type Tweened } from "svelte/motion"
  import { cubicOut } from "svelte/easing"
  import { onMount } from "svelte"

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
    border: "2px solid black",
    width: "50px",
    marginTop: "20px",
    borderRadius: "5px"
  })

  let windowWidth: number
  let home: any
  let selected: any

  let linePosition: Tweened<number>

  onMount(() => {
    windowWidth = window.innerWidth
    linePosition = tweened(home.offsetLeft, {
      duration: 1000,
      easing: cubicOut
    })

    window.addEventListener("resize", () => (windowWidth = window.innerWidth))

    return () =>
      window.removeEventListener(
        "resize",
        () => (windowWidth = window.innerWidth)
      )
  })

  const select = (e: any) => {
    linePosition.set(e.target.offsetLeft)
    selected = e.target
  }

  let offset: number
  $: {
    if (linePosition) {
      if (selected) linePosition.set(selected.offsetLeft)
      offset = ($linePosition / windowWidth) * 100
    }
  }
</script>

<div class={navbar()}>
  {#if offset}
    <div class={line()} style:left={`${offset}vw`} />
  {/if}

  <center>
    <a bind:this={home} class={link()} on:click={select} href="/">home</a>
    <a class={link()} on:click={select} href="/explorer">explorer</a>
    <a class={link()} on:click={select} href="/staking">staking</a>
  </center>
</div>
