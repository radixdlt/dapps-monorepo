<script lang="ts">
  import Header from '@components/header/Header.svelte'
  import { css, darkTheme, getCssText } from '@styles'
  import { navigating } from '$app/stores'
  import LoadingSpinner from '@components/loading-spinner/LoadingSpinner.svelte'
  import '../fonts.css'
  import { onMount } from 'svelte'
  import Switch from '@components/switch/Switch.svelte'

  let darkModeEnabled: boolean
  let mounted = false

  const isDarkMode = () => localStorage.getItem('theme') === 'dark'

  const toggleDarkMode = () => {
    darkModeEnabled = true
    localStorage.setItem('theme', 'dark')
    window.document.body.classList.add(darkTheme)
  }

  const toggleLightMode = () => {
    darkModeEnabled = false
    localStorage.setItem('theme', 'light')
    window.document.body.classList.remove(darkTheme)
  }

  const toggle = () => {
    if (isDarkMode()) {
      toggleLightMode()
    } else {
      toggleDarkMode()
    }
  }

  onMount(() => {
    if (isDarkMode()) {
      toggleDarkMode()
    }
    mounted = true
  })
</script>

<!-- enables SSR of css -->
{@html `<${''}style id="stitches">${getCssText()}</${''}style>`}

{#if mounted}
  <Header />

  <div
    class={css({
      position: 'fixed',
      top: '$sm',
      right: '$sm'
    })()}
  >
    <Switch {toggle} enabled={darkModeEnabled} />
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
{/if}
