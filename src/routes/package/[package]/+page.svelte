<script lang="ts">
  import Package from '@components/_search-pages/package/Package.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Package address={data.packageAddress} />
