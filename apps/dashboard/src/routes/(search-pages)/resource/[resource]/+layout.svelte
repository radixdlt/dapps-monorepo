<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'

  export let data: LayoutData
</script>

<SearchPage
  title={data.resource.resourceType === 'non-fungible'
    ? 'Non Fungible Resource'
    : data.resource.type === 'resource'
    ? 'Fungible Resource'
    : 'Pool Unit'}
  address={data.address}
  activeTab={data.pageName}
  menuItems={[
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
        id: 'configuration',
        label: 'Configuration'
      },
      {
        id: 'holders',
        label: 'Top Holders'
      }
    ]
  ]}
  on:navigate={({ detail }) => goto(detail)}
>
  <slot />
</SearchPage>
