<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import { goto } from '$app/navigation'
  import type { LayoutData } from './$types'
  import ErrorPage from '@dashboard-pages/error-page/ErrorPage.svelte'
  import type { ComponentProps } from 'svelte'

  export let data: LayoutData

  let error: ComponentProps<ErrorPage>['status']

  data.promises.stakeUnit.catch((e) => {
    error = e.status
  })
</script>

{#if error}
  <ErrorPage status={error} />
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
