<script lang="ts">
  import { css } from "@styles"

  const style = css({
    backgroundColor: "gainsboro",
    fontSize: "13px",
    border: "0",
    "&:hover": {
      backgroundColor: "lightgray"
    },
    padding: 10,
    borderRadius: 15
  })
</script>

<button on:click class={style()}>
  <slot />
</button>
