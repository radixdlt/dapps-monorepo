<script context="module" lang="ts">
  export const activeTab = writable('summary')
</script>

<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'
  import { goto } from '$app/navigation'
  import { writable, type Writable } from 'svelte/store'
  import type { LayoutData } from './$types'

  export let data: LayoutData

  let notFound = false

  data.promises.entity.catch(() => (notFound = true))

  $: goto(`/component/${data.address}/${$activeTab}`)

  data.promises.entity.catch(() => (notFound = true))
</script>

{#if notFound}
  <NotFound />
{:else}
  <SearchPage
    title="Component"
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
    activeTab={$activeTab}
    on:navigate={({ detail }) => {
        console.log('activeTab', detail);
      $activeTab = detail
    }}
  >
    <slot />
  </SearchPage>
{/if}
