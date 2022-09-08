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

  const setTheme = (theme: 'light' | 'dark') => {
    darkModeEnabled = theme === 'dark' ? true : false
    localStorage.setItem('theme', theme)
    window.document.body.classList[theme === 'dark' ? 'add' : 'remove'](
      darkTheme
    )
  }

  const toggleTheme = () => {
    setTheme(isDarkMode() ? 'light' : 'dark')
  }

  onMount(() => {
    if (isDarkMode()) {
      setTheme('dark')
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
    <Switch toggle={toggleTheme} enabled={darkModeEnabled} />
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
