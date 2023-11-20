<script lang="ts">
  import type {
    FungibleResource,
    NonFungibleResource
  } from '@api/utils/entities/resource'
  import PillsMenu from '@components/_base/pills-menu/PillsMenu.svelte'
  import Metadata from '@components/metadata/Metadata.svelte'
  import type { metadataItem } from '../utils'
  import SummaryTab from '../SummaryTab.svelte'
  import type { PoolUnit } from '@api/utils/entities/pool-unit'
  import type { ComponentProps } from 'svelte'
  import { formatTokenValue } from '@utils'
  import AuthConfigurationTab from '../../../components/auth/AuthConfigurationTab.svelte'
  import type { NonFungible } from '@api/utils/nfts'

  export let resource: Promise<
    NonFungibleResource | FungibleResource | PoolUnit
  >
  export let associatedDapps: Promise<
    {
      address: string
      name: string
      iconUrl: string
    }[]
  >
  export let redeemableTokens: ComponentProps<SummaryTab>['redeemableTokens'] =
    Promise.resolve(undefined)

  export let showAddressInMetadata = false
  export let tokenInfo: {
    fungibles: Promise<FungibleResource[]>
    nonFungibles: Promise<NonFungible[]>
  }

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
      },
      {
        id: 'auth',
        label: 'Configuration'
      }
    ]
  ]

  $: nonMetadataItems = resource.then((resource) => {
    let metadata: Parameters<typeof metadataItem>[] = [
      [
        'total supply',
        formatTokenValue(resource.totalSupply).displayValue,
        'String'
      ]
    ]

    if (showAddressInMetadata) {
      metadata.push(['address', resource.address, 'GlobalAddress'])
    }

    if (resource.resourceType === 'fungible') {
      metadata.push(['divisibility', resource.divisibility, 'U8'])

      if (resource.type === 'poolUnit') {
        metadata.push([
          'associated pool component',
          resource.metadata.standard.pool?.value,
          'GlobalAddress'
        ])
      }
    }

    return metadata
  })
</script>

<PillsMenu items={tabs} bind:active={activeTab} />

<div class="card info-card">
  {#if activeTab === 'summary'}
    <SummaryTab
      entity={resource}
      standardMetadata={resource.then(({ metadata }) => metadata.standard)}
      {nonMetadataItems}
      {associatedDapps}
      omittedKeys={['pool']}
      {redeemableTokens}
      behaviors={resource.then(({ behaviors }) => behaviors)}
    />
  {/if}
  {#if activeTab === 'metadata'}
    <Metadata metadata={resource.then(({ metadata: { all } }) => all)} />
  {/if}
  {#if activeTab === 'auth'}
    {#await resource then resource}
      <AuthConfigurationTab auth={resource.auth} {tokenInfo} />
    {/await}
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
