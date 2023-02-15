<script lang="ts">
  import Input from '@components/_base/input/Input.svelte'
  import Box from '@components/_base/box/Box.svelte'

  export let faded: boolean
  export let domain: string
</script>

<Box wrapper cx={{ width: '$5xl' }}>
  <Input
    disabled={faded}
    type="text"
    bind:value={domain}
    placeholder="Example: radixdlt.com"
  />
</Box>
