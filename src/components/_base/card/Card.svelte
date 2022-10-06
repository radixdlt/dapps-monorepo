<script lang="ts">
  import { css } from '@styles'
  import Box from '../box/Box.svelte'

  const divider = css({
    border: '1px solid $borderColor',
    mt: '$md'
  })()
</script>

<Box p="large" shadow>
  <slot name="header" />
  <hr class={divider} />
  <slot name="body" />
</Box>
