<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'

  export let data: LayoutData
</script>

<SearchPage
  --border="var(--theme-border-separator)"
  title="Pool"
  address={data.address}
  menuItems={[
    [
      {
        id: 'summary',
        label: 'Summary'
      }
    ],
    [
      { id: 'tokens', label: 'Tokens' },
      { id: 'pool-units', label: 'Pool Units' },
      { id: 'staking', label: 'Staking' }
    ],
    [
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
