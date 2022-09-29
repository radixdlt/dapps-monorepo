<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Icon from '@components/_base/icon/Icon.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { icons } from '../../icon-assets'

  export let isActive = false
  export let icon: keyof typeof icons
</script>

<Box flex="row" items="center">
  <Icon {isActive} type={icons[icon]} />
  <Text bold={isActive} mx="medium"><slot /></Text>
</Box>
