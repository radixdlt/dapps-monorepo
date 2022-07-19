<script>
  import Navbar from "@components/Navbar.svelte"
  import { getCssText } from "@styles"
</script>

<!-- enables SSR of css -->
{@html `<${""}style id="stitches">${getCssText()}</${""}style>`}

<Navbar />

<slot />
