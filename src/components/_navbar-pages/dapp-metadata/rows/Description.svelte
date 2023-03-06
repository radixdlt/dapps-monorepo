<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Textarea from '@components/_base/textarea/Textarea.svelte'

  export let faded: boolean
  export let description: string
</script>

<Box wrapper cx={{ width: '$6xl' }}>
  <Textarea
    disabled={faded}
    transparent={false}
    bind:value={description}
    size="md"
    placeholder="A brief description for this dApp (maxiumum 128 characters)"
    maxlength={258}
  />
</Box>
