<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'
  import type { LayoutData } from './$types'

  export let data: LayoutData

  let notFound = false

  data.promises.entity.catch(() => (notFound = true))

  data.promises.entity.catch(() => (notFound = true))
</script>

{#if notFound}
  <NotFound />
{:else}
  <SearchPage
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
        }
      ]
    ]}
    activeTab={data.pageName}
    on:navigate={({ detail }) => detail}
  >
    <slot />
  </SearchPage>
{/if}
