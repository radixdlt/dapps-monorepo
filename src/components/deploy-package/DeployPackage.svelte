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
  import { accounts } from '@stores'
  import Select from '@components/_base/select/Select.svelte'
  import { shortenAddress } from '@utils'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'

  const { state, send } = useMachine(stateMachine)

  let files: FileItem[] = []

  const handleRemoveFile = (_: Error, file: FileItem) => {
    files = without([file], files)
    if (
      $state.matches({
        connected: {
          'uploading-files': 'uploaded'
        }
      })
    ) {
      send('REMOVE_FILE')
    }
  }

  const handleAddFile = (item: FileItem) => {
    files.push(item)

    const wasm = files.find((file) => file.fileExtension === 'wasm')?.file
    const abi = files.find((file) => file.fileExtension === 'abi')?.file

    if (wasm && abi) send('UPLOAD_FILES', { wasm, abi })
  }

  $: if ($state.matches('error')) {
    AlertToast({
      title: 'Package deployment',
      text: $state.context.error.message,
      type: 'error'
    })()
  }

  $: if (
    $state.matches({
      connected: {
        'deploying-package': 'success'
      }
    })
  ) {
    AlertToast({
      title: 'Package deployment',
      text: `Package deployment successful! Tx id: ${shortenAddress(
        $state.context.intentHash!
      )}`,
      type: 'success'
    })()
  }

  $: deployButtonEnabled = $state.matches({
    connected: {
      'selecting-badge': 'selected',
      'uploading-files': 'uploaded'
    }
  })

  $: if ($accounts) send('CONNECT')
</script>

<Box transparent>
  <Box transparent>
    <Text size={'xxlarge'} bold>Deploy package</Text>
  </Box>
  <Box transparent>
    <Text
      >Deploy a new blueprint package to the Radix Betanet. To control aspects
      of the package, like setting metadata or claiming royalties, you must
      specify a badge NFT for authorization.</Text
    >
  </Box>
  <center>
    {#if $state.matches('not-connected')}
      <Text bold>Please connect your radix wallet to get started.</Text>
    {/if}

    {#if $state.matches('connected')}
      <Box transparent cx={{ maxWidth: '50%', minWidth: '450px' }}>
        <FileUpload
          acceptedFileTypes={['.wasm', 'wasm']}
          onRemoveFile={handleRemoveFile}
          onAddFile={handleAddFile}
          labelIdle="Drop the package WASM file here, or <span class='filepond--label-action'>Browse</span>"
          maxFiles={1}
        />
        <FileUpload
          acceptedFileTypes={['.abi', 'abi']}
          onRemoveFile={handleRemoveFile}
          onAddFile={handleAddFile}
          labelIdle="Drop the package ABI file here, <span class='filepond--label-action'>Browse</span>"
          maxFiles={1}
        />
      </Box>
      <Box transparent cx={{ width: '30%' }}>
        <Box transparent>
          <Select
            placeholder="Select account"
            handleSelect={(e) =>
              send({
                type: 'SELECT_ACCOUNT',
                accountAddress: e.id
              })}
            options={[
              ...$accounts.map((resource) => ({
                id: resource.address,
                label: shortenAddress(resource.address)
              }))
            ]}
          />
        </Box>
        <Box transparent>
          {#if $state.context.non_fungible_resources.length > 0}
            <Select
              placeholder="Select badge"
              handleSelect={(e) =>
                send({
                  type: 'SELECT_BADGE',
                  badgeAddress: e.id
                })}
              options={[
                ...$state.context.non_fungible_resources.map((resource) => ({
                  id: resource.address,
                  label: shortenAddress(resource.address)
                }))
              ]}
            />
          {:else}
            <Select placeholder="Select badge" />
          {/if}
        </Box>
      </Box>

      <Box
        transparent
        hidden={!$state.matches({
          connected: { 'selecting-account': 'selected' }
        })}
      >
        <Text>
          Don't already have a badge NFT you want to use to control your
          package?
          <Text
            on:click={() => send('CREATE_BADGE')}
            cx={{ display: 'inline', cursor: 'pointer' }}
            underlined
          >
            Click here
          </Text>
          to create one.
        </Text>
      </Box>

      <Button
        disabled={!deployButtonEnabled}
        on:click={() => send({ type: 'DEPLOY' })}
      >
        {#if $state.matches({ connected: { 'deploying-package': 'deploy' } })}
          <LoadingSpinner />
        {:else}
          Deploy package
        {/if}
      </Button>
    {/if}
  </center>
</Box>
