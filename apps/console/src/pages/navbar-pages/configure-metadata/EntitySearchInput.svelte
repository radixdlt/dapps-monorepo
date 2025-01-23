<script lang="ts" context="module">
  export type EntityType =
    | 'Account'
    | 'Component'
    | 'Package'
    | 'Validator'
    | 'FungibleResource'
    | 'NonFungibleResource'
    | undefined

  export type Entity = {
    address: string
    type: EntityType
  }
</script>

<script lang="ts">
  import { writable } from 'svelte/store'
  import { onDestroy, onMount } from 'svelte'
  import { gatewayApi as gatewayApiStore } from '@stores'
  import { goto } from '$app/navigation'
  import Button from '@components/_base/button/Button.svelte'
  import Input from '$lib/input/Input.svelte'

  let entityAddressInputElement: HTMLInputElement
  let entityAddressInput = writable({ value: '', error: '', disabled: false })
  let status = writable<'initial' | 'loading'>('initial')
  let gatewayApi = $gatewayApiStore!

  export let onEntityDetails: (value: {
    address: string
    type: EntityType
  }) => void

  export let query: string | undefined = undefined

  const deriveEntityType = (
    address: string,
    type:
      | 'Component'
      | 'FungibleResource'
      | 'FungibleVault'
      | 'NonFungibleResource'
      | 'NonFungibleVault'
      | 'Package'
  ): EntityType => {
    if (type === 'Component' && address.startsWith('account_')) return 'Account'
    if (
      type === 'Component' &&
      (address.startsWith('component_') || address.startsWith('locker_'))
    )
      return 'Component'
    if (type === 'Package' && address.startsWith('package_')) return 'Package'
    if (type === 'FungibleResource' && address.startsWith('resource_'))
      return 'FungibleResource'
    if (type === 'NonFungibleResource' && address.startsWith('resource_'))
      return 'NonFungibleResource'
    if (type === 'Component' && address.startsWith('validator_'))
      return 'Validator'

    throw new Error('Not implemented')
  }

  const getEntityDetails = (address: string) => {
    onEntityDetails({ address, type: undefined })
    $status = 'loading'
    $entityAddressInput.disabled = true
    goto(`/configure-metadata?q=${address}`)
    return gatewayApi.state
      .getEntityDetailsVaultAggregated(address)
      .then((response) => {
        onEntityDetails({
          address,
          type: deriveEntityType(address, response.details?.type!)
        })
      })
      .catch((response) => {
        const invalidAddress = response.message.includes(
          'must be a valid Bech32M-encoded RadixAddress'
        )
        if (invalidAddress) $entityAddressInput.error = 'Invalid entity address'
        else
          $entityAddressInput.error =
            'Could not fetch entity details. Try again later.'
      })
      .finally(() => {
        $entityAddressInput.disabled = false
        $status = 'initial'
      })
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const isLoading = $status === 'loading'
    if (isLoading) return

    const isEnterKey = event.key === 'Enter'
    const { value, error } = $entityAddressInput

    if (isEnterKey && value) {
      getEntityDetails(value)
    } else if (value && error) $entityAddressInput.error = ''
  }

  onMount(() => {
    if (query) {
      $entityAddressInput.value = query
      getEntityDetails(query)
    }
  })

  onDestroy(() => {
    entityAddressInputElement.removeEventListener('keydown', onKeyDown)
  })
</script>

<div class="search-bar">
  <div class="search-input">
    <Input
      placeholder="Enter entity address"
      bind:value={$entityAddressInput.value}
      disabled={$entityAddressInput.disabled}
      error={$entityAddressInput.error}
      ref={(element) => {
        entityAddressInputElement = element
        element.addEventListener('keydown', onKeyDown)
      }}
    />
  </div>

  <Button
    on:click={() => getEntityDetails($entityAddressInput.value)}
    disabled={!$entityAddressInput.value ||
      !!$entityAddressInput.error ||
      $status === 'loading'}>Search</Button
  >
</div>

<style lang="scss">
  .search-input {
    display: flex;
    width: 100%;
    flex-direction: column;
  }
  .search-bar {
    display: flex;
    align-items: flex-start;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }
</style>
