<script lang="ts">
  import { storage } from '@stores'
  import Switch from '../Switch.svelte'

  $: darkModeEnabled = $storage.theme === 'dark'

  const setTheme = (_theme: 'light' | 'dark') => storage.set({ theme: _theme })

  const toggleTheme = () => setTheme(darkModeEnabled ? 'light' : 'dark')
</script>

<Switch onToggle={toggleTheme} enabled={darkModeEnabled} />
