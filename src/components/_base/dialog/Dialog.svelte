<script lang="ts">
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    DialogDescription
  } from '@rgossiaux/svelte-headlessui'
  import { css } from '@styles'
  import Box from '@components/_base/box/Box.svelte'
  import type { config } from '@styles'

  export let size:
    | `$${typeof config['theme']['sizes']['4xl']}`
    | `$${typeof config['theme']['sizes']['5xl']}`
    | `$${typeof config['theme']['sizes']['6xl']}`

  const overlay = css({
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alpha: 0.5,
    width: '100%',
    height: '100%'
  })()

  export let open = true
</script>

<Dialog {open} on:close={() => (open = false)}>
  <DialogOverlay class={overlay} />
  <Box
    cx={{
      position: 'fixed',
      zIndex: 1000,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: size,
      padding: '$sm',
      borderRadius: '$md'
    }}
  >
    <DialogTitle>
      <slot name="title" />
    </DialogTitle>
    <DialogDescription>
      <slot name="description" />
    </DialogDescription>
  </Box>
</Dialog>
