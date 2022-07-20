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
    border: "2px solid red",
    width: "50px",
    marginTop: "20px"
  })

  let windowWidth: number = 0
  let home: any

  const linePosition: Tweened<number> = tweened(0, {
    duration: 1000,
    easing: cubicOut
  })

  const debounce = (func: any, delay: any) => {
    let timer: any

    return function () {
      // @ts-ignore
      const context = this
      const args = arguments
      clearTimeout(timer)
      timer = setTimeout(() => func.apply(context, args), delay)
    }
  }

  const setWindowWidth = () => {
    windowWidth = window.innerWidth
  }

  const debouncedSetWindowWidth = debounce(setWindowWidth, 300)

  onMount(() => {
    window.addEventListener("resize", debouncedSetWindowWidth)

    return () => {
      window.removeEventListener("resize", debouncedSetWindowWidth)
    }
  })

  const move = (e: any) => {
    linePosition.set(e.target.offsetLeft)
  }

  const getLinePosition = () =>
    (($linePosition === 0 ? home.offsetLeft : $linePosition) / windowWidth) *
    100

</script>

<div class={navbar()}>
  {#if home}
    <div
      class={line()}
      style:left={`${getLinePosition()}vw`}
    />
  {/if}

  <center>
    <a bind:this={home} class={link()} on:click={move} href="/index">home</a>
    <a class={link()} on:click={move} href="/explorer">explorer</a>
    <a class={link()} on:click={move} href="/staking">staking</a>
  </center>
</div>
