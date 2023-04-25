<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type { Resources } from '@api/utils/resources'
  import Box from '@components/_base/box/Box.svelte'
  import Checkbox from '@components/_base/checkbox/Checkbox.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { boxStyle } from '../SendTokens.svelte'
  import {
    InstructionList,
    ManifestAstValue,
    ManifestBuilder
  } from '@radixdlt/radix-engine-toolkit'
  import { CURRENT_NETWORK } from '../../../../network'

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
  ): Promise<string> => {
    if (!nfts.length || !fromAccount || !toAccount) {
      return Promise.resolve('')
    }
    const builder = new ManifestBuilder()

    nfts.forEach((nft) => {
      const nftId = BigInt(nft.id.split('#').join(''))
      builder
        .callMethod(fromAccount, 'withdraw_non_fungibles', [
          new ManifestAstValue.Address(nft.resourceAddress),
          new ManifestAstValue.Array(ManifestAstValue.Kind.NonFungibleLocalId, [
            new ManifestAstValue.NonFungibleLocalId(
              new ManifestAstValue.Integer(nftId)
            )
          ])
        ])
        .takeFromWorktopByIds(
          nft.resourceAddress,
          [
            new ManifestAstValue.NonFungibleLocalId(
              new ManifestAstValue.Integer(nftId)
            )
          ],
          (builder, bucket) =>
            builder.callMethod(toAccount, 'deposit', [bucket])
        )
    })
    const manifest = builder.build()

    return manifest
      .convert(InstructionList.Kind.String, CURRENT_NETWORK.id)
      .then((manifest: any) => manifest.instructions.value)
  }

  let selected: Array<Awaited<typeof resources>[number]> = []

  $: options = resources.then((resources) =>
    resources.map((resource) => ({
      ...resource,
      label: resource.label,
      checked: false
    }))
  )

  $: setResourceSelected(selected.length > 0)

  $: {
    getSendNFTManifest(
      selected.map((nft) => ({
        resourceAddress: nft.address,
        id: nft.id as string
      })),
      selectedFromAccount,
      selectedToAccount
    ).then(setTransactionManifest)
  }
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
