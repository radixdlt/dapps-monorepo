<script lang="ts">
  import ConnectButton from '../button/connect-button/ConnectButton.svelte'
  import Navbar from '../navbar/Navbar.svelte'
  import AccountPicker from '../account-picker/AccountPicker.svelte'
  import { header } from './styles'
  import { page } from '$app/stores'
  import Box from '@components/box/Box.svelte'
  import { storage } from '@stores'
  import ThemeSwitch from '@components/switch/theme-switch/ThemeSwitch.svelte'

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

<div class={header}>
  <div style:flex-basis='20%'>
    <Box transparent>
      <img
        alt="logo"
        height="25"
        width="100"
        src={$storage.theme === 'light'
          ? '/images/Radix_Logo_light_theme.svg'
          : '/images/Radix_Logo_dark_theme.svg'}
      />
    </Box>
  </div>
  <Box justify="center" transparent>
    <Navbar initialSelectedId={$page.routeId || 'home'}>
      {#each pages as page}
        <a id={page.title} href={page.path}>{page.title}</a>
      {/each}
    </Navbar>
  </Box>
  <div style:flex-basis='20%' style:display="flex" style:align-items="center">
    <Box justify="center" transparent>
      <AccountPicker />
      <ConnectButton />
    </Box>
    <ThemeSwitch />
  </div>
</div>

<style>
  .gradient-text {
    background-image: linear-gradient(19deg, #ff43ca 0%, #052cc0 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
  }
</style>
