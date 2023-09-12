<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'
  import { goto } from '$app/navigation'
  import type { LayoutData } from './$types'

  export let data: LayoutData

  let notFound = false

  data.promises.entity.catch(() => (notFound = true))

  let activeTab = 'summary'

  $: goto(`/validator/${data.address}/${activeTab}`)

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
    {activeTab}
    on:navigate={({ detail }) => (activeTab = detail)}
  >
    <slot />
  </SearchPage>
{/if}
