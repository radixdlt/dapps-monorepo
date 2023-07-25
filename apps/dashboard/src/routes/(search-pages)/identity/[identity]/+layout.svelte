<script lang="ts">
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'
  import { goto } from '$app/navigation'

  export let data: LayoutData

  data.promises.entityDetails.catch((_) => {
    goto('/not-found')
  })
</script>

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
