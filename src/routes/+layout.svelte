<script>
  import Header from '@components/header/Header.svelte'
  import { css, darkTheme, getCssText } from '@styles'
  import { navigating } from '$app/stores'
  import LoadingSpinner from '@components/loading-spinner/LoadingSpinner.svelte'
  import '../fonts.css'
  import { onMount } from 'svelte'
  import Switch from '@components/switch/Switch.svelte'

  let darkModeEnabled = false

  let mounted = false
  onMount(() => {
    mounted = true
  })

  $: {
    if (mounted) {
      darkModeEnabled
        ? document.body.classList.add(darkTheme)
        : document.body.classList.remove(darkTheme)
    }
  }
</script>

<!-- enables SSR of css -->
{@html `<${''}style id="stitches">${getCssText()}</${''}style>`}

<Header />

<div class={css({
  position: 'fixed',
  top: '$sm',
  right: '$sm'
})()}>
  <Switch bind:enabled={darkModeEnabled} />
</div>
  

<div>
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
