<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'

  export let data: LayoutData
</script>

<SearchPage
  --border="var(--theme-border-separator)"
  title="Account"
  address={data.address}
  activeTab={data.pageName}
  menuItems={[
    [
      { id: 'tokens', label: 'Tokens' },
      { id: 'nfts', label: 'NFTs' },
      { id: 'pool-units', label: 'Pool Units' }
    ],
    [
      { id: 'recent-transactions', label: 'Recent Transactions' },
      { id: 'metadata', label: 'Metadata' },
      {
        id: 'auth',
        label: 'Configuration'
      }
    ]
  ]}
  on:navigate={({ detail }) => goto(detail)}
>
  <slot />
</SearchPage>
