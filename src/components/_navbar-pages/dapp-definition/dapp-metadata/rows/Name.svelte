<script lang="ts">
  import Input from '@components/_base/input/Input.svelte'
  import Box from '@components/_base/box/Box.svelte'

  export let name: string
  export let faded: boolean
</script>

<Box wrapper cx={{ width: '$5xl' }}>
  <Input
    disabled={faded}
    type="text"
    bind:value={name}
    placeholder="This dApp's name"
  />
</Box>
