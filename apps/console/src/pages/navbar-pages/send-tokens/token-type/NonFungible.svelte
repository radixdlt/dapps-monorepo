<script lang="ts">
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import type { Resources } from '@api/_deprecated/utils/entities/resource'
  import CheckedList from '@components/_base/checked-list/CheckedList.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { getSendNFTManifest } from '../manifests'
  import Label from '$lib/Label.svelte'
  import { RadixNetworkConfigById } from '@common/gateway-sdk'
  import { CURRENT_NETWORK } from '@networks'
  import type { NonFungible } from '@api/_deprecated/utils/nfts'

  export let resources: Promise<Resources[number]['nonFungible']>
  export let selectedFromAccount: string = ''
  export let selectedToAccount: string = ''
  export let setTransactionManifest: (manifest: string) => void
  export let setResourceSelected: (selected: boolean) => void

  const dashboardUrl = RadixNetworkConfigById[CURRENT_NETWORK.id].dashboardUrl

  $: options = resources.then((resources) =>
    resources
      .map(({ nonFungibles }) => nonFungibles as NonFungible[])
      .flat()
      .map(
        ({
          address,
          id,
          nftData: {
            standard: { name }
          }
        }) => ({
          label: name?.value ?? address.nonFungibleAddress,
          address: address.nonFungibleAddress,
          resourceAddress: address.resourceAddress,
          id: id as string,
          checked: false
        })
      )
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

{#await resources}
  <SkeletonLoader />
{:then resources}
  {#if resources.length === 0}
    <Text mx="large" bold>No NFTs in currently selected account.</Text>
  {:else}
    <Label>Choose NFTs to send</Label>
  {/if}
{/await}

{#await options}
  <SkeletonLoader />
{:then options}
  <div class="section">
    <CheckedList {options} bind:selected let:option loading={!resources}>
      <Text inline bold underlined>
        <a href="{dashboardUrl}/nft/{encodeURIComponent(option.address)}"
          >{option.label}</a
        >
      </Text>
    </CheckedList>
  </div>
{/await}

<style lang="scss">
  .section {
    margin-bottom: 1rem;
  }
</style>
