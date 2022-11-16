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
  import { AlertToast } from '@components/_base/toast/Toasts'

  const { state, send } = useMachine(stateMachine)
  const frozenAllowedExtensions = ['wasm', 'abi']
  let acceptedFileTypes = ['wasm', 'abi']

  let files: FileItem[] = []

  const handleRemoveFile = (_: Error, file: FileItem) => {
    files = without([file], files)

    const shouldResetAcceptedFileTypes =
      files.length > 0 &&
      files[0].fileExtension !== file.fileExtension &&
      frozenAllowedExtensions.includes(file.fileExtension)

    if (shouldResetAcceptedFileTypes) {
      acceptedFileTypes.push(file.fileExtension)
    }
  }

  const handleAddFile = (item: FileItem) => {
    files.push(item)
    acceptedFileTypes = without([item.fileExtension], acceptedFileTypes)

    const wasm = files.find((file) => file.fileExtension === 'wasm')?.file
    const abi = files.find((file) => file.fileExtension === 'abi')?.file
    if (wasm && abi) send('UPLOAD', { wasm, abi })
  }

  $: if ($state.matches('error')) {
    AlertToast({
      title: 'Package deployment',
      text: $state.context.error.message,
      type: 'error'
    })()
  }
</script>

<Box transparent>
  {#if $state.matches('not-uploaded')}
    <FileUpload
      {acceptedFileTypes}
      onRemoveFile={handleRemoveFile}
      onAddFile={handleAddFile}
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
  {:else if $state.matches('error')}
    <Box mt="large" transparent flex="col" items="center">
      <Box transparent><Text p="large" size="large">Error! 😢</Text></Box>
      <Button on:click={() => send({ type: 'RETRY' })}
        >Click here to retry</Button
      >
    </Box>
  {/if}
</Box>
