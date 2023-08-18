<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'

  export let data: LayoutData

  let notFound = false

  data.promises.tx
    .then((tx) => {
      if (!tx) notFound = true
    })
    .catch(() => (notFound = true))
</script>

{#if notFound}
  <NotFound />
{:else}
  <SearchPage
    title="Transaction"
    address={data ? data.address : ''}
    activeTab={data.activeTab || 'details'}
    menuItems={[
      [
        { id: 'details', label: 'Details' },
        { id: 'raw-receipt', label: 'Raw receipt' }
      ]
    ]}
    on:navigate={({ detail }) => goto(detail)}
  >
    <slot />
  </SearchPage>
{/if}
