<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { boxStyle } from './SendTokens.svelte'
  import type { TransformWithOverview } from './side-effects'

  export let resources: TransformWithOverview | undefined
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
        ComponentAddress("${fromAccount}") 
        "withdraw_by_ids"
        Array<NonFungibleLocalId>(NonFungibleLocalId("${cur.id}"))
        ResourceAddress("${cur.resourceAddress}");
      
      TAKE_FROM_WORKTOP
        ResourceAddress("${cur.resourceAddress}")
        Bucket("${i}");

      CALL_METHOD
        ComponentAddress("${toAccount}")
        "deposit"
        Bucket("${i}");
        
        ` + prev,
      ``
    )}
  `

  let selected: TransformWithOverview = []

  $: options =
    resources?.map((resource) => ({
      ...resource,
      label: resource.key,
      checked: false
    })) ?? []

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
  {#if resources && resources.length === 0}
    <Text mx="large" bold>No NFTs in currently selected account.</Text>
  {:else}
    <Text mx="large" bold>Choose NFTs to send</Text>
  {/if}
</Box>
<Box cx={boxStyle}>
  <div />

  <Checkbox {options} bind:selected let:option loading={!resources}>
    <Text inline bold underlined>
      <a href="/nft/{option.address}">{option.label}</a>
    </Text>
  </Checkbox>
</Box>
