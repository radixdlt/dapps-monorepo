<script lang="ts">
  import { css } from "@styles"

  const navbar = css({
    marginTop: 15,
    height: 30
  })

  const link = css({
    position: "relative",
    marginLeft: 30,
    marginRight: 30
  })
</script>

<div class={navbar()}>
  <center>
    <a class={link()} href="/explorer">explorer</a>
    <a class={link()} href="/staking">staking</a>
  </center>
</div>
