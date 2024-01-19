<script lang="ts">
  import LinkStatus from './LinkStatus.svelte'
  import { callApi } from '@api/gateway'
  import { writable } from 'svelte/store'
  export let entityAddress: string
  export let value: string

  const status = writable<
    'none' | 'loading' | 'verified' | 'notVerified' | 'error'
  >('none')

  const headerTexts = {
    verified: 'Confirmed',
    notVerified: 'Not Confirmed',
    error: 'Error'
  }

  const texts = {
    verified: 'Entity has valid two-way claim',
    notVerified:
      "Entity is not correctly confirming this dApp Definition's claim",
    error: "Can't check entity two-way claim status"
  }

  $: {
    if (
      value &&
      (value.startsWith('account_') ||
        value.startsWith('component_') ||
        value.startsWith('package_') ||
        value.startsWith('resource_') ||
        value.startsWith('validator_'))
    ) {
      status.set('loading')
      callApi('getAllEntityMetadata', value)
        .map((response) => {
          let keyToCheck = ''
          let expectedType = ''
          if (
            (value.startsWith('account_') &&
              entityAddress.startsWith('account_')) ||
            value.startsWith('resource_')
          ) {
            keyToCheck = 'dapp_definitions'
            expectedType = 'GlobalAddressArray'
          }

          if (value.startsWith('component_') || value.startsWith('package_')) {
            keyToCheck = 'dapp_definition'
            expectedType = 'GlobalAddress'
          }

          if (
            value.startsWith('account_') &&
            !entityAddress.startsWith('account_')
          ) {
            keyToCheck = 'claimed_entities'
            expectedType = 'GlobalAddressArray'
          }

          const metadataEntry = response.find(
            (item) =>
              item.key === keyToCheck && item.value.typed.type === expectedType
          )

          if (metadataEntry) {
            const typed = metadataEntry.value.typed
            if (
              typed.type === 'GlobalAddressArray' &&
              typed.values.includes(entityAddress)
            ) {
              status.set('verified')
            } else if (
              typed.type === 'GlobalAddress' &&
              typed.value === entityAddress
            ) {
              status.set('verified')
            } else {
              status.set('notVerified')
            }
          } else {
            status.set('notVerified')
          }
        })
        .mapErr(() => {
          status.set('error')
        })
    }
  }
</script>

<LinkStatus {status} {headerTexts} {texts} />
