<script lang="ts">
  import Popover from '@components/_base/popover/Popover.svelte'
  import Image from '@components/_base/image/Image.svelte'
  import IconTextItem from '@components/icon-text-item/IconTextItem.svelte'
  import Button from '@components/_base/button/Button.svelte'
  import Icon from '@components/_base/icon/Icon.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import { icons } from '../../../icon-assets'

  export let forceShow = false
  export let onConnect: () => void
</script>

<Popover {forceShow}>
  <Button slot="button" connectButton size="small">
    <Icon
      height="xs"
      width="xs"
      type={icons['dashboard']}
      filter="brightness(0) invert(1)"
    /><Text mx="xsmall">Connect</Text>
  </Button>
  <Box
    cx={{ width: '$4xl', zIndex: 1000 }}
    flex="col"
    gap="medium"
    connectButtonPopover
    px="medium"
    slot="content"
  >
    <Box flex="row" p="none" gap="medium" transparent>
      <Image
        cx={{ borderRadius: '$md' }}
        src="/images/popover-radix-logo.png"
        width="$lg"
        alt="logo"
      />
      <Text bold>Connect your Radix Wallet</Text>
    </Box>
    <Button
      cx={{ borderRadius: '$sm', backgroundColor: '$connectButton' }}
      full
      on:click={onConnect}
      size="small">Connect now</Button
    >
    <IconTextItem
      textColor="$connectButtonPopover"
      isIconColor
      noPadding
      icon="information">What is Radix Wallet?</IconTextItem
    >
  </Box>
</Popover>
