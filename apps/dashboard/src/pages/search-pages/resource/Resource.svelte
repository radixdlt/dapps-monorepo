<script lang="ts">
  import PillsMenu from '@svelte-ui/components/_base/pills-menu/PillsMenu.svelte'
  import Metadata from '@svelte-ui/components/metadata/Metadata.svelte'
  import type { metadataItem } from '../utils'
  import SummaryTab from '../SummaryTab.svelte'
  import type { ComponentProps } from 'svelte'
  import { formatTokenValue } from '@common/utils/formatting'
  import AuthConfigurationTab from '$lib/auth/AuthConfigurationTab.svelte'
  import type { NonFungibleResource } from '@common/api/utils/entities/resource/non-fungible'
  import type { FungibleResource } from '@common/api/utils/entities/resource/fungible'
  import type { PoolUnit } from '@common/api/utils/entities/resource/fungible/pool-unit'

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

  export let scrollIntoView = true

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
          resource.metadata.expected.pool?.typed.value,
          'GlobalAddress'
        ])
      }
    }

    return metadata
  })
</script>

<PillsMenu items={tabs} bind:active={activeTab} {scrollIntoView} />

{#if activeTab === 'summary'}
  <div class="card info-card">
    <SummaryTab
      entity={resource}
      standardMetadata={resource.then(({ metadata }) => metadata.expected)}
      {nonMetadataItems}
      {associatedDapps}
      omittedKeys={['pool']}
      {redeemableTokens}
      behaviors={resource.then(({ behaviors }) => behaviors)}
    />
  </div>
{/if}
{#if activeTab === 'metadata'}
  <div class="card info-card">
    <Metadata metadata={resource.then(({ metadata: { all } }) => all)} />
  </div>
{/if}
{#if activeTab === 'auth'}
  {#await resource then resource}
    <div class="margin-top">
      <AuthConfigurationTab
        auth={resource.auth}
        hideRules={new Set([
          'royalty_setter',
          'royalty_setter_updater',
          'royalty_locker',
          'royalty_locker_updater',
          'royalty_claimer',
          'royalty_claimer_updater'
        ])}
      />
    </div>
  {/await}
{/if}

<style>
  .info-card {
    padding: var(--spacing-2xl);
    display: flex;
    flex-direction: column;
    margin: var(--spacing-2xl) 0;
  }

  .margin-top {
    margin-top: var(--spacing-2xl);
  }
</style>
