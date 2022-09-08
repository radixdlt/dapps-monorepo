<script lang="ts">
  import ConnectButton from '../button/connect-button/ConnectButton.svelte'
  import Navbar from '../navbar/Navbar.svelte'
  import AccountPicker from '../account-picker/AccountPicker.svelte'
  import { header } from './styles'
  import { page } from '$app/stores'
  import Box from '@components/box/Box.svelte'
  import { storage } from '@stores'

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
  <Box transparent>
    <img
      alt="logo"
      height="50"
      width="200"
      src={$storage.theme === 'light'
        ? '/images/Radix_Logo_light_theme.svg'
        : '/images/Radix_Logo_dark_theme.svg'}
    />
  </Box>
  <Box mt="small" justify="center" transparent>
    <Navbar initialSelectedId={$page.routeId || 'home'}>
      {#each pages as page}
        <a id={page.title} href={page.path}>{page.title}</a>
      {/each}
    </Navbar>
  </Box>
  <Box mt="small" justify="center" transparent>
    <AccountPicker />
    <ConnectButton />
  </Box>
</div>

<style>
  .gradient-text {
    background-image: linear-gradient(
      19deg,
      hsl(300, 98%, 56%) 0%,
      hsl(220, 100%, 56%) 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
  }
</style>
