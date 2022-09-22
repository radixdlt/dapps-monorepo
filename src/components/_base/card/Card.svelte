<script lang="ts">
  import { config, css } from '@styles'
  import Box from '../box/Box.svelte'

  export let width: `$${keyof typeof config.theme.sizes}` = '$3xl'

  const divider = css({
    height: '1px',
    backgroundColor: '$gray3',
    borderTop: '2px solid $gray3',
    borderRadius: '$sm',
    opacity: 0.2
  })()
</script>

<Box shadow cx={{ width }}>
  <slot name="header" />
  <hr class={divider} />
  <slot name="body" />
</Box>
