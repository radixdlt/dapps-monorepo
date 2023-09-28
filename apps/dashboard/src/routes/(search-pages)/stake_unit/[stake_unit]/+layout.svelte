<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import { goto } from '$app/navigation'
  import type { LayoutData } from './$types'
  import ErrorPage from '@dashboard-pages/error-page/ErrorPage.svelte'

  export let data: LayoutData

  let error: any

  data.promises.stakeUnit
    .then((entity) => {
      if (!entity) error = { status: 404 }
    })
    .catch((e) => {
      error = e.errorResponse
    })
</script>

{#if error}
  <ErrorPage status={error.status} traceId={error.traceId} />
{:else}
  <SearchPage
    title="Radix Network Liquid Stake Units"
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
        }
      ]
    ]}
    activeTab={data.pageName}
    on:navigate={({ detail }) => goto(detail)}
  >
    <slot />
  </SearchPage>
{/if}
