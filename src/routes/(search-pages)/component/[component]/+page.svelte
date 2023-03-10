<script lang="ts">
  import Component from '@components/_search-pages/component/Component.svelte'
  import SearchPage from '@components/_search-pages/SearchPage.svelte'

  import type { PageData } from './$types'

  export let data: PageData
</script>

<SearchPage title="Package" address={data.componentAddress}>
  <Component address={data.componentAddress} />
</SearchPage>
