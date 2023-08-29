<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type { NonFungible, NonFungibleResource } from '@api/utils/resources'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import MetadataTable from '@components/metadata-table/MetadataTable.svelte'
  import type {
    EntityMetadataItem,
    MetadataTypedValue
  } from '@radixdlt/babylon-gateway-api-sdk'
  import Resource from '../resource/Resource.svelte'

  export let nft: Promise<NonFungible>
  export let resource: Promise<NonFungibleResource>
  export let associatedDapps: Promise<
    {
      name: string
      iconUrl: string
    }[]
  >

  const metadataItem = (
    key: string,
    value: string,
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

  $: nonStandardData = nft.then(({ nonStandardData }) =>
    nonStandardData.map(({ kind, field_name, value }) =>
      metadataItem(field_name, value, kind)
    )
  )

  const imageSize = 'large'
</script>

<div class="card nft-image">
  {#await nft}
    <NftImage size={imageSize} />
  {:then { iconUrl }}
    <NftImage url={iconUrl} size={imageSize} />
  {/await}
</div>

<div class="card info-card">
  <h2>
    {#await nft}
      <SkeletonLoader />
    {:then { name, id }}
      {#if name}
        {name}
      {/if}
      <span class="subtext">{id}</span>
    {/await}
  </h2>

  {#await nft}
    <SkeletonLoader count={3} />
  {:then { description }}
    {#if description}
      {description}
    {/if}
  {/await}

  <MetadataTable metadata={nonStandardData} />
</div>

<h2 class="resource-card-header">Belongs To:</h2>

<Resource {resource} {associatedDapps} />

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
