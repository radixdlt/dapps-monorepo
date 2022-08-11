<script lang="ts">
  import { css } from '@styles'
  import ConnectButton from '../connect-button/ConnectButton.svelte'
  import Navbar from '../navbar/Navbar.svelte'
  import AccountPicker from '../account-picker/AccountPicker.svelte'

  const connectBtn = css({
    gridItem: 'connect',
    justifySelf: 'right',
    alignSelf: 'center',
    marginRight: '$3xl'
  })

  const logo = css({
    gridItem: 'logo',
    fontFamily: 'StreetFighter',
    fontSize: '$4xl',
    justifySelf: 'center',
    alignSelf: 'center'
  })

  const header = css({
    display: 'grid',
    grid: '100% / 25% 50% 25%',
    height: 80,
    backgroundColor: '$success'
  })

  const navbar = css({
    justifySelf: 'center',
    alignSelf: 'center'
  })
</script>

<div class={header()}>
  <div class={`gradient-text ${logo()}`}>Radix Dashboard</div>
  <div class={navbar()}>
    <Navbar />
  </div>
  <div class={connectBtn()}>
    <AccountPicker />
    <ConnectButton />
  </div>
</div>

<style>
  .gradient-text {
    background-image: linear-gradient(
      19deg,
      hsl(191, 98%, 56%) 0%,
      hsl(281, 100%, 56%) 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
  }
</style>
