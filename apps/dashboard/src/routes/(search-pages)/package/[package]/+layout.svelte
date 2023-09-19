<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import { goto } from '$app/navigation'
  import type { LayoutData } from './$types'
  import type { ComponentProps } from 'svelte'
  import ErrorPage from '@dashboard-pages/error-page/ErrorPage.svelte'

  export let data: LayoutData

  let error: ComponentProps<ErrorPage>['status']

  data.promises.entity.catch((e) => {
    error = e.status
  })
</script>

{#if error}
  <ErrorPage status={error} />
{:else}
  <SearchPage
    title="Package"
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
        },
        {
          id: 'recent-transactions',
          label: 'Recent Transactions'
        }
      ]
    ]}
    activeTab={data.pageName}
    on:navigate={({ detail }) => goto(detail)}
  >
    <slot />
  </SearchPage>
{/if}
