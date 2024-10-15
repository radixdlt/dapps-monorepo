<script lang="ts">
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import Resource from '../resource/Resource.svelte'
  import NftDataRow from './NftDataRow.svelte'
  import type { NonFungible } from '@api/utils/nfts'
  import type { NonFungibleResource } from '@api/utils/entities/resource/non-fungible'
  import { networkConfiguration } from '@stores'

  export let nft: Promise<NonFungible | undefined>
  export let resource: Promise<NonFungibleResource>
  export let associatedDapps: Promise<
    {
      address: string
      name: string
      iconUrl: string
    }[]
  >

  $: imageUrl = Promise.all([nft, resource]).then(([nft, resource]) =>
    nft?.type === 'generalNft'
      ? nft.nftData.expected.key_image_url?.value
      : resource.metadata.expected.icon_url?.typed.value
  )

  $: description = Promise.all([nft, resource]).then(([nft, resource]) =>
    nft?.type === 'generalNft'
      ? nft.nftData.expected.description?.value
      : resource.metadata.expected.description?.typed.value
  )

  let hasNoNft: boolean
  $: Promise.all([nft, resource]).then(([nft, resource]) => {
    const resourceAddresses = $networkConfiguration?.well_known_addresses
    if (
      ![
        resourceAddresses?.ed25519_signature_virtual_badge,
        resourceAddresses?.package_of_direct_caller_virtual_badge,
        resourceAddresses?.secp256k1_signature_virtual_badge,
        resourceAddresses?.global_caller_virtual_badge
      ].includes(resource.address)
    ) {
      hasNoNft = !nft
    }
  })

  const imageSize = 'large'
</script>

{#if hasNoNft}
  <div class="no-nft">
    <h2>There is no non-fungible with this local ID</h2>
  </div>
{:else}
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
      {:then nft}
        {#if nft}
          {@const {
            nftData: {
              expected: { name }
            }
          } = nft}
          {#if name?.value}
            {name?.value}
          {/if}
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
        {#if nft}
          <NftDataRow
            value={{ kind: 'String', field_name: 'ID', value: nft.id }}
          />
          {#each nft.type === 'generalNft' ? nft.nftData.nonStandard : Object.values(nft.nftData.expected).filter((data) => data.field_name !== 'name') as value}
            <NftDataRow {value} />
          {/each}
        {/if}
      {/await}
    </div>
  </div>
{/if}

<h2 class="resource-card-header">Belongs To:</h2>

<Resource
  {resource}
  {associatedDapps}
  showAddressInMetadata
  scrollIntoView={false}
/>

<style lang="scss">
  .no-nft {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: var(--spacing-4xl) 0;
  }

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
