<script lang="ts">
  import SkeletonLoader from '@svelte-ui/components/_base/skeleton-loader/SkeletonLoader.svelte'
  import NftImage from '@svelte-ui/components/_base/nft-image/NftImage.svelte'
  import Resource from '../resource/Resource.svelte'
  import NftDataRow from './NftDataRow.svelte'
  import type { NonFungible } from '@common/api/utils/nfts'
  import type { NonFungibleResource } from '@common/api/utils/entities/resource/non-fungible'

  export let nft: Promise<NonFungible>
  export let resource: Promise<NonFungibleResource>
  export let associatedDapps: Promise<
    {
      address: string
      name: string
      iconUrl: string
    }[]
  >

  $: imageUrl = Promise.all([nft, resource]).then(([nft, resource]) =>
    nft.type === 'generalNft'
      ? nft.nftData.expected.key_image_url?.value
      : resource.metadata.expected.icon_url?.typed.value
  )

  $: description = Promise.all([nft, resource]).then(([nft, resource]) =>
    nft.type === 'generalNft'
      ? nft.nftData.expected.description?.value
      : resource.metadata.expected.description?.typed.value
  )

  const imageSize = 'large'
</script>

<div class="nft-image">
  {#await imageUrl}
    <NftImage size={imageSize} />
  {:then url}
    <NftImage {url} size={imageSize} />
  {/await}
</div>

<div class="card info-card">
  <h2>
    {#await nft}
      <SkeletonLoader />
    {:then { nftData: { expected: { name } } }}
      {#if name?.value}
        {name?.value}
      {/if}
    {/await}
  </h2>

  {#await description}
    <SkeletonLoader count={3} />
  {:then description}
    {#if description}
      {description}
    {/if}
  {/await}
  <div>
    {#await nft}
      <SkeletonLoader />
    {:then nft}
      <NftDataRow value={{ kind: 'String', field_name: 'ID', value: nft.id }} />
      {#each nft.type === 'generalNft' ? nft.nftData.nonStandard : Object.values(nft.nftData.expected).filter((data) => data.field_name !== 'name') as value}
        <NftDataRow {value} />
      {/each}
    {/await}
  </div>
</div>

<h2 class="resource-card-header">Belongs To:</h2>

<Resource
  {resource}
  {associatedDapps}
  showAddressInMetadata
  scrollIntoView={false}
/>

<style lang="scss">
  .nft-image {
    width: fit-content;
    margin: var(--spacing-2xl) auto var(--spacing-3xl) auto;
  }

  .info-card {
    padding: var(--spacing-3xl) var(--spacing-2xl);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
    margin: var(--spacing-2xl) 0;
  }

  .resource-card-header {
    margin: var(--spacing-3xl) 0 var(--spacing-xl) 0;
  }
</style>
