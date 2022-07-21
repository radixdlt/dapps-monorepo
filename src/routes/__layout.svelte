<script>
  import ConnectButton from "@components/ConnectButton.svelte"
  import Navbar from "@components/Navbar.svelte"
  import { css, getCssText } from "@styles"

  const frame = css({
    padding: "50px"
  })

  const connectBtn = css({
    position: 'fixed',
    right: 20,
    top: 20
  })
</script>

<!-- enables SSR of css -->
{@html `<${""}style id="stitches">${getCssText()}</${""}style>`}

<Navbar />

<div class={connectBtn()}>
  <ConnectButton />
</div>

<div class={frame()}>
  <slot />
</div>
