<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Icon from '@components/_base/icon/Icon.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import type { config } from '@styles'
  import { icons } from '../../icon-assets'

  export let noPadding: boolean = false
  export let icon: keyof typeof icons
  export let isIconColor: boolean = false
  export let bold = false
  export let textColor: `$${keyof typeof config['theme']['colors']}` = '$text'
</script>

<Box flex="row" transparent items="center" p={noPadding ? 'none' : 'medium'}>
  <Icon
    filter={!isIconColor ? 'grayscale(100%)' : 'undefined'}
    type={icons[icon]}
  />
  <Text {bold} cx={{ color: textColor, ml: '$sm' }}><slot /></Text>
</Box>
