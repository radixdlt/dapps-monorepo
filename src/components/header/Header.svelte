<script lang="ts">
  import ConnectButton from '../button/connect-button/ConnectButton.svelte'
  import Navbar from '../navbar/Navbar.svelte'
  import AccountPicker from '../account-picker/AccountPicker.svelte'
  import { connectBtn, header, logo, navbar } from './styles'
  import { page } from '$app/stores'

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
  <div class={`gradient-text ${logo}`}>Radix Dashboard</div>
  <div class={navbar}>
    <Navbar initialSelectedId={$page.routeId || 'home'}>
      {#each pages as page}
        <a id={page.title} href={page.path}>{page.title}</a>
      {/each}
    </Navbar>
  </div>
  <div class={connectBtn}>
    <AccountPicker />
    <ConnectButton />
  </div>
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
