<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type {
    FungibleResource,
    NonFungibleResource
  } from '@api/utils/resources'
  import NftImage from '@components/_base/nft-image/NftImage.svelte'
  import PillsMenu from '@components/_base/pills-menu/PillsMenu.svelte'
  import Metadata from '@components/metadata/Metadata.svelte'
  import SummaryMetadata from '../SummaryMetadata.svelte'
  import type { metadataItem } from '../utils'

  export let resource: Promise<NonFungibleResource | FungibleResource>
  export let associatedDapps: Promise<
    {
      name: string
      iconUrl: string
    }[]
  >

  let activeTab = 'summary'

  const tabs = [
    [
      {
        id: 'summary',
        label: 'Summary'
      },
      {
        id: 'metadata',
        label: 'Metadata'
      }
    ]
  ]

  $: nonMetadataItems = resource.then(
    ({ address, totalSupply }) =>
      [
        ['address', address, 'GlobalAddress'],
        ['total supply', totalSupply, 'U64']
      ] as Parameters<typeof metadataItem>[]
  )
</script>

<PillsMenu items={tabs} bind:active={activeTab} />

<div class="card info-card">
  {#if activeTab === 'summary'}
    <div class="resource-title">
      {#await resource}
        <SkeletonLoader />
      {:then { metadata: { standard: { name, iconUrl, symbol } } }}
        <NftImage url={iconUrl?.value} />

        {#if name?.value}
          <h2>
            {`${name.value} ${symbol?.value ? `(${symbol.value})` : ''}`}
          </h2>
        {/if}
      {/await}
    </div>

    {#await resource}
      <SkeletonLoader count={3} />
    {:then { metadata: { standard: { description } } }}
      {#if description?.value}
        {description.value}
      {/if}
    {/await}
  {/if}

  {#if activeTab === 'summary'}
    <SummaryMetadata
      standardMetadata={resource.then(({ metadata }) => metadata.standard)}
      {nonMetadataItems}
      {associatedDapps}
    />
  {/if}
  {#if activeTab === 'metadata'}
    <Metadata metadata={resource.then(({ metadata: { all } }) => all)} />
  {/if}
</div>

<style>
  .resource-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .info-card {
    padding: var(--spacing-2xl);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
    margin: var(--spacing-2xl) 0;
  }
</style>
