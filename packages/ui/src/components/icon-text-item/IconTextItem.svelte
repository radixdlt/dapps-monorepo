<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Icon from '@components/_base/icon/Icon.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import type { CSS } from '@stitches/core/types/css-util'
  import type { config } from '@styles'

  export let noPadding: boolean = false
  export let noMargin: boolean = false
  export let icon: string
  export let interactiveIcon: boolean = false
  export let iconSize: 'xs' | 'sm' | 'md' | 'lg' = 'sm'
  export let isIconColor: boolean = false
  export let bold = false
  export let textColor: `$${keyof (typeof config)['theme']['colors']}` = '$text'
  export let iconPosition: 'left' | 'right' = 'left'

  export let cx: CSS<typeof config> = {}

  const iconProps = {
    filter: !isIconColor ? 'grayscale(100%)' : 'undefined',
    icon: icon,
    height: iconSize,
    width: iconSize,
    interactive: interactiveIcon
  }
</script>

<Box
  flex="row"
  items="center"
  p={noPadding ? 'none' : 'medium'}
  m={noMargin ? 'none' : 'medium'}
  {cx}
>
  {#if iconPosition === 'left'}
    <Icon on:click {...iconProps} />
  {/if}
  <Text {bold} mx="small" cx={{ color: textColor }}><slot /></Text>
  {#if iconPosition === 'right'}
    <Icon on:click {...iconProps} />
  {/if}
</Box>
