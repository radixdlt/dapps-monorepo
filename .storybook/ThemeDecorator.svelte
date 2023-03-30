<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Switch from '@components/_base/switch/Switch.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { darkTheme } from '../src/styles'
  let darkMode = false
  $: document.body.classList[darkMode ? 'add' : 'remove'](darkTheme)
</script>

<div>
  <Box items="center" flex="row">
    <Switch enabled={darkMode} onToggle={() => (darkMode = !darkMode)} />
    <Text mx="large">Dark mode</Text>
  </Box>
  <slot />
</div>
