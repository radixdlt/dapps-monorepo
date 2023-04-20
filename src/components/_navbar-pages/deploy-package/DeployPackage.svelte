<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { Buffer } from 'buffer'
  import FileUpload, {
    type FileItem
  } from '@components/file-upload/FileUpload.svelte'
  import { pipe } from 'ramda'
  import type { Account } from '@stores'
  import Select from '@components/_base/select/Select.svelte'
  import { derived, writable } from 'svelte/store'
  import { createBadge, getDeployPackageManifest } from './side-effects'
  import { goto } from '$app/navigation'
  import SendTxButton from '@components/send-tx-button/SendTxButton.svelte'
  import type { sendTransaction } from '@api/wallet'
  import { getTransactionDetails } from '@api/gateway'
  import {
    getAccountData,
    type NonFungibleResource
  } from '@api/utils/resources'

  export let accounts: Account[]

  const files = pipe(
    () => writable<FileItem[]>([]),
    ({ subscribe, update }) => ({
      subscribe,
      removeFile: (fileToRemove: FileItem) =>
        update((files) => files.filter((file) => file !== fileToRemove)),
      addFile: (fileToAdd: FileItem) => update((files) => [...files, fileToAdd])
    })
  )()

  const requiredUploadedFiles = derived(files, ($files) => {
    const fileData = ['wasm', 'schema'].map((extension) =>
      $files
        .find((file) => file.fileExtension === extension)
        ?.file.arrayBuffer()
        .then(Buffer.from)
        .then((buf) => buf.toString('hex'))
    )
    return {
      wasm: fileData[0] as Promise<string>,
      abi: fileData[1] as Promise<string>
    }
  })

  const selectedAccount = writable<(Account & { label: string }) | undefined>(
    undefined
  )
  const selectedBadge = writable<NonFungibleResource | undefined>(undefined)
  const badgeCreated = writable<string>()

  const packageDeployed = writable<{
    txID: string
    address: string
  }>()

  const nonFungibleResources = derived<
    typeof selectedAccount,
    Awaited<ReturnType<typeof getAccountData>>[number]['nonFungible']
  >(selectedAccount, ($selectedAccount, set) => {
    if ($selectedAccount)
      getAccountData([$selectedAccount.address]).then((resources) =>
        set(resources[0]!.nonFungible)
      )
  })

  const deployButtonEnabled = derived(
    [requiredUploadedFiles, selectedBadge],
    ([{ wasm, abi }, badge]) => !!abi && !!wasm && badge !== undefined,
    false
  )

  const deployPackage = async (
    send: (...args: Parameters<typeof sendTransaction>) => void
  ) => {
    const wasm = await $requiredUploadedFiles.wasm
    const abi = await $requiredUploadedFiles.abi
    const badge = $selectedBadge!

    send(getDeployPackageManifest(wasm, abi, badge.address, badge.id), [
      wasm,
      abi
    ])
  }

  const handleResponse = async ({
    transactionIntentHash
  }: Awaited<ReturnType<typeof sendTransaction>>) => {
    const entities = (await getTransactionDetails(transactionIntentHash))
      .createdEntities

    packageDeployed.set({
      address: entities[0]?.global_address as string,
      txID: transactionIntentHash
    })
  }

  $: if ($packageDeployed && $selectedBadge)
    goto(
      `deploy-package/success?` +
        `txID=${$packageDeployed.txID}&` +
        `packageAddress=${$packageDeployed.address}&` +
        `badgeName=${$selectedBadge.name}&` +
        `badgeAddress=${$selectedBadge.address}&` +
        `badgeId=${$selectedBadge.id}`
    )
</script>

<Box>
  <Text>
    Deploy a new blueprint package to the Radix RCnet by attaching your WASM and
    schema files to a deploy transaction.
  </Text>
</Box>
<center>
  <Box cx={{ maxWidth: '50%', minWidth: '450px' }}>
    <FileUpload
      acceptedFileTypes={['.wasm', 'wasm']}
      onRemoveFile={(_, file) => files.removeFile(file)}
      onAddFile={files.addFile}
      labelIdle="Drop the package WASM file here, or <span class='filepond--label-action'>Browse</span>"
      maxFiles={1}
    />
    <FileUpload
      acceptedFileTypes={['.schema', 'schema']}
      onRemoveFile={(_, file) => files.removeFile(file)}
      onAddFile={files.addFile}
      labelIdle="Drop the package schema file here, <span class='filepond--label-action'>Browse</span>"
      maxFiles={1}
    />
  </Box>
  <Box>
    <Text
      >To control aspects of the package you deploy, like setting metadata or
      claiming royalties, you must specify a badge NFT for authorization. Choose
      one of your accounts where you have a badge, or where you’d like to hold
      one.</Text
    >
  </Box>
  <Box cx={{ width: '30%' }}>
    <Box>
      <Select
        placeholder="Select Account"
        bind:selected={$selectedAccount}
        options={accounts}
      />
    </Box>
    <Box>
      {#if $nonFungibleResources && $nonFungibleResources.length > 0}
        <Select
          placeholder="Select Badge NFT"
          bind:selected={$selectedBadge}
          options={$nonFungibleResources}
        />
      {:else}
        <Select placeholder="Select Badge NFT" />
      {/if}
    </Box>
  </Box>

  <Box hidden={!$selectedAccount}>
    <Text>
      <Text
        on:click={() => {
          if (!$selectedAccount) return
          createBadge($selectedAccount.address).then((result) => {
            badgeCreated.set(result.transactionIntentHash)
            selectedAccount.set($selectedAccount)
            return
          })
        }}
        cx={{ display: 'inline', cursor: 'pointer' }}
        underlined
      >
        Click here
      </Text>
      to create a simple badge NFT.
    </Text>
  </Box>

  <Box px="none" mx="none">
    <SendTxButton
      disabled={!$deployButtonEnabled}
      onClick={deployPackage}
      onResponse={handleResponse}
    />
  </Box>
</center>
