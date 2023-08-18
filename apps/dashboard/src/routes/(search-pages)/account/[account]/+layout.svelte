<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'

  export let data: LayoutData

  let notFound = false

  data.promises.entityDetails.catch(() => (notFound = true))
</script>

{#if notFound}
  <NotFound />
{:else}
  <SearchPage
    --border="var(--theme-border-separator)"
    title="Account"
    address={data.address}
    activeTab={data.activeTab || 'tokens'}
    menuItems={[
      [
        { id: 'tokens', label: 'Tokens' },
        { id: 'nfts', label: 'NFTs' }
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
