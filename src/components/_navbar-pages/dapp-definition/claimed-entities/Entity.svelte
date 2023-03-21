<script lang="ts">
  import Button from '@components/_base/button/Button.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { getAddressPrefix, shortenAddress } from '@utils'

  export let address: string
  export let isLinked: boolean
  export let onLink: (manifest: typeof getManifest) => void
  export let onUnlink: (manifest: typeof getManifest) => void

  $: entityType = (
    {
      package: 'PackageAddress',
      resource: 'ResourceAddress',
      account: 'AccountAddress',
      component: 'ComponentAddress',
      transaction: undefined
    } as const
  )[getAddressPrefix(address)]

  const getManifest = (dappAddress: string) => `
      SET_METADATA
        ${entityType}("${address}")
        "dapp_definition"
        "${dappAddress}";
    `

  const link = () => onLink(getManifest)
  const unlink = () => onUnlink(getManifest)
</script>

<div class="entity">
  <div class="icon">
    {isLinked ? '✅' : '❌'}
  </div>
  <div class="address">
    <Text>{shortenAddress(address)}</Text>
  </div>
  <div class="button">
    <Button size="small" on:click={() => (isLinked ? unlink() : link())}>
      {isLinked ? 'Unlink' : 'Link'}
    </Button>
  </div>
</div>

<style>
  .entity {
    display: grid;
    grid:
      'icon address .'
      'icon address button' /
      1fr 3fr 2fr;
    align-items: center;
    background-color: var(--colors-background);
    border-radius: var(--radii-lg);
    padding: var(--space-sm);
    margin: var(--space-md) 0;
    width: 20rem;
  }

  .icon {
    display: flex;
    justify-content: center;
    grid-area: icon;
  }

  .address {
    grid-area: address;
  }

  .button {
    grid-area: button;
    display: flex;
    justify-content: flex-end;
  }
</style>
