<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import { goto } from '$app/navigation'
  import type { LayoutData } from './$types'

  export let data: LayoutData
</script>

<SearchPage
  title="Package"
  address={data.address}
  menuItems={[
    [
      {
        id: 'summary',
        label: 'Summary'
      },
      {
        id: 'blueprints',
        label: 'Blueprints'
      },
      {
        id: 'metadata',
        label: 'Metadata'
      },
      {
        id: 'recent-transactions',
        label: 'Recent Transactions'
      },
      {
        id: 'auth',
        label: 'Configuration'
      }
    ]
  ]}
  activeTab={data.pageName}
  on:navigate={({ detail }) => goto(detail)}
>
  <slot />
</SearchPage>
