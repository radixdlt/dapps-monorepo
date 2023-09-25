<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'
  import ErrorPage from '@dashboard-pages/error-page/ErrorPage.svelte'

  export let data: LayoutData

  let error: any

  data.promises.entity.catch((e) => {
    error = e.errorResponse
  })
</script>

{#if error}
  <ErrorPage status={error.status} traceId={error.traceId} />
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
