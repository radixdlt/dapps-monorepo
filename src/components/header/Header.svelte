<script lang="ts">
  import Navbar from '../_base/navbar/Navbar.svelte'
  import AccountPicker from '../account-picker/AccountPicker.svelte'
  import { page } from '$app/stores'
  import Box from '@components/_base/box/Box.svelte'
  import { storage } from '@stores'
  import ThemeSwitch from '@components/_base/switch/theme-switch/ThemeSwitch.svelte'
  import ConnectButton from '@components/connect-button/ConnectButton.svelte'
  import Image from '@components/_base/image/Image.svelte'

  const pages = [
    {
      title: 'home',
      path: '/'
    },
    {
      title: 'explorer',
      path: '/explorer'
    },
    {
      title: 'staking',
      path: '/staking'
    }
  ]
</script>

<Box
  flex="row"
  items="center"
  justify="between"
  p="small"
  cx={{
    flexWrap: 'wrap'
  }}
>
  <Box transparent cx={{ width: '$5xl' }}>
    <Image
      alt="logo"
      src={$storage.theme === 'light'
        ? '/images/Radix_Logo_light_theme.svg'
        : '/images/Radix_Logo_dark_theme.svg'}
    />
  </Box>
  <Box justify="center" transparent cx={{ ml: '$lg' }}>
    <Navbar initialSelectedId={$page.routeId || 'home'}>
      {#each pages as page}
        <a id={page.title} href={page.path}>{page.title}</a>
      {/each}
    </Navbar>
  </Box>
  <Box
    justify="center"
    items="center"
    cx={{
      width: '$5xl'
    }}
  >
    <Box justify="center" transparent flex="row" items="stretch">
      <AccountPicker />
      <ConnectButton />
    </Box>
    <ThemeSwitch />
  </Box>
</Box>
