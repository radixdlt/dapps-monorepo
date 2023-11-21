<script lang="ts">
  import { derived, writable } from 'svelte/store'
  import Select from '@components/../dev-console/form/Select.svelte'
  import Label from '@components/../dev-console/form/Label.svelte'
  import { accounts } from '@stores'
  import {
    getAccountData,
    type FungibleResource,
    type NonFungibleResource,
    type TransformedNonFungible
  } from '@api/utils/entities/resource'
  import { shortenAddress } from '@utils'
  import type { AccessRule } from '../deploy-package/side-effects'

  type Resource =
    | FungibleResource
    | (NonFungibleResource & {
        nonFungibles: TransformedNonFungible['nonFungibles']
      })

  const ownerRoleType = {
    none: 'none',
    badge: 'badge',
    allowAll: 'allowAll'
  } as const

  let accountResourcesMap = writable<Map<string, Resource>>(new Map())
  let resourceSelectItems = writable<{ id: string; label: string }[]>([])
  let selectedResource = writable<Resource | undefined>()
  let selectedNftAddress = writable<string | undefined>()
  let status = writable<'sendingToWallet' | 'initial'>('initial')

  export let selectedOwnerRole = writable<string>(ownerRoleType.none)
  export let accessRule = writable<AccessRule | undefined>()

  const ownerRoleSelectItems = [
    { id: ownerRoleType.none, label: 'None' },
    { id: ownerRoleType.badge, label: 'Badge' },
    { id: ownerRoleType.allowAll, label: 'Allow all' }
  ]

  export let isValid = writable<boolean>(false)

  const getAccessRule = (): AccessRule | undefined => {
    const ownerRole = $selectedOwnerRole
    const selected = $selectedResource
    const selectedNft = $selectedNftAddress
    console.log(ownerRole, selected, selectedNft)
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
  }

  $: {
    const isBadgeSelected = $selectedOwnerRole === ownerRoleType.badge
    const isResourceSelected = !!$selectedResource

    // Valid for allowAll and none
    if (!isBadgeSelected) $isValid = true
    // Valid for fungible and non-fungible badge
    else if (isBadgeSelected && isResourceSelected) $isValid = true
    else $isValid = false

    $accessRule = getAccessRule()
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
    $resourceSelectItems = resources.map((resource) => ({
      id: resource.address,
      label: `${
        resource.metadata.standard.name?.value || 'Unnamed resource'
      } (${shortenAddress(resource.address)})`
    }))
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

  $: {
    resetResourceState()
    getAccountData($accounts.map(({ address }) => address))
      .then((accounts) => accounts.map(accountStateToResources))
      .then((resources) => resources.flat())
      .then((resources) => setResourceState(resources))
  }
</script>

<div class="content">
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

    {#if $selectedOwnerRole === ownerRoleType.badge}
      <div class="form-item">
        <Label disabled={$isFormDisabled}>Resource address</Label>
        <Select
          placeholder="Select resource address"
          items={$resourceSelectItems}
          disabled={$isFormDisabled}
          on:select={({ detail: resourceAddress }) => {
            $selectedResource = $accountResourcesMap.get(resourceAddress)
            $selectedNftAddress = 'any'
          }}
        />
      </div>
    {/if}

    {#if $selectedOwnerRole === 'badge' && $selectedResource && $selectedResource.resourceType === 'non-fungible'}
      <div class="form-item">
        <Label disabled={$isFormDisabled}>NFT</Label>
        <Select
          placeholder="Select NFT"
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
