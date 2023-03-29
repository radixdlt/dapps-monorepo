<script lang="ts">
  import Input from '@components/_base/input/Input.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Popover from '@components/_base/popover/Popover.svelte'
  import Text from '@components/_base/text/Text.svelte'

  export let faded: boolean
  export let domain: string

  $: showError = (domain !== '')! && !faded && !domain.startsWith('https://')
</script>

<Popover type="error" placement="right" bind:show={showError}>
  <Box wrapper cx={{ width: '$5xl' }}>
    <Input
      disabled={faded}
      type="text"
      bind:value={domain}
      placeholder="Example: https://www.radixdlt.com"
    />
  </Box>
  <Text slot="content">url has to begin with https://</Text>
</Popover>
