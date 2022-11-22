<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Icon from '@components/_base/icon/Icon.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { icons } from '../../icon-assets'

  export let icon: keyof typeof icons
  export let isIconColor: boolean = false
  export let bold = false
</script>

<Box flex="row" items="center">
  <Icon
    filter={!isIconColor ? 'grayscale(100%)' : 'undefined'}
    type={icons[icon]}
  />
  <Text {bold} mx="medium"><slot /></Text>
</Box>
