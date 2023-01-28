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
  import { accounts } from '@stores'
  import Select from '@components/_base/select/Select.svelte'
  import { getNFTAddress, shortenAddress } from '@utils'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'
  import { goto } from '$app/navigation'

  const { state, send } = useMachine(stateMachine, { devTools: true })

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

  $: if (
    $state.matches({
      connected: {
        'selecting-account': {
          'creating-badge': 'badge-created'
        }
      }
    })
  ) {
    send({
      type: 'SELECT_ACCOUNT'
    })
  }

  $: deployButtonEnabled = $state.matches({
    connected: {
      'selecting-badge': 'selected',
      'uploading-files': 'uploaded'
    }
  })

  $: if ($accounts) send('CONNECT')

  $: if ($state.matches({ connected: { 'deploying-package': 'success' } }))
    goto(
      `deploy-package/success?` +
        `txID=${$state.context.intentHash}&` +
        `packageAddress=${$state.context.packageAddress}&` +
        `badgeName=${$state.context.badge.name}&` +
        `badgeAddress=${$state.context.badge.address}&` +
        `badgeId=${$state.context.badge.id}`
    )
</script>

<Box>
  <Text size="xxlarge" mb="medium" bold>Deploy Package</Text>
  {#if $state.matches('not-connected')}
    <Text bold>Please connect your Radix Wallet to get started.</Text>
  {/if}
</Box>
{#if $state.matches( { connected: { 'deploying-package': 'idle' } } ) || $state.matches( { connected: { 'deploying-package': 'deploy' } } )}
  <Box>
    <Text
      >Deploy a new blueprint package to the Radix Betanet by attaching your
      WASM and ABI files to a deploy transaction.</Text
    >
  </Box>
  <center>
    <Box cx={{ maxWidth: '50%', minWidth: '450px' }}>
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
    <Box>
      <Text
        >To control aspects of the package you deploy, like setting metadata or
        claiming royalties, you must specify a badge NFT for authorization.
        Choose one of your accounts where you have a badge, or where you’d like
        to hold one.</Text
      >
    </Box>
    <Box cx={{ width: '30%' }}>
      <Box>
        <Select
          placeholder="Select Account"
          handleSelect={(e) =>
            send({
              type: 'SELECT_ACCOUNT',
              address: e.account.address
            })}
          options={[
            ...($accounts || []).map((account, i) => ({
              account,
              id: i,
              label: `${account.label} (${shortenAddress(account.address)})`
            }))
          ]}
        />
      </Box>
      <Box>
        {#if $state.context.non_fungible_resources.length > 0}
          <Select
            placeholder="Select Badge NFT"
            handleSelect={(e) =>
              send({
                type: 'SELECT_BADGE',
                index: e.id
              })}
            options={[
              ...$state.context.non_fungible_resources.map((resource, i) => ({
                id: i,
                label: `${resource.name ?? ''} ${
                  resource.name ? '(' : ' '
                }${getNFTAddress(resource.address, resource.id)}${
                  resource.name ? ')' : ' '
                }`
              }))
            ]}
          />
        {:else}
          <Select placeholder="Select Badge NFT" />
        {/if}
      </Box>
    </Box>

    <Box
      hidden={!$state.matches(
        // @ts-ignore
        { connected: { 'selecting-account': 'selected' } }
      )}
    >
      <Text>
        <Text
          on:click={() => send('CREATE_BADGE')}
          cx={{ display: 'inline', cursor: 'pointer' }}
          underlined
        >
          Click here
        </Text>
        to create a simple badge NFT.
      </Text>
    </Box>

    <Box px="none" mx="none">
      <Button
        disabled={!deployButtonEnabled}
        on:click={() => send({ type: 'DEPLOY' })}
      >
        {#if $state.matches(// @ts-ignore
          { connected: { 'deploying-package': 'deploy' } })}
          <LoadingSpinner />
        {:else}
          Deploy package
        {/if}
      </Button>
    </Box>
  </center>
{/if}
