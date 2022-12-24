<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { Buffer } from 'buffer'
  import FileUpload, {
    type FileItem
  } from '@components/file-upload/FileUpload.svelte'
  import { pipe } from 'ramda'
  import { accounts, connected } from '@stores'
  import Select from '@components/_base/select/Select.svelte'
  import { getNFTAddress, shortenAddress } from '@utils'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'
  import { derived, writable, type Writable } from 'svelte/store'
  import { createBadge, deploy, queryResources } from './side-effects'
  import Button from '@components/_base/button/Button.svelte'
  import { goto } from '$app/navigation'

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
    const fileData = ['wasm', 'abi'].map((extension) =>
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

  const selectedAccount = writable<string>()
  const selectedBadgeIndex = writable<number>()
  const badgeCreated = writable<string>()
  const deployingPackage = writable<boolean>()

  const packageDeployed = writable<{
    txID: string
    address: string
  }>()

  let setFungibleResources: (
    value: Awaited<ReturnType<typeof queryResources>>
  ) => void
  const nonFungibleResources = derived<
    Writable<string>,
    Awaited<ReturnType<typeof queryResources>>
  >(selectedAccount, ($selectedAccount, set) => {
    setFungibleResources = set
    if ($selectedAccount) queryResources($selectedAccount).then(set)
  })

  const selectedBadgeInfo = derived(
    [selectedBadgeIndex, nonFungibleResources],
    ([$selectedBadgeIndex, $nonFungibleResources]) =>
      $nonFungibleResources?.[$selectedBadgeIndex]
  )

  const deployButtonEnabled = derived(
    [requiredUploadedFiles, selectedBadgeIndex],
    ([{ wasm, abi }, $selectedBadgeIndex]) =>
      !!abi && !!wasm && $selectedBadgeIndex !== undefined,
    false
  )

  const deployPackage = async () => {
    deployingPackage.set(true)
    deploy(
      await $requiredUploadedFiles.wasm,
      await $requiredUploadedFiles.abi,
      $selectedAccount,
      $selectedBadgeInfo?.address as string
    )
      .then((result) => {
        deployingPackage.set(false)
        packageDeployed.set({
          address: result.entities[0]?.global_address as string,
          txID: result.txID
        })
      })
      .catch((e: Error) => {
        deployingPackage.set(false)
      })
  }

  const setSelectedAccount = (index: number) =>
    selectedAccount.set($accounts[index]?.address as string)

  $: if ($packageDeployed && $selectedBadgeInfo)
    goto(
      `deploy-package/success?` +
        `txID=${$packageDeployed.txID}&` +
        `packageAddress=${$packageDeployed.address}&` +
        `badgeName=${$selectedBadgeInfo.name}&` +
        `badgeAddress=${$selectedBadgeInfo.address}&` +
        `badgeId=${$selectedBadgeInfo.id}`
    )
</script>

<Box>
  <Text size="xxlarge" mb="medium" bold>Deploy Package</Text>
  {#if !$connected}
    <Text bold>Please connect your Radix Wallet to get started.</Text>
  {/if}
</Box>
{#if $connected}
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
        onRemoveFile={(_, file) => files.removeFile(file)}
        onAddFile={files.addFile}
        labelIdle="Drop the package WASM file here, or <span class='filepond--label-action'>Browse</span>"
        maxFiles={1}
      />
      <FileUpload
        acceptedFileTypes={['.abi', 'abi']}
        onRemoveFile={(_, file) => files.removeFile(file)}
        onAddFile={files.addFile}
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
          handleSelect={(e) => setSelectedAccount(e.id)}
          options={[
            ...$accounts.map((account, i) => ({
              id: i,
              label: `${account.label} (${shortenAddress(account.address)})`
            }))
          ]}
        />
      </Box>
      <Box>
        {#if $nonFungibleResources && $nonFungibleResources.length > 0}
          <Select
            placeholder="Select Badge NFT"
            handleSelect={(e) => selectedBadgeIndex.set(e.id)}
            options={[
              ...$nonFungibleResources.map((resource, i) => ({
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

    <Box hidden={!$selectedAccount}>
      <Text>
        <Text
          on:click={() =>
            createBadge($selectedAccount).then((result) => {
              badgeCreated.set(result.transactionIntentHash)
              queryResources($selectedAccount).then(setFungibleResources)
            })}
          cx={{ display: 'inline', cursor: 'pointer' }}
          underlined
        >
          Click here
        </Text>
        to create a simple badge NFT.
      </Text>
    </Box>

    <Box px="none" mx="none">
      <Button disabled={!$deployButtonEnabled} on:click={deployPackage}>
        {#if $deployingPackage}
          <LoadingSpinner />
        {:else}
          Deploy package
        {/if}
      </Button>
    </Box>
  </center>
{/if}
