<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import { goto } from '$app/navigation'
  import type { LayoutData } from './$types'

  export let data: LayoutData
</script>

<SearchPage
  title="Transaction"
  address={data ? data.address : ''}
  activeTab={data.pageName}
  menuItems={[
    [
      { id: 'summary', label: 'Summary' },
      {
        id: 'details',
        label: 'Details',
        disabled: data.promises.tx.then((tx) => !tx)
      },
      {
        id: 'raw-receipt',
        label: 'Raw receipt',
        disabled: data.promises.tx.then((tx) => !tx)
      }
    ]
  ]}
  on:navigate={({ detail }) => {
    goto(detail)
  }}
>
  <slot />
</SearchPage>
