<script lang="ts">
  import Package from '@dashboard-pages/search-pages/package/Package.svelte'
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { PageData } from './$types'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'

  export let data: PageData

  let notFound = false

  data.promises.metadata.catch(() => (notFound = true))
</script>

{#if notFound}
  <NotFound />
{:else}
  <SearchPage title="Package" address={data.address}>
    <Package metadata={data.promises.metadata} />
  </SearchPage>
{/if}
