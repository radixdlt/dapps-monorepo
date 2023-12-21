<script lang="ts">
  import { Buffer } from 'buffer'
  import FileUpload from '@components/file-upload/FileUpload.svelte'
  import { derived, writable } from 'svelte/store'
  import Select from '$lib/select/Select.svelte'
  import Label from '$lib/Label.svelte'
  import { accounts, dAppToolkit } from '@stores'
  import {
    getAccountData,
    type FungibleResource,
    type NonFungibleResource,
    type TransformedNonFungible
  } from '@api/_deprecated/utils/entities/resource'
  import { shortenAddress, typedError } from '@utils'
  import { getDeployPackageManifest, sborDecodeSchema } from './side-effects'
  import { ResultAsync } from 'neverthrow'
  import { getTransactionDetails as getTransactionDetailsFn } from '@api/_deprecated/gateway'
  import { goto } from '$app/navigation'
  import type {
    AccessRule,
    OwnerAccessRuleUpdatable
  } from '../../../helpers/simple-access-rule-builder'
  import Form from '$lib/form/Form.svelte'
  import SendToWalletButton from '$lib/SendToWalletButton.svelte'
  import { track } from '../../../routes/+layout.svelte'

  type Resource =
    | FungibleResource
    | (NonFungibleResource & {
        nonFungibles: TransformedNonFungible['nonFungibles']
      })

  const ownerRoleType = {
    badge: 'badge',
    allowAll: 'allowAll',
    none: 'none'
  } as const

  let accountResourcesMap = writable<Map<string, Resource>>(new Map())
  let resourceSelectItems = writable<{ id: string; label: string }[]>([])
  let wasm = writable<string | undefined>()
  let sborDecodedSchema = writable<string | undefined>()
  let selectedOwnerRole = writable<string>(ownerRoleType.badge)
  let selectedResource = writable<Resource | undefined>()
  let selectedNftAddress = writable<string | undefined>()
  let status = writable<'sendingToWallet' | 'initial'>('initial')
  let formState = writable<Record<string, string>>({
    ownerRoleUpdatable: 'Updatable'
  })

  const ownerRoleSelectItems = [
    { id: ownerRoleType.badge, label: 'Badge' },
    { id: ownerRoleType.allowAll, label: 'Allow all' },
    { id: ownerRoleType.none, label: 'None' }
  ]

  let isFormInvalid = derived(
    [
      wasm,
      sborDecodedSchema,
      selectedOwnerRole,
      selectedResource,
      selectedNftAddress
    ],
    ([
      _wasm,
      _sborDecodedSchema,
      _selectedOwnerRole,
      _selectedResource,
      _selectedNftAddress
    ]) => {
      const areBinariesDefined = !!_wasm && !!_sborDecodedSchema
      const isBadgeSelected = _selectedOwnerRole === ownerRoleType.badge
      const isResourceSelected = !!_selectedResource

      // Binaries are always required
      if (!areBinariesDefined) return true
      // Valid for allowAll and none
      else if (!isBadgeSelected) return false
      // Valid for fungible and non-fungible badge
      else if (isBadgeSelected && isResourceSelected) return false

      return true
    }
  )

  const decodeSborSchema = (rpd: string) =>
    ResultAsync.fromPromise(sborDecodeSchema(rpd), typedError)

  const fileToHex = (file: File) =>
    ResultAsync.fromPromise(
      file
        .arrayBuffer()
        .then(Buffer.from)
        .then((buf) => buf.toString('hex')),
      typedError
    )

  const getAccessRule = (): AccessRule => {
    const ownerRole = $selectedOwnerRole
    const selected = $selectedResource
    const selectedNft = $selectedNftAddress

    if (ownerRole === ownerRoleType.allowAll)
      return { type: ownerRoleType.allowAll }
    else if (ownerRole === ownerRoleType.none)
      return { type: ownerRoleType.none }
    else if (
      ownerRole === ownerRoleType.badge &&
      selected?.resourceType === 'fungible'
    )
      return { type: 'fungible', address: selected.address }
    else if (
      ownerRole === ownerRoleType.badge &&
      selected?.resourceType === 'non-fungible' &&
      selectedNft === 'any'
    ) {
      return {
        type: 'fungible',
        address: selected.address
      }
    } else if (
      ownerRole === ownerRoleType.badge &&
      selected?.resourceType === 'non-fungible'
    ) {
      return {
        type: 'nonFungible',
        address: selectedNft!
      }
    }

    throw new Error('Invalid access rule')
  }

  const getTransactionDetails = (transactionIntentHash: string) =>
    ResultAsync.fromPromise(
      getTransactionDetailsFn(transactionIntentHash),
      typedError
    )

  const handleSendTransaction = () => {
    track('click:deploy-package')
    if ($wasm && $sborDecodedSchema) {
      const { ownerRoleUpdatable } = $formState
      const transactionManifest = getDeployPackageManifest(
        $wasm,
        $sborDecodedSchema,
        getAccessRule(),
        ownerRoleUpdatable as unknown as OwnerAccessRuleUpdatable
      )

      $status = 'sendingToWallet'
      $dAppToolkit!.walletApi
        .sendTransaction({
          transactionManifest,
          blobs: [$wasm]
        })
        .andThen(({ transactionIntentHash, status }) =>
          getTransactionDetails(transactionIntentHash).map((response) => {
            const packageAddress = response.createdEntities[0]
              ?.entity_address as string

            goto(
              `deploy-package/success?` +
                `txID=${transactionIntentHash}&` +
                `txStatus=${status}&` +
                `packageAddress=${packageAddress}&`
            )
          })
        )
        .mapErr(() => {
          $status = 'initial'
        })
    }
  }

  const accountStateToResources = (account: {
    fungible: FungibleResource[]
    nonFungible: TransformedNonFungible[]
  }): Resource[] => {
    const fungible = account.fungible
    const nfts = account.nonFungible.map((resource) => ({
      ...resource.resource,
      nonFungibles: resource.nonFungibles
    }))
    return [...fungible, ...nfts]
  }

  const setResourceState = (resources: Resource[]) => {
    resources.forEach((resource) => {
      $accountResourcesMap.set(resource.address, resource)
    })
    $resourceSelectItems = [
      { id: 'createBadge', label: 'Create new badge' },
      ...resources.map((resource) => ({
        id: resource.address,
        label: `${
          resource.metadata.standard.name?.value || 'Unnamed resource'
        } (${shortenAddress(resource.address)})`
      }))
    ]
  }

  const resetResourceState = () => {
    $accountResourcesMap.clear()
    $resourceSelectItems = []
    $selectedResource = undefined
    $selectedNftAddress = 'any'
  }

  const isFormDisabled = derived([status], ([_status]) => {
    return _status === 'sendingToWallet'
  })

  const isSendToWalletButtonDisabled = derived(
    [status, isFormInvalid],
    ([_status, _isFormValid]) => _status === 'sendingToWallet' || _isFormValid
  )

  $: {
    resetResourceState()
    getAccountData($accounts.map(({ address }) => address))
      .then((accounts) => accounts.map(accountStateToResources))
      .then((resources) => resources.flat())
      .then((resources) => setResourceState(resources))
  }
