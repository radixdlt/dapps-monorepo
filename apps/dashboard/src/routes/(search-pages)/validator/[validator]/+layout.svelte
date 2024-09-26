<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'

  export let data: LayoutData
</script>

<SearchPage
  --border="var(--theme-border-separator)"
  title="Validator"
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
        id: 'auth',
        label: 'Configuration'
      }
    ],
    [
      { id: 'tokens', label: 'Tokens' },
      { id: 'nfts', label: 'NFTs' },
      { id: 'pool-units', label: 'Pool Units' },
      { id: 'staking', label: 'Staking' }
    ]
  ]}
  activeTab={data.pageName}
  on:navigate={({ detail }) => goto(detail)}
>
  <slot />
</SearchPage>
