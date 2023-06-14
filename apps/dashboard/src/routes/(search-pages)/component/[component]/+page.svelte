<script lang="ts">
  import Component from '@pages/_search-pages/component/Component.svelte'
  import SearchPage from '@pages/_search-pages/SearchPage.svelte'

  import type { PageData } from './$types'

  export let data: PageData
</script>

<SearchPage title="Component" address={data.componentAddress}>
  <Component address={data.componentAddress} />
</SearchPage>
