<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type { Resources } from '@api/utils/resources'
  import Box from '@components/_base/box/Box.svelte'
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { boxStyle } from '../SendTokens.svelte'

  export let resources: Promise<Resources[number]['nonFungible']>
  export let selectedFromAccount: string = ''
  export let selectedToAccount: string = ''
  export let setTransactionManifest: (manifest: string) => void
  export let setResourceSelected: (selected: boolean) => void

  const getSendNFTManifest = (
    nfts: {
      resourceAddress: string
      id: string
    }[],
    fromAccount: string,
    toAccount: string
  ) => `
    ${nfts.reduce(
      (prev, cur, i) =>
        `
      CALL_METHOD 
        Address("${fromAccount}") 
        "withdraw_non_fungibles"
        Address("${cur.resourceAddress}")
        Array<NonFungibleLocalId>(NonFungibleLocalId("${cur.id}"));

      TAKE_FROM_WORKTOP_BY_IDS 
        Array<NonFungibleLocalId>(NonFungibleLocalId("${cur.id}"))
        Address("${cur.resourceAddress}")
        Bucket("nft${i}");

      CALL_METHOD
        Address("${toAccount}")
        "deposit"
        Bucket("nft${i}");
        ` + prev,
      ``
    )}
  `

  let selected: Array<Awaited<typeof resources>[number]> = []

  $: options = resources.then((resources) =>
    resources.map((resource) => ({
      ...resource,
      label: resource.label,
      checked: false
    }))
  )

  $: setResourceSelected(selected.length > 0)

  $: setTransactionManifest(
    getSendNFTManifest(
      selected.map((nft) => ({
        resourceAddress: nft.address.split(':')[0] as string,
        id: nft.address.split(':')[1] as string
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
    <Checkbox {options} bind:selected let:option loading={!resources}>
      <Text inline bold underlined>
        <a href="/nft/{option.address}">{option.label}</a>
      </Text>
    </Checkbox>
  {/await}
</Box>
