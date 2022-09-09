<script lang="ts">
  import { storage } from '@stores'
  import { darkTheme } from '@styles'
  import { onMount } from 'svelte'

  import Switch from '../Switch.svelte'

  let darkModeEnabled: boolean

  const isDarkMode = () => $storage.theme === 'dark'

  const setTheme = (_theme: 'light' | 'dark') => {
    darkModeEnabled = _theme === 'dark' ? true : false
    storage.set({ theme: _theme })
    window.document.body.classList[_theme === 'dark' ? 'add' : 'remove'](
      darkTheme
    )
  }

  onMount(() => {
    if (isDarkMode()) setTheme('dark')
  })

  const toggleTheme = () => setTheme(isDarkMode() ? 'light' : 'dark')
</script>

<Switch onToggle={toggleTheme} enabled={darkModeEnabled} />
