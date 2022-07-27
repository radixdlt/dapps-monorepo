<script lang="ts">
  import type { CSS } from "@stitches/core/types/css-util"
  import { css } from "@styles"

  export let style: CSS | undefined = undefined

  const button = css({
    backgroundColor: "gainsboro",
    fontSize: "$small",
    border: "0",
    "&:hover": {
      backgroundColor: "lightgray"
    },
    padding: 10,
    borderRadius: 10,
    color: 'black',
    ...style
  })
</script>

<button on:click class={button()}>
  <slot />
</button>
