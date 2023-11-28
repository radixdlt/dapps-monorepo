<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'

  export let data: LayoutData
</script>

<SearchPage
  title="Component"
  address={data.address}
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
