<script lang="ts">
  import {
    Popover,
    PopoverButton,
    PopoverPanel
  } from '@rgossiaux/svelte-headlessui'
  import Box from '../box/Box.svelte'
</script>

<div>
  <Popover>
    <PopoverButton as="div">
      <slot name="button" />
    </PopoverButton>
    <PopoverPanel>
      <Box p="none" mx="none" transparent>
        <slot name="content" />
      </Box>
    </PopoverPanel>
  </Popover>
</div>
