<script lang="ts">
  import { css } from "@styles"
  import { tweened } from "svelte/motion"
  import { cubicOut } from "svelte/easing"

  let linkRef: any
  let wrapperRef: any

  const progress = tweened(0, {
    duration: 400,
    easing: cubicOut
  })

  const navbar = css({
    marginTop: 15,
    height: 30
  })

  const wrapper = css({
    "&::after": {
      position: "absolute",
      width: "40px",
      height: "20px",
      content: "",
      left: 0,
      top: 10,
      borderBottom: "3px solid black"
    }
  })

  const link = css({
    position: "relative",
    marginLeft: 30,
    marginRight: 30
  })

  const move = () => {
    let rect = linkRef.getBoundingClientRect()
    console.log(wrapperRef.style)
  }
</script>

<div class={navbar()}>
  <center>
    <div bind:this={wrapperRef} class={wrapper()}>
      <a bind:this={linkRef} class={link()} href="/explorer">explorer</a>
      <a on:click={move} class={link()} href="/staking">staking</a>
    </div>
  </center>
</div>
