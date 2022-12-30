<script lang="ts">
  import {
    Popover,
    PopoverButton,
    PopoverPanel
  } from '@rgossiaux/svelte-headlessui'
  import Box from '../box/Box.svelte'

  export let forceShow = false
</script>

<Box p="none" cx={{ position: 'relative' }}>
  <Popover>
    <PopoverButton as="div">
      <slot name="button" />
    </PopoverButton>
    <PopoverPanel static={forceShow}>
      <Box p="none" mx="none">
        <slot name="content" />
      </Box>
    </PopoverPanel>
  </Popover>
</Box>
