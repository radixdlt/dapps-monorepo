<script>
  import { getCssText } from "@styles"
</script>

<!-- enables SSR of css -->
{@html `<${''}style id="stitches">${getCssText()}</${''}style>`}

<slot />
