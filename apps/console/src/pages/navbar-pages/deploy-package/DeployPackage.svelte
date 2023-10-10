<script lang="ts">
  import { Buffer } from 'buffer'
  import FileUpload, {
    type FileItem
  } from '@components/file-upload/FileUpload.svelte'
  import { pipe } from 'ramda'
  import type { Account } from '@stores'
  import { derived, writable } from 'svelte/store'
  import { getDeployPackageManifest, sborDecodeSchema } from './side-effects'
  import { goto } from '$app/navigation'
  import SendTxButton from '@components/send-tx-button/SendTxButton.svelte'
  import { getTransactionDetails } from '@api/gateway'
  import type { TransactionStatus } from '@radixdlt/babylon-gateway-api-sdk'
  import type { ComponentEvents } from 'svelte'
  import AccountPicker from '@components/_base/picker/account-picker/AccountPicker.svelte'

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

  let selected: Account

  const packageDeployed = writable<{
    txStatus: TransactionStatus
    txID: string
    address: string
  }>()

  const deployButtonEnabled = derived(
    [requiredUploadedFiles],
    ([{ wasm, rpd }]) => !!rpd && !!wasm && !!selected,
    false
  )

  const deployPackage = async (e: ComponentEvents<SendTxButton>['click']) => {
    const wasm = await $requiredUploadedFiles.wasm
    const rpd = await $requiredUploadedFiles.rpd
    const sborDecodedSchema = await sborDecodeSchema(rpd)

    const manifest = getDeployPackageManifest(
      selected?.address!,
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

<div class="description">
  Deploy a new blueprint package to the current network by attaching your WASM
  and RPD files and submitting a transaction using your Radix Wallet.
</div>

<div class="card">
  <div class="file-inputs">
    <FileUpload
      acceptedFileTypes={['.wasm', 'wasm']}
      onRemoveFile={(_, file) => files.removeFile(file)}
      onAddFile={files.addFile}
      labelIdle="Drop the package WASM file here - or <span class='filepond--label-action'>browse</span>"
      maxFiles={1}
    />
    <FileUpload
      acceptedFileTypes={['.rpd', 'rpd']}
      onRemoveFile={(_, file) => files.removeFile(file)}
      onAddFile={files.addFile}
      labelIdle="Drop the package RPD file here - or <span class='filepond--label-action'>browse</span>"
      maxFiles={1}
    />
  </div>

  <div class="account-description">
    Please choose an account to receive an owner badge that will be minted and
    set to control this package's metadata and royalties.
  </div>

  <div class="account-picker">
    <AccountPicker bind:selected />
  </div>
</div>
<div class="send-button">
  <SendTxButton
    buttonProps={{ disabled: !$deployButtonEnabled, size: 'big' }}
    on:click={deployPackage}
    on:response={handleResponse}
  />
</div>

<style lang="scss">
  .account-picker {
    max-width: 25rem;
  }
  .card {
    margin-top: 1rem;
    padding: 2rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
  }
  .description {
    margin-bottom: 1rem;
  }

  .account-description {
    margin-bottom: 1rem;
    align-self: center;
  }
  .account-picker {
    width: 25rem;
    align-self: center;
  }
</style>
