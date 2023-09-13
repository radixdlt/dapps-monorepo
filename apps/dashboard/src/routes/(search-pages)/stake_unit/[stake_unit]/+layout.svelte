<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'
  import { goto } from '$app/navigation'
  import type { LayoutData } from './$types'

  export let data: LayoutData

  let notFound = false

  data.promises.stakeUnit.catch(() => (notFound = true))
</script>

{#if notFound}
  <NotFound />
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
