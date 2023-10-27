<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'

  export let data: LayoutData
</script>

<SearchPage
  title="Transaction"
  address={data ? data.address : ''}
  activeTab={data.pageName}
  menuItems={[
    [
      { id: 'summary', label: 'Summary' },
      { id: 'details', label: 'Details' },
      { id: 'raw-receipt', label: 'Raw receipt' }
    ]
  ]}
  on:navigate={({ detail }) => {
    goto(detail)
  }}
>
  <slot />
</SearchPage>
