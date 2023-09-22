<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'

  export let data: LayoutData

  let notFound = false

  data.promises.entity.catch(() => (notFound = true))
</script>

{#if notFound}
  <NotFound />
{:else}
  <SearchPage
    title="Pool"
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
        }
      ]
    ]}
    activeTab={data.pageName}
    on:navigate={({ detail }) => goto(detail)}
  >
    <slot />
  </SearchPage>
{/if}
