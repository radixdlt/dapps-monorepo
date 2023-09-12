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
  import { getDeployPackageManifest, sborDecodeSchema } from './side-effects'
  import { goto } from '$app/navigation'
  import SendTxButton from '@components/send-tx-button/SendTxButton.svelte'
  import { getTransactionDetails } from '@api/gateway'
  import type { TransactionStatus } from '@radixdlt/babylon-gateway-api-sdk'
  import type { ComponentEvents } from 'svelte'

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
    const fileData = ['wasm', 'rpd'].map((extension) =>
      $files
        .find((file) => file.fileExtension === extension)
        ?.file.arrayBuffer()
        .then(Buffer.from)
        .then((buf) => buf.toString('hex'))
    )

    return {
      wasm: fileData[0] as Promise<string>,
      rpd: fileData[1] as Promise<string>
    }
  })

  const selectedAccount = writable<(Account & { label: string }) | undefined>(
    undefined
  )

  const packageDeployed = writable<{
    txStatus: TransactionStatus
    txID: string
    address: string
  }>()

  const deployButtonEnabled = derived(
    [requiredUploadedFiles, selectedAccount],
    ([{ wasm, rpd }, selectedAccount]) => !!rpd && !!wasm && !!selectedAccount,
    false
  )

  const deployPackage = async (e: ComponentEvents<SendTxButton>['click']) => {
    const wasm = await $requiredUploadedFiles.wasm
    const rpd = await $requiredUploadedFiles.rpd
    const sborDecodedSchema = await sborDecodeSchema(rpd)

    const manifest = getDeployPackageManifest(
      $selectedAccount?.address!,
      wasm,
      sborDecodedSchema
    )

    e.detail(manifest, [wasm])
  }

  const handleResponse = async (
    e: ComponentEvents<SendTxButton>['response']
  ) => {
    const entities = (
      await getTransactionDetails(e.detail.transactionIntentHash)
    ).createdEntities

    packageDeployed.set({
      txStatus: e.detail.status,
      address: entities[0]?.entity_address as string,
      txID: e.detail.transactionIntentHash
    })
  }

  $: if ($packageDeployed) {
    goto(
      `deploy-package/success?` +
        `txID=${$packageDeployed.txID}&` +
        `txStatus=${$packageDeployed.txStatus}&` +
        `packageAddress=${$packageDeployed.address}&`
    )
  }
</script>

<Box>
  <Text>
    Deploy a new blueprint package to the Radix RCnet by attaching your WASM and
    rpd files to a deploy transaction.
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
      acceptedFileTypes={['.rpd', 'rpd']}
      onRemoveFile={(_, file) => files.removeFile(file)}
      onAddFile={files.addFile}
      labelIdle="Drop the package rpd file here, <span class='filepond--label-action'>Browse</span>"
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
  </Box>

  <Box px="none" mx="none">
    <SendTxButton
      buttonProps={{ disabled: !$deployButtonEnabled, size: 'big' }}
      on:click={deployPackage}
      on:response={handleResponse}
    />
  </Box>
</center>
