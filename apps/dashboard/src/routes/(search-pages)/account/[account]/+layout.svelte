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
  title="Account"
  address={data.address}
  activeTab={data.activeTab || 'tokens'}
  menuItems={[
    [{ id: 'tokens', label: 'Tokens' }],
    [{ id: 'metadata', label: 'Metadata' }]
  ]}
  on:navigate={({ detail }) => goto(detail)}
>
  <slot />
</SearchPage>
