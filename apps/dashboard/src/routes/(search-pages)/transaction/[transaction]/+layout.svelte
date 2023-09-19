<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'
  import type { ComponentProps } from 'svelte'
  import ErrorPage from '@dashboard-pages/error-page/ErrorPage.svelte'

  export let data: LayoutData

  let error: ComponentProps<ErrorPage>['status']

  data.promises.tx
    .then((tx) => {
      if (!tx) error = 404
    })
    .catch((e) => (error = e.status))
</script>

{#if error}
  <ErrorPage status={error} />
{:else}
  <SearchPage
    title="Transaction"
    address={data ? data.address : ''}
    activeTab={data.pageName}
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
