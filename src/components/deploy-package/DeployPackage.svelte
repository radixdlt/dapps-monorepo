<script lang="ts">
  import Button from '@components/_base/button/Button.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { useMachine } from '@xstate/svelte'
  import { stateMachine } from './deploy-package-state-machine'
  import FileUpload, {
    type FileItem
  } from '@components/file-upload/FileUpload.svelte'
  import { without } from 'ramda'

  const { state, send } = useMachine(stateMachine)

  const allowedFileTypes = ['wasm', 'abi']

  let files: FileItem[] = []

  const handleRemoveFile = (_: Error, file: FileItem) =>
    (files = without([file], files))

  const handleAddFile = (item: FileItem) => {
    files = [...files, item]

    const wasm = files.find((file) => file.fileExtension === 'wasm')?.file
    const abi = files.find((file) => file.fileExtension === 'abi')?.file

    if (wasm && abi) send('UPLOAD', { wasm, abi })
  }
</script>

<Box transparent>
  {#if $state.matches('not-uploaded')}
    <FileUpload
      acceptedFileTypes={allowedFileTypes.filter(
        (type) => !files.map((file) => file.fileExtension).includes(type)
      )}
      {acceptedFileTypes}
    />
  {:else if $state.matches('uploading')}
    Uploading...
  {:else if $state.matches('uploaded')}
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
