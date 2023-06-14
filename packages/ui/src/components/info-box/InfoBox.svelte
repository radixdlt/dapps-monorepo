<script lang="ts" context="module">
  export const EMPTY_VALUE = `<no value>`
</script>

<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import type { Size } from '@styles'
  import type { CSS } from '@stitches/core'
  import type { Index } from '@stitches/core/types/util'

  export let keyColumnWidth: Size | Index = 'auto'
  export let cx: CSS = {}
</script>

<Box
  gap="medium"
  cx={{
    display: 'grid',
    gridTemplateColumns: `${keyColumnWidth} 5fr`,
    ...cx
  }}
>
  <slot />
</Box>
