<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'
  import { goto } from '$app/navigation'

  export let data: LayoutData

  let notFound = false

  data.promises.accountData.catch(() => (notFound = true))
</script>

{#if notFound}
  <NotFound />
{:else}
  <SearchPage
    --border="var(--theme-border-separator)"
    title="Account"
    address={data.address}
    activeTab={data.tab}
    menuItems={[
      [
        { id: 'tokens', label: 'Tokens' },
        { id: 'nfts', label: 'NFTs' },
        { id: 'pool-units', label: 'Pool Units' }
      ],
      [
        { id: 'recent-transactions', label: 'Recent Transactions' },
        { id: 'metadata', label: 'Metadata' }
      ]
    ]}
    on:navigate={({ detail }) => goto(detail)}
  >
    <slot />
  </SearchPage>
{/if}
