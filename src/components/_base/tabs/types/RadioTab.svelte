<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import { Tab } from '@rgossiaux/svelte-headlessui'
  import { css } from '@styles'

  const selectedClass = css({
    backgroundColor: '$grey',
    boxShadow: 'inset 0 0 0 1px $primary'
  })()

  const tabClass = css({
    backgroundColor: 'transparent',
    border: '1px solid $grey',
    borderRadius: '50%',
    boxShadow: 'inset 0 0 0 0 white',
    cursor: 'pointer',
    height: '1em',
    outline: 'none',
    width: '1em'
  })()
</script>

<label>
  <Box inline items="center" gap="xsmall">
    <Tab
      class={({ selected }) => `${tabClass} ${selected ? selectedClass : ''}`}
    />
    <slot />
  </Box>
</label>
