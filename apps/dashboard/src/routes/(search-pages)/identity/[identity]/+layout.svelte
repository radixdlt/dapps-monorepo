<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'
  import type { ComponentProps } from 'svelte'
  import ErrorPage from '@dashboard-pages/error-page/ErrorPage.svelte'

  export let data: LayoutData

  let error: ComponentProps<ErrorPage>['status']

  data.promises.entityDetails.catch((e) => {
    error = e.status
  })
</script>

{#if error}
  <ErrorPage status={error} />
{:else}
  <SearchPage
    --border="var(--theme-border-separator)"
    title="Identity"
    address={data.address}
    activeTab={data.activeTab || 'metadata'}
    menuItems={[[{ id: 'metadata', label: 'Metadata' }]]}
    on:navigate={({ detail }) => goto(detail)}
  >
    <slot />
  </SearchPage>
{/if}
