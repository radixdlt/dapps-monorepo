<script lang="ts">
  import Package from '@components/_search-pages/package/Package.svelte'
  import SearchPage from '@components/_search-pages/SearchPage.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<SearchPage title="Package" address={data.packageAddress}>
  <Package address={data.packageAddress} />
</SearchPage>
