<script lang="ts">
  import UploadFileButton from '@components/upload-file-button/UploadFileButton.svelte'
  import Button from '@components/_base/button/Button.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { useMachine } from '@xstate/svelte'
  import { stateMachine } from './deploy-package-state-machine'

  const { state, send } = useMachine(stateMachine)
</script>

<Box transparent flex="col" items="center">
  {#if $state.matches('not-uploaded')}
    <UploadFileButton
      name="Select compiled Scrypto package"
      filetypes={['.wasm']}
      onFileSelected={(file) => send({ type: 'UPLOAD', file })}
    >
      Upload WASM
    </UploadFileButton>
  {:else if $state.matches('uploading')}
    Uploading...
  {:else if $state.matches('unpublished')}
    <Button on:click={() => send({ type: 'PUBLISH' })}>Publish</Button>
    <Box mt="large" transparent>
      {$state.context.transaction}
    </Box>
  {:else if $state.matches('publishing')}
    Publishing...
  {:else if $state.matches('published')}
    Published!
  {:else if $state.matches('final')}
    <Box mt="large" transparent flex="col" items="center">
      <Box transparent><Text p="large" size="large">Success! 🎉</Text></Box>
      <Box transparent>
        <Text>Package Address</Text>
      </Box>
      <pre>
        {JSON.stringify($state.context.receipt, null, 2)}
    </pre>
    </Box>
  {/if}
</Box>
