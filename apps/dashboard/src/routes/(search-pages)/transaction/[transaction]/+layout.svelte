<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'

  export let data: LayoutData

  data.promises.tx.catch((_) => {
    goto('/not-found')
  })
</script>

<SearchPage
  title="Transaction"
  address={data ? data.address : ''}
  activeTab={data.activeTab || 'details'}
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
