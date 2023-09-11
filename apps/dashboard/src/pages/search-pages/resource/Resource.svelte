<script lang="ts">
  import type {
    FungibleResource,
    NonFungibleResource
  } from '@api/utils/entities/resource'
  import PillsMenu from '@components/_base/pills-menu/PillsMenu.svelte'
  import Metadata from '@components/metadata/Metadata.svelte'
  import SummaryMetadata from '../SummaryMetadata.svelte'
  import type { metadataItem } from '../utils'
  import SummaryTab from '../SummaryTab.svelte'

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
    <SummaryTab
      entity={resource}
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
  .info-card {
    padding: var(--spacing-2xl);
    display: flex;
    flex-direction: column;
    margin: var(--spacing-2xl) 0;
  }
</style>
