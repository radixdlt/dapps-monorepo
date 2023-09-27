<script lang="ts">
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'
  import type { NonFungibleResource } from '@api/utils/entities/resource'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import Metadata from '@components/metadata/Metadata.svelte'
  import type {
    EntityMetadataItem,
    MetadataTypedValue
  } from '@radixdlt/babylon-gateway-api-sdk'
  import Resource from '../resource/Resource.svelte'
  import type { NonFungible } from '@api/utils/nfts'

  export let nft: Promise<NonFungible>
  export let resource: Promise<NonFungibleResource>
  export let associatedDapps: Promise<
    {
      address: string
      name: string
      iconUrl: string
    }[]
  >

  const metadataItem = (
    key: string,
    value: unknown,
    type: MetadataTypedValue['type']
  ) =>
    ({
      key,
      value: {
        typed: {
          type,
          value
        }
      }
    } as EntityMetadataItem)

  $: metadata = nft.then(({ id, type, nftData }) =>
    [metadataItem('id', id, 'String')].concat(
      type === 'generalNft'
        ? nftData.nonStandard.map(({ kind, field_name, value }) =>
            metadataItem(field_name, value, kind)
          )
        : Object.values(nftData.standard)
            .filter((data) => data.field_name !== 'name')
            .map(({ field_name, value, kind }) =>
              metadataItem(field_name, value, kind)
            )
    )
  )

  $: imageUrl = Promise.all([nft, resource]).then(([nft, resource]) =>
    nft.type === 'generalNft'
      ? nft.nftData.standard.key_image_url?.value
      : resource.metadata.standard.icon_url?.value?.href
  )

  $: description = Promise.all([nft, resource]).then(([nft, resource]) =>
    nft.type === 'generalNft'
      ? nft.nftData.standard.description?.value
      : resource.metadata.standard.description?.value
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

  <Metadata {metadata} />
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
