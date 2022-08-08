<script>
  import Header from "@components/Header.svelte"
  import { css, getCssText } from "@styles"
  import { navigating } from "$app/stores"
  import LoadingSpinner from "@components/LoadingSpinner.svelte"

  const frame = css({
    padding: "50px 300px 50px"
  })
</script>

<!-- enables SSR of css -->
{@html `<${""}style id="stitches">${getCssText()}</${""}style>`}

<Header />

<div class={frame()}>
  {#if $navigating}
    {#await new Promise((resolve) => setTimeout(resolve, 200)) then}
      <center>
        <LoadingSpinner />
      </center>
    {/await}
  {:else}
    <slot />
  {/if}
</div>

<style>
  @font-face {
    font-family: "StreetFighter";
    font-style: normal;
    font-weight: 400;
    src: url("/fonts/Act_Of_Rejection.ttf") format("truetype");
  }
</style>
