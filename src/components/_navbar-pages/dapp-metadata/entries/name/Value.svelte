<script lang="ts">
  import { context } from '../../DappMetadata.svelte'
  import Input from '@components/_base/input/Input.svelte'
  import Box from '@components/_base/box/Box.svelte'

  const name = context.get('dAppName')

  const greyedOut = context.get('greyedOut')
</script>

<Box wrapper cx={{ width: '$5xl' }}>
  <Input
    disabled={$greyedOut}
    type="text"
    bind:value={$name}
    placeholder="This dApp's name"
  />
</Box>
