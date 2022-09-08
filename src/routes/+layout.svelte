<script lang="ts">
  import Header from '@components/header/Header.svelte'
  import { css, darkTheme, getCssText } from '@styles'
  import { navigating } from '$app/stores'
  import LoadingSpinner from '@components/loading-spinner/LoadingSpinner.svelte'
  import '../fonts.css'
  import { onMount } from 'svelte'
  import Switch from '@components/switch/Switch.svelte'
  import { storage } from '@stores'

  let darkModeEnabled: boolean
  let mounted = false

  const isDarkMode = () => $storage.theme === 'dark'

  const setTheme = (_theme: 'light' | 'dark') => {
    darkModeEnabled = _theme === 'dark' ? true : false
    storage.set({ theme: _theme })
    window.document.body.classList[_theme === 'dark' ? 'add' : 'remove'](
      darkTheme
    )
  }

  const toggleTheme = () => setTheme(isDarkMode() ? 'light' : 'dark')

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
    <Switch onToggle={toggleTheme} enabled={darkModeEnabled} />
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
