<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'

  export let data: LayoutData
</script>

<SearchPage
  --border="var(--theme-border-separator)"
  title="Identity"
  address={data.address}
  activeTab={data.activeTab || 'metadata'}
  menuItems={[
    [
      { id: 'metadata', label: 'Metadata' },
      {
        id: 'recent-transactions',
        label: 'Recent Transactions'
      }
    ]
  ]}
  on:navigate={({ detail }) => goto(detail)}
>
  <slot />
</SearchPage>
