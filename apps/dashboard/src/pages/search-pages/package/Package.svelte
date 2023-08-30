<script lang="ts">
  import PillsMenu from '@components/_base/pills-menu/PillsMenu.svelte'
  import Metadata from '@components/metadata/Metadata.svelte'
  import type { EntityMetadataItem } from '@radixdlt/babylon-gateway-api-sdk'

  export let metadata: Promise<EntityMetadataItem[]>

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

  let activeTab = 'summary'
</script>

<PillsMenu bind:active={activeTab} items={tabs}  />

<div class="card package">
  <Metadata {metadata} />
</div>

<style>
  .package {
    padding: var(--spacing-2xl);
    margin-top: var(--spacing-2xl);
  }
</style>
