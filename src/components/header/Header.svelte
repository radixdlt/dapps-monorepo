<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import { storage } from '@stores'
  import ThemeSwitch from '@components/_base/switch/theme-switch/ThemeSwitch.svelte'
  import Image from '@components/_base/image/Image.svelte'
  import ConnectButton from '@components/connect-button/ConnectButton.svelte'
</script>

<Box
  cx={{
    gridArea: 'header',
    borderBottom: 'solid',
    borderWidth: '$sm',
    borderColor: '$borderColor'
  }}
  px="large"
  items="center"
  justify="between"
>
  <Image
    width="$3xl"
    alt="logo"
    src={$storage.theme === 'light'
      ? '/images/Radix_Logo_light_theme.svg'
      : '/images/Radix_Logo_dark_theme.svg'}
  />
  <Box cx={{ gap: '$md' }} p="none" flex="row" items="center">
    <ConnectButton />

    <ThemeSwitch />
  </Box>
</Box>
