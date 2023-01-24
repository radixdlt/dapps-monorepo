<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import type { TransformWithOverview } from '@stateMachines/transformers'
  import { boxStyle } from './SendTokenForm.svelte'

  export let resources: TransformWithOverview | undefined
  export let selectedFromAccount: string
  export let selectedToAccount: string
  export let setTransactionManifest: (manifest: string) => void
  export let setResourceSelected: (selected: boolean) => void

  $: console.log(resources)

  const getSendNFTManifest = (
    nfts: {
      resourceAddress: string
      id: string
    }[],
    fromAccount: string,
    toAccount: string
  ) => {
    const x = `
    ${nfts.reduce(
      (prev, cur, i) =>
        `
      CALL_METHOD 
        ComponentAddress("${fromAccount}") 
        "withdraw_by_ids"
        Array<NonFungibleId>(NonFungibleId(${cur.id}u32))
        ResourceAddress("${cur.resourceAddress}");
      
      TAKE_FROM_WORKTOP_BY_IDS
        Array<NonFungibleId>(NonFungibleId(${cur.id}u32))
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
    return x
  }

  let selected: TransformWithOverview = []

  $: options =
    resources?.map((resource) => ({
      ...resource,
      label: resource.key
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
  <Checkbox bind:options bind:selected let:label loading={!resources}>
    <Text inline bold underlined>{label}</Text>
  </Checkbox>
</Box>
