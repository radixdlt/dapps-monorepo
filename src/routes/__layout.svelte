<script>
  import Navbar from "@components/Navbar.svelte"
  import { css, getCssText } from "@styles"

  const frame = css({
    padding: '50px'
  })
</script>

<!-- enables SSR of css -->
{@html `<${""}style id="stitches">${getCssText()}</${""}style>`}

<Navbar />

<div class={frame()}>
  <slot />
</div>
