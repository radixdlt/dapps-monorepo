<script lang="ts">
  import ConnectButton from '../connect-button/ConnectButton.svelte'
  import Navbar from '../navbar/Navbar.svelte'
  import AccountPicker from '../account-picker/AccountPicker.svelte'
  import { connectBtn, header, logo, navbar } from './styles'
</script>

<div class={header}>
  <div class={`gradient-text ${logo}`}>Radix Dashboard</div>
  <div class={navbar}>
    <Navbar />
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
