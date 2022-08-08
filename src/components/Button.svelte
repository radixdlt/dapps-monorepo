<script lang="ts">
  import type { CSS } from "@stitches/core/types/css-util"
  import { css } from "@styles"

  export let style: CSS | undefined = undefined

  const button = css({
    backgroundColor: '$primaryButton',
    fontSize: "$small",
    border: "0",
    "&:hover": {
      backgroundColor: '$grey'
    },
    padding: '$sm',
    borderRadius: '$md',
    color: 'white',
    ...style
  })
</script>

<button {...$$restProps} on:click class={button()}>
  <slot />
</button>
