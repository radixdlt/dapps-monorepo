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
  import {
    createBadge,
    getDeployPackageManifest,
    sborDecodeSchema
  } from './side-effects'
  import { goto } from '$app/navigation'
  import SendTxButton from '@components/send-tx-button/SendTxButton.svelte'
  import { getTransactionDetails } from '@api/gateway'
  import type { TransactionStatus } from '@radixdlt/babylon-gateway-api-sdk'
  import type { ComponentEvents } from 'svelte'
  import { getAccountData } from '@api/utils/entities/resource'
  import type { NonFungible } from '@api/utils/nfts'

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
  const selectedBadge = writable<(NonFungible & { label: string }) | undefined>(
    undefined
  )
  const badgeCreated = writable<string>()

  const packageDeployed = writable<{
    txStatus: TransactionStatus
    txID: string
    address: string
  }>()

  const nfts = derived<typeof selectedAccount, NonFungible[]>(
    selectedAccount,
    ($selectedAccount, set) => {
      if ($selectedAccount)
        getAccountData([$selectedAccount.address]).then((resources) =>
          set(
            resources[0]!.nonFungible
              .map(({ resource, nonFungibles }) =>
                nonFungibles.map((nft) => ({
                  ...nft,
                  resource: resource
                }))
              )
              .flat()
              .map((nft) => ({
                ...nft,
                label: `${
                  nft.resource.metadata.standard.name?.value ??
                  nft.resource.address
                } (${nft.id})`
              }))
          )
        )
    }
  )

  const deployButtonEnabled = derived(
    [requiredUploadedFiles, selectedBadge],
    ([{ wasm, rpd }, badge]) => !!rpd && !!wasm && badge !== undefined,
    false
  )

  const deployPackage = async (e: ComponentEvents<SendTxButton>['click']) => {
    const wasm = await $requiredUploadedFiles.wasm
    const rpd = await $requiredUploadedFiles.rpd
    const sborDecodedSchema = await sborDecodeSchema(rpd)
    const badge = $selectedBadge!

    const manifest = getDeployPackageManifest(
      $selectedAccount?.address || '',
      wasm,
      sborDecodedSchema,
      badge?.address.resourceAddress,
      badge?.id
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

  $: if ($packageDeployed && $selectedBadge) {
    goto(
      `deploy-package/success?` +
        `txID=${$packageDeployed.txID}&` +
        `txStatus=${$packageDeployed.txStatus}&` +
        `packageAddress=${$packageDeployed.address}&` +
        `badgeName=${$selectedBadge.nftData.standard.name ?? ''}&` +
        `badgeAddress=${$selectedBadge.address.resourceAddress}&` +
        `badgeId=${encodeURIComponent($selectedBadge.id)}`
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
    <Box>
      {#if $nfts && $nfts.length > 0}
        <Select
          placeholder="Select Badge NFT"
          bind:selected={$selectedBadge}
          options={$nfts}
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
      buttonProps={{ disabled: !$deployButtonEnabled, size: 'big' }}
      on:click={deployPackage}
      on:response={handleResponse}
    />
  </Box>
</center>