</script>

<div class="description">
  Deploy a new blueprint package to the current network by attaching your WASM
  and RPD files and submitting a transaction using your Radix Wallet.
</div>

<div class="content">
  <div class="file-inputs" class:disabled={$isFormDisabled}>
    <div>
      <FileUpload
        acceptedFileTypes={['.wasm', 'wasm']}
        onRemoveFile={() => {
          $wasm = undefined
        }}
        onAddFile={({ file }) =>
          fileToHex(file).map((hex) => {
            $wasm = hex
          })}
        labelIdle="Drop the package WASM file here - or <span class='filepond--label-action'>browse</span>"
        maxFiles={1}
      />
    </div>
    <div>
      <FileUpload
        acceptedFileTypes={['.rpd', 'rpd']}
        onRemoveFile={() => {
          $sborDecodedSchema = undefined
        }}
        onAddFile={({ file }) =>
          fileToHex(file).andThen((hex) =>
            decodeSborSchema(hex).map((decoded) => {
              $sborDecodedSchema = decoded
            })
          )}
        labelIdle="Drop the package RPD file here - or <span class='filepond--label-action'>browse</span>"
        maxFiles={1}
      />
    </div>
  </div>
  <div class="form">
    <div class="form-item">
      <Label disabled={$isFormDisabled}>Owner role</Label>
      <Select
        placeholder="Select owner role"
        items={ownerRoleSelectItems}
        selected={$selectedOwnerRole}
        disabled={$isFormDisabled}
        on:select={(value) => {
          $selectedOwnerRole = value.detail
          $selectedResource = undefined
        }}
      />
    </div>

    {#if $selectedOwnerRole === 'badge' && $selectedResource && $selectedResource.resourceType === 'non-fungible'}
      <div class="form-item">
        <Label disabled={$isFormDisabled}>Non-fungible</Label>
        <Select
          placeholder="Select non-fungible"
          selected={$selectedNftAddress}
          disabled={$isFormDisabled}
          items={[
            { id: 'any', label: 'Any' },
            ...$selectedResource.nonFungibles
              .map((nft) =>
                typeof nft === 'string'
                  ? { id: '', label: '' }
                  : {
                      id: nft.address.nonFungibleAddress,
                      label: `${
                        nft.nftData.standard.name?.value ||
                        'Unnamed non-fungible'
                      } (${shortenAddress(nft.address.id)})`
                    }
              )
              .filter((item) => item.id !== '')
          ]}
          on:select={({ detail: resourceAddress }) => {
            $selectedNftAddress = resourceAddress
          }}
        />
      </div>
    {/if}

    <Form
      disabled={$isFormDisabled}
      items={[
        {
          key: 'ownerRoleUpdatable',
          label: 'Owner role updatable',
          placeholder: 'Should the owner role be updatable?',
          formItemType: 'select',
          items: [
            { id: 'None', label: 'None' },
            { id: 'Updatable', label: 'Updatable' },
            { id: 'Fixed', label: 'Fixed' }
          ]
        }
      ]}
      state={formState}
    />

    {#if $selectedOwnerRole === ownerRoleType.badge}
      <div class="form-item">
        <Label disabled={$isFormDisabled}>Resource address</Label>
        <Select
          placeholder="Select resource address"
          items={$resourceSelectItems}
          disabled={$isFormDisabled}
          on:select={({ detail: resourceAddress }) => {
            if (resourceAddress === 'createBadge') {
              return goto('/create-token?action=create-badge')
            }
            $selectedResource = $accountResourcesMap.get(resourceAddress)
            $selectedNftAddress = 'any'
          }}
        />
      </div>
    {/if}

    {#if $selectedOwnerRole === 'badge' && $selectedResource && $selectedResource.resourceType === 'non-fungible'}
      <div class="form-item">
        <Label disabled={$isFormDisabled}>Non-fungible</Label>
        <Select
          placeholder="Select non-fungible"
          selected={$selectedNftAddress}
          disabled={$isFormDisabled}
          items={[
            { id: 'any', label: 'Any' },
            ...$selectedResource.nonFungibles
              .map((nft) =>
                typeof nft === 'string'
                  ? { id: '', label: '' }
                  : {
                      id: nft.address.nonFungibleAddress,
                      label: `${
                        nft.nftData.standard.name?.value || 'Unnamed NFT'
                      } (${shortenAddress(nft.address.id)})`
                    }
              )
              .filter((item) => item.id !== '')
          ]}
          on:select={({ detail: resourceAddress }) => {
            $selectedNftAddress = resourceAddress
          }}
        />
      </div>
    {/if}
    <SendToWalletButton
      disabled={$isSendToWalletButtonDisabled}
      loading={$status === 'sendingToWallet'}
      on:click={handleSendTransaction}
    />
  </div>
</div>

<style lang="scss">
  .description {
    margin-bottom: 3rem;
  }
  .content {
    display: flex;
    flex-direction: column;
    width: 50%;
    gap: 2rem;
    min-width: 37rem;
  }
  .form {
    width: 100%;
  }
  .file-inputs {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    div {
      width: 100%;
    }
  }

  .form-item {
    margin-bottom: 1rem;
  }
</style>
