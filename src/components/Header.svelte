<script lang="ts">
  import { css } from "@styles"
import ConnectButton from "./ConnectButton.svelte";
import Navbar from "./Navbar.svelte";

  const connectBtn = css({
    position: "fixed",
    right: 20,
    top: 20
  })

  const logo = css({
    fontFamily: "StreetFighter",
    fontSize: 40,
  })

  const header = css({
    display: "flex",
    alignItems: "center",
    paddingLeft: 200,
    paddingRight: 200,
    height: 80,
    backgroundColor: "$darker"
  })
</script>

<div class={header()}>
  <div class={`gradient-text ${logo()}`}>Radix Dashboard</div>

  <div class={connectBtn()}>
    <ConnectButton />
  </div>
  <Navbar />
</div>

<style>
  .gradient-text {
    background-image: linear-gradient(19deg, #21d4fd 0%, #b721ff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
  }
</style>
