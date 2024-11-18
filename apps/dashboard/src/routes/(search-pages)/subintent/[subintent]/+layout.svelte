<script lang="ts">
  import SearchPage from '@dashboard/pages/search-pages/SearchPage.svelte'
  import type { LayoutData } from './$types'

  export let data: LayoutData
</script>

<SearchPage
  title="Subintent"
  address={data.id}
  activeTab={data.pageName}
  menuItems={[[{ id: 'summary', label: 'Summary' }]]}
>
  <slot />
</SearchPage>
