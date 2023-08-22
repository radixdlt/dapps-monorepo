<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type { Resources } from '@api/utils/resources'
  import Box from '@components/_base/box/Box.svelte'
  import CheckedList from '@components/_base/checked-list/CheckedList.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { boxStyle } from '../SendTokens.svelte'
  import { getSendNFTManifest } from '../manifests'

  export let resources: Promise<Resources[number]['nonFungible']>
  export let selectedFromAccount: string = ''
  export let selectedToAccount: string = ''
  export let setTransactionManifest: (manifest: string) => void
  export let setResourceSelected: (selected: boolean) => void

  $: options = resources.then((resources) =>
    resources
      .map(({ nonFungibles }) => nonFungibles)
      .flat()
      .map((nft) => ({
        label: nft.name ?? nft.address,
        address: nft.address,
        resourceAddress: nft.nonFungibleResource.resource_address,
        id: nft.id as string,
        checked: false
      }))
  )

  let selected: Awaited<typeof options> = []

  $: setResourceSelected(selected.length > 0)

  $: setTransactionManifest(
    getSendNFTManifest(
      selected.map((nft) => ({
        resourceAddress: nft.resourceAddress,
        id: nft.id as string
      })),
      selectedFromAccount,
      selectedToAccount
    )
  )
</script>

<Box wrapper cx={{ width: '30%' }}>
  {#await resources}
    <SkeletonLoader />
  {:then resources}
    {#if resources.length === 0}
      <Text mx="large" bold>No NFTs in currently selected account.</Text>
    {:else}
      <Text mx="large" bold>Choose NFTs to send</Text>
    {/if}
  {/await}
</Box>
<Box cx={boxStyle}>
  <div />
  {#await options}
    <SkeletonLoader />
  {:then options}
    <CheckedList {options} bind:selected let:option loading={!resources}>
      <Text inline bold underlined>
        <a href="/nft/{option.address}">{option.label}</a>
      </Text>
    </CheckedList>
  {/await}
</Box>
