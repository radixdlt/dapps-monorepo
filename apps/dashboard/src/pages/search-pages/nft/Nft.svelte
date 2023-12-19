<script lang="ts">
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import Resource from '../resource/Resource.svelte'
  import NftDataRow from './NftDataRow.svelte'
  import type { NonFungible } from '@api/utils/nfts'
  import type { NonFungibleResource } from '@api/utils/entities/resource/non-fungible'

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
      ? nft.nftData.standard.key_image_url?.value
      : resource.metadata.expected.icon_url?.value?.href
  )

  $: description = Promise.all([nft, resource]).then(([nft, resource]) =>
    nft.type === 'generalNft'
      ? nft.nftData.standard.description?.value
      : resource.metadata.expected.description?.value
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
    {:then { nftData: { standard: { name } } }}
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
    {:then nftData}
      <NftDataRow
        value={{ kind: 'String', field_name: 'ID', value: nftData.id }}
      />
      {#each nftData.type === 'generalNft' ? nftData.nftData.nonStandard : Object.values(nftData.nftData.standard).filter((data) => data.field_name !== 'name') as value}
        <NftDataRow {value} />
      {/each}
    {/await}
  </div>
</div>

<h2 class="resource-card-header">Belongs To:</h2>

<Resource {resource} {associatedDapps} showAddressInMetadata />

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
