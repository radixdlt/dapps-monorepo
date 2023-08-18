<script lang="ts">
  import Component from '@dashboard-pages/search-pages/component/Component.svelte'
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { PageData } from './$types'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'

  export let data: PageData

  let notFound = false

  data.promises.details.catch(() => (notFound = true))
</script>

{#if notFound}
  <NotFound />
{:else}
  <SearchPage title="Component" address={data.address}>
    <Component details={data.promises.details} />
  </SearchPage>
{/if}
