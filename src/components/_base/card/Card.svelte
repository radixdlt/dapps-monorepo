<script lang="ts">
  import { css } from '@styles'
  import Box from '../box/Box.svelte'

  const divider = css({
    height: '1px',
    backgroundColor: '$gray-200',
    borderTop: '3px dashed #bbb'
  })()
</script>

<Box shadow>
  <slot name="header" />
  <hr class={divider} />
  <slot name="body" />
</Box>
